import { Request } from 'express-serve-static-core';
import { _verifyJwt as verifyJwt, _JwtError as JwtError } from './auth';
import { _RestError as RestError } from '../misc/rest-error';

/**
 * Middleware that ensures user is authenticated.
 *
 * Intended to be used as a guard before other route handlers.
 * The function extracts the JWT from the request's authorization
 * header and checks whether it's valid. If not an error is thrown.
 *
 * @note getExpressCallbackThatContinuesOnSuccess should be used
 * to wrap this function with Express-friendly error handling logic.
 */
export async function isAuthenticatedMiddleware(req: Request) {
  const token = req.headers.authorization;
  if (token) {
    try {
      await verifyJwt(token);
    }
    catch (err) {
      switch (err) {
        case JwtError.TokenExpired:
          throw new RestError(
            401,
            'User session has experied, please log in again.');
        case JwtError.TokenErrorUnknown:
          throw new RestError(
            500,
            'An internal server error has occurred, please try again.');
        default:
          throw new RestError(
            401,
            'User is not logged in.');
      }
    }
  }
  else {
    throw new RestError(
      401,
      'User is not logged in.');
  }
}
