import { Request, Response, NextFunction } from 'express-serve-static-core';
import { _convertStrToInt as convertStrToInt } from './helpers';

/**
 * @file Common reusable functionality specific to server side.
 */

/**
 * Check if provided string is a valid 12-hour clock.
 *
 * For example, 6:30 p.m. or 11:00 a.m.
 *
 * @todo Implement with regex.
 */
export function _isValid12HourClock(value: string): boolean {
  let tmp = value.split(':');
  if (tmp.length !== 2) {
    return false;
  }

  const hour = convertStrToInt(tmp[0]);
  if (Number.isNaN(hour) || hour < 0 || hour > 12) {
    return false;
  }

  tmp = tmp[1].split(' ');
  if (tmp.length !== 2 || (tmp[1] !== 'a.m.' && tmp[1] !== 'p.m.')) {
    return false;
  }

  const minutes = convertStrToInt(tmp[0]);
  return (!Number.isNaN(minutes) && minutes >= 0 && minutes <= 59);
}

/**
 * Wraps given Express callback (route handler or middleware) with a
 * function that collects both synchronous and asynchronous errors,
 * and calls the next function either without argument (if no error
 * occured) or with a caught error.
 *
 * This simplies the server route handlers or middleware, as they
 * don't have to worry about capturing asynchronous errors and
 * passing them to the next function.
 *
 * The callback to be wrapped must report errors by throwing exceptions,
 * regardless of whether it performs a synchronous or an asynchronous
 * action (returns a Promise).
 */
export function _wrapExpressCallback<RespT>(callback: (req: Request, res: Response<RespT>) => Promise<unknown> | unknown)
: (req: Request, res: Response<RespT>, next: NextFunction) => void {
  return function(req: Request, res: Response<RespT>, next: NextFunction) {
    // Wrap the callback invocation with try/catch as it may throw an error
    // synchronously.
    try {
      const result = callback(req, res);

      if (result instanceof Promise) {
        // Register the onfulfill and onreject handlers for the promise
        result
          .then(() => next())
          .catch(next);
      }
      else {
        // Synchronous callback has not thrown any errors
        next();
      }
    }
    catch (err) {
      next(err);
    }
  };
}
