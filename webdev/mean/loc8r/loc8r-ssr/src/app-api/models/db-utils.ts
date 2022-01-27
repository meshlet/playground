import { _RestError as RestError } from '../misc/error';

/**
 * @file Helpers providing functionality useful in interaction
 * with MongoDB database.
 */

/**
 * Runs MongoDB query and processes any errors.
 *
 * Any error that is not RestError is remapped to a RestError with
 * 500 status code.
 *
 * @returns A promise that resolves with the value returned from the
 * invoked callback or rejects with a RestError.
 */
export async function _processDatabaseOperation<T extends unknown[], R>(
  errPrefix: string, fn: (...args: T) => Promise<R>, ...args: T): Promise<R> {
  try {
    return await fn(...args);
  }
  catch (e) {
    if (e instanceof RestError) {
      // Re-throw. This is a formatted error to be sent to the client.
      throw e;
    }
    // Otherwise, an unexpected DB server error has occurred. Report an internal
    // server error.
    // throw createError(500, `${errPrefix} due to an internal database server error.`);
    throw new RestError(500, `${errPrefix} due to an internal database server error.`);
  }
}
