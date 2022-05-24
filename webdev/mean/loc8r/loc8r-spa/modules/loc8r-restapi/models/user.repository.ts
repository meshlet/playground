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
          'This email address is already taken.');
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
 * Checks whether user with given email and passwords exists.
 */
export function _userWithEmailAndPasswordExists(email: string, password: string): Promise<boolean> {
  return wrapDatabaseOperation(
    'User info could not be read',
    async() => {
      return await UserModel
        .findOne({ email: email, password: password })
        .lean()
        .exec() != null;
    });
}
