import { UserI, Exact } from 'loc8r-common';
import { _wrapDatabaseOperation as wrapDatabaseOperation } from './db-utils';
import { _UserModel as UserModel } from './models';
import { _RestError as RestError } from '../misc/rest-error';

/**
 * @file Repository that controls access to user data.
 *
 * Provides functions that implement CRUD operations for the
 * user collection.
 */

/**
 * A type that defines the user properties expected to be sent by
 * the client.
 *
 * @note We don't want to force user of this repository to check types
 * of data sent by the client. Model will take care of type validation
 * and casting, hence all types are unknown here. The goal is to define
 * a set of properties expected to be sent by the client.
 */
export interface _UserExternal {
  email?: unknown;
  password?: unknown;
  firstname?: unknown;
  lastname?: unknown;
}

/**
 * Creates a new user.
 *
 * @returns Returns a promise that resolves with the created user or rejects
 * with a RestError.
 */
export function _createNewUser<T>(user: Exact<T, _UserExternal>): Promise<UserI> {
  return wrapDatabaseOperation(
    'Failed to create the user',
    async() => {
      // Check if user with given email already exists
      const existingUser = await UserModel
        .findOne({ email: user.email })
        .lean()
        .exec();

      if (existingUser) {
        throw new RestError(
          403,
          'A profile with this email address already exists.');
      }

      const newUser = await new UserModel(user).save();
      return {
        _id: newUser._id.toString(),
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname
      };
    });
}

/**
 * Find the user with given email address.
 */
export function _findUserWithEmail(email: string): Promise<UserI | null> {
  return wrapDatabaseOperation(
    'User info could not be read',
    async() => {
      const user = await UserModel
        .findOne({ email: email })
        .lean()
        .exec();

      return user == null
        ? null
        : {
          _id: user._id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        };
    });
}

/**
 * Find the user with given email and passwords.
 */
export function _findUserWithEmailAndPassword(email: string, password: string): Promise<UserI | null> {
  return wrapDatabaseOperation(
    'User info could not be read',
    async() => {
      const user = await UserModel
        .findOne({ email: email })
        .exec();

      if (user == null) {
        return null;
      }

      return (await user.verifyPassword(password))
        ? {
          _id: user._id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        }
        : null;
    });
}
