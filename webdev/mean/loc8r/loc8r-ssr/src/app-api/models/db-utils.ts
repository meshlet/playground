import { Error } from 'mongoose';
import createError, { HttpError } from 'http-errors';

/**
 * @file Helpers providing functionality useful in interaction
 * with MongoDB database.
 */

/**
 * Runs MongoDB query and processes any errors.
 *
 * Errors are re-thrown after they a processed and potentially re-mapped
 * to http-errors error with status code and user-friendly message.
 *
 * @returns A promise that resolves with the value returned from the
 * invoked callback or rejects with mongoose.Error.ValidationError or
 * HttpError (from http-errors module).
 */
export async function _processDatabaseOperation<T extends unknown[], R>(
  errPrefix: string, fn: (...args: T) => Promise<R>, ...args: T): Promise<R> {
  try {
    return await fn(...args);
  }
  catch (e) {
    if (e instanceof Error.ValidationError || e instanceof HttpError) {
      // Re-throw. Caller must handle validation and HttpError errors.
      throw e;
    }
    else if (e instanceof Error.CastError) {
      // Throw bad request HttpError instead with a user-friendly message
      throw createError(400, `${errPrefix} due to a malformed client request.`);
    }
    // Otherwise, an unexpected DB server error has occurred. Report an internal
    // server error.
    throw createError(500, `${errPrefix} due to an internal database server error.`);
  }
}
