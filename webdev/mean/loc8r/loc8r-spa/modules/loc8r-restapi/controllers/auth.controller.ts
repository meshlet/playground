import { Request, Response, Handler } from 'express-serve-static-core';
import * as userRepository from '../models/user.repository';
import { _RestError as RestError } from '../misc/rest-error';
import { _generateJwt as generateJwt } from '../misc/auth';
import passport from 'passport';
import {
  isRecord,
  RestResponseSuccessGenericI,
  CreateUserRspI,
  LoginUserRspI,
  ValidationErrorT,
  UserI
} from 'loc8r-common';

/**
 * @file Contains controllers for routes related to users.
 */

/**
 * Controller for the POST /signup route.
 *
 * Creates a new user. The request body should contain the following fields:
 *
 * email: string
 * password: string
 * firstname: string
 * lastname string
 *
 * Any other fields present in the request body are ignored.
 */
export async function _signup(req: Request,
                              res: Response<RestResponseSuccessGenericI<CreateUserRspI>>) {
  if (isRecord(req.body)) {
    const props: Array<keyof userRepository._UserExternal> = ['email', 'password', 'firstname', 'lastname'];
    const bodyObj: userRepository._UserExternal = {};
    for (const prop of props) {
      if (req.body[prop]) {
        bodyObj[prop] = req.body[prop];
      }
    }
    res
      .status(201)
      .json({
        success: true,
        body: {
          type: 'CreateUser',
          user: await userRepository._createNewUser(bodyObj)
        }
      });
  }
  else {
    throw new RestError(
      400,
      'Failed to create a new user due to malformed data in request body.');
  }
}

/**
 * Controller for the POST /login route.
 *
 * Attempts to find a user with given email & password and
 * returns a JWT used to authenticate the user in future
 * requests.
 *
 * The request body should include the following fields:
 *
 * email: string
 * password: string
 */
export function _login(req: Request,
                       res: Response<RestResponseSuccessGenericI<LoginUserRspI>>)
  : Promise<void> {
  return new Promise((resolve, reject) => {
    if (isRecord(req.body)) {
      let bodyOk = true;
      const validationError: ValidationErrorT = {};
      if (typeof req.body.email !== 'string' || req.body.email.trim() === '') {
        validationError.email = 'Email address must be provided.';
        bodyOk = false;
      }
      if (typeof req.body.password !== 'string') {
        validationError.password = 'Password must be provided.';
        bodyOk = false;
      }

      if (!bodyOk) {
        return reject(
          new RestError(
            400,
            'Failed to login the user.',
            validationError));
      }

      /**
       * @todo Type casting to express.Handler is needed due to a bug in
       * passport type declarations, where authenticate returns any instead
       * of express.Handler.
       */
      (passport.authenticate('local', async(err: unknown, user?: UserI) => {
        if (err) {
          // This is an internal server error
          return reject(
            new RestError(
              500,
              'Failed to login the user due to an internal server error. Please try again.'));
        }
        if (!user) {
          // User couldn't be authenticated
          return reject(
            new RestError(
              401,
              'Provided email and/or password are incorrect. Please make sure you provided correct details and try again.'));
        }

        // Send response including the created user object as well as JWT
        // whose payload is set to user's email address
        try {
          res
            .status(200)
            .json({
              success: true,
              body: {
                type: 'LoginUser',
                user: user,
                jwt: await generateJwt({ email: user.email })
              }
            });

          // Resolve the promise
          return resolve();
        }
        catch {
          // Internal server error
          return reject(
            new RestError(
              500,
              'Failed to login the user due to an internal server error. Please try again.'));
        }
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      }) as Handler)(req, res, function() {});
    }
    else {
      reject(
        new RestError(
          400,
          'Failed to login the user due to malformed data.'));
    }
  });
}
