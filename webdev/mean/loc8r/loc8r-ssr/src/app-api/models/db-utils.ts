import { _RestError as RestError } from '../misc/rest-error';

/**
 * @file Helpers providing functionality useful in interaction
 * with MongoDB database.
 */

/**
 * Wraps a function that performa DB operations with some common logic.
 *
 * Any error that is not RestError is remapped to a RestError with
 * 500 status code.
 *
 * @returns A promise that resolves with the value returned from the
 * invoked callback or rejects with a RestError.
 */
export async function _wrapDatabaseOperation<R>(
  errPrefix: string,
  callback: () => Promise<R>,
  trimDepth?: number): Promise<R> {
  try {
    return await callback();
  }
  catch (e) {
    if (e instanceof RestError) {
      if (trimDepth) {
        // Validation error property names should be trimmed down
        e.trimErrorPropNames(trimDepth);
      }
      // Re-throw
      throw e;
    }
    // Otherwise, an unexpected DB server error has occurred. Report an internal
    // server error.
    // throw createError(500, `${errPrefix} due to an internal database server error.`);
    throw new RestError(500, `${errPrefix} due to an internal database server error.`);
  }
}
