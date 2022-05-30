import jwt from 'jsonwebtoken';
import { UserI } from 'loc8r-common';
import { _Env as Env } from './env-parser';
import { _RestError as RestError } from './rest-error';

/**
 * @file Authentication helpers.
 *
 * Exposes functions used for authenticating and verifying
 * whether users are currently logged in.
 *
 * @todo @warning Using a string to represent a JWT secret is potentially
 * problematic and can severely damage secret quality by reducing entropy.
 * This is explained in more details here
 * https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138.
 * Keys need to be generated using a secure-random number generator (Node provides
 * such a generator) and treated as byte array (i.e. Buffer). Furthermore,
 * it might be wise to generate JWT secreat at runtime and periodically
 * refresh it. Once server switches to the new JWT secret, it can continue to
 * temporarily support the old secret just to make sure that any requests issued
 * around the time when secret was refreshed don't fail. After this 'transition'
 * period experies (10-15 minutes?), old secret is no longer accepted.
 */

/**
 * Possible errors reported by functions exported by this module.
 */
export const enum _JwtError {
  TokenGenerationFailed,
  TokenExpired,
  TokenInvalidSignature,
  TokenRequiredSignature,
  TokenMalformed,
  TokenErrorOther
}

/**
 * Generates a JWT token for a given user object.
 *
 * Promise returned by the function either resolves with the
 * JWT string or fails with a RestError.
 */
export function _generateJwt(user: UserI): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      Env.JWT_SECRET,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) {
          // We don't ever expect token generation to fail. Report 500 server error.
          return reject(new RestError(500));
        }
        if (token === undefined) {
          // This would indicate a bug in jsonwebtoken library
          return reject(new RestError(500));
        }
        // Resolve promise with the generated token
        resolve(token);
      });
  });
}

/**
 * Verifies the JTW token string and attempts to extract the user object.
 */
// export function _verifyJwt(token: string): Promise<UserI> {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       token,
//       Env.JWT_SECRET,
//       (err: jwt.VerifyErrors | null, payload: jwt.JwtPayload | string | undefined) => {
//         if (err) {
//           switch (err.name) {
//             case 'TokenExpiredError':
//           }
//         }
//       });
//   });
// }
