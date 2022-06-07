import mongoose, { HydratedDocument } from 'mongoose';
import validator from 'validator';
import PasswordValidator from 'password-validator';
import { hash, compare } from 'bcrypt';
import { _RestError as RestError } from '../misc/rest-error';
import {
  _BaseModelI as BaseModelI,
  _BaseMethodsI as BaseMethodsI,
  _BaseQueryHelpersI as BaseQueryHelpersI
} from './schema-base';

/**
 * Password validation rules.
 *
 * @todo Consider banning easily breakable passwords. Use
 * https://github.com/danielmiessler/SecLists/tree/aad07fff50ca37af2926de4d07ff670bf3416fbc/Passwords
 * as a starting point.
 */
const passwordValidatorSchema = new PasswordValidator();
passwordValidatorSchema
  .is().min(10)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

/**
 * The TS interface for the User type.
 */
export interface _UserDocI {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

/**
 * Methods exposed by the user model instances.
 */
interface UserMethods extends BaseMethodsI {
  /**
   * Compares specified password guess with the actual password.
   *
   * Returns a promise that resolves with TRUE if passwords match,
   * FALSE otherwise.
   */
  verifyPassword(this: HydratedDocument<_UserDocI>, passwordGuess: string): Promise<boolean>;
}

export type _UserModelI = BaseModelI<_UserDocI, BaseQueryHelpersI, UserMethods>

export const _userSchema = new mongoose.Schema<_UserDocI, _UserModelI>(
  {
    email: {
      type: 'String',
      required: [true, 'Email address must be provided.'],
      unique: true,
      maxlength: [200, 'Email address must not be longer than 200 characters.'],
      validate: {
        validator: function(value: string): boolean {
          return validator.isEmail(value);
        },
        message: function() { return 'Provided email address is invalid.'; }
      }
    },
    password: {
      type: 'String',
      required: [true, 'Password must be provided.'],
      validate: {
        validator: function(value: string): boolean {
          return passwordValidatorSchema.validate(value) === true;
        },
        message: function() {
          return 'Password length must be between 8 and 100 characters. It must contain at least one of: uppercase and lowercase letters, a digit and a symbol. It  must not contain spaces.';
        }
      }
    },
    firstname: {
      type: 'String',
      required: [true, 'First name must be provided.'],
      minlength: [1, 'First name must be provided.'],
      maxlength: [150, 'First name must be longer than 150 characters.']
    },
    lastname: {
      type: 'String',
      required: [true, 'First name must be provided.'],
      minlength: [1, 'First name must be provided.'],
      maxlength: [150, 'First name must be longer than 150 characters.']
    }
  });

/**
 * Pre-save middleware used to hash the user password before it is stored
 * to the DB.
 *
 * @note Hash produced by bcrypt includes both the password hash as well
 * as the salt, hence salt doesn't need to be stored separately.
 */
_userSchema.pre('save', async function(this: HydratedDocument<_UserDocI>) {
  // Return immediatelly if password wasn't changed
  if (!this.isModified('password')) {
    return;
  }

  try {
    this.password = await hash(this.password, 10);
  }
  catch {
    console.log('Failed to hash the user password.');
    throw new RestError(500, 'Action failed do to a server error. Please try again.');
  }
});

/**
 * Defines instance method used to compare a password guess with
 * the actual user password.
 *
 * Returns a promise that resolves with TRUE if guess is correct,
 * FALSE otherwise.
 */
_userSchema.method(
  'verifyPassword',
  function(this: HydratedDocument<_UserDocI>, passwordGuess: string): Promise<boolean> {
    /**
     * bcrypt.compare() function hashes the passwordGuess before comparing
     * it with the existing user password hash.
     */
    return compare(passwordGuess, this.password);
  });
