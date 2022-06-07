import jwt from 'jsonwebtoken';
import { UserI, isUserObject } from 'loc8r-common';
import { _Env as Env } from './env-parser';

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
 * Errors that might occur when generating or verifying JWTs.
 */
export const enum _JwtError {
  TokenGenerationFailed, /** failed to generate JWT (must be treated as internal server error) */
  TokenExpired, /** The JWT has experied and is no longer valid */
  TokenMalformed, /** JWT's header, payload or signature is malformed */
  TokenPayloadMalformed, /** JWT's payload is malformed and couldn't be parsed */
  TokenSignatureRequired, /** JWT's signature is missing */
  TokenSignatureInvalid, /** JWT's signature does not match the secret used to encrypt it. */
  TokenAudienceInvalid, /** JWT's audience claim is invalid */
  TokenIssuerInvalid, /** JWT's issuer claim is invalid */
  TokenIdInvalid, /** JWT's ID claim is invalid */
  TokenSubjectInvalid, /** JWT's subject claim is invalid */
  TokenNotBefore, /** Current time is before the JWT's nbf claim. */
  TokenErrorUnknown /** An unknown error has occurred (must be treated as internal server error) */
}

/**
 * Generates a JWT token for a given user object.
 *
 * Promise returned by the function either resolves with the
 * JWT string or fails with _JwtError.
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
          return reject(_JwtError.TokenGenerationFailed);
        }
        if (token === undefined) {
          // This would indicate a bug in jsonwebtoken library
          return reject(_JwtError.TokenGenerationFailed);
        }
        // Resolve promise with the generated token
        resolve(token);
      });
  });
}

/**
 * Verifies the JTW token string and attempts to extract the user object.
 */
export function _verifyJwt(token: string): Promise<UserI> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      Env.JWT_SECRET,
      (err: jwt.VerifyErrors | null, payload: jwt.JwtPayload | string | undefined) => {
        let tokenError: _JwtError = _JwtError.TokenErrorUnknown;
        if (err) {
          switch (err.name) {
            case 'TokenExpiredError':
              tokenError = _JwtError.TokenExpired;
              break;
            case 'JsonWebTokenError':
              if (err.message === 'jwt malformed') {
                tokenError = _JwtError.TokenMalformed;
              }
              else if (err.message === 'jwt signature is required') {
                tokenError = _JwtError.TokenSignatureRequired;
              }
              else if (err.message === 'invalid signature') {
                tokenError = _JwtError.TokenSignatureInvalid;
              }
              else if (err.message.includes('[OPTIONS AUDIENCE]')) {
                tokenError = _JwtError.TokenAudienceInvalid;
              }
              else if (err.message.includes('[OPTIONS ISSUER]')) {
                tokenError = _JwtError.TokenIssuerInvalid;
              }
              else if (err.message.includes('[OPTIONS JWT ID]')) {
                tokenError = _JwtError.TokenIdInvalid;
              }
              else if (err.message.includes('[OPTIONS SUBJECT]')) {
                tokenError = _JwtError.TokenSubjectInvalid;
              }
              else {
                tokenError = _JwtError.TokenErrorUnknown;
              }
              break;
            case 'NotBeforeError':
              tokenError = _JwtError.TokenNotBefore;
              break;
            default:
              tokenError = _JwtError.TokenErrorUnknown;
          }
        }
        else if (typeof payload === 'string') {
          try {
            const payloadObj = JSON.parse(payload) as unknown;
            if (isUserObject(payloadObj)) {
              return resolve(payloadObj);
            }
          }
          catch {
          }
          tokenError = _JwtError.TokenPayloadMalformed;
        }
        else {
          tokenError = _JwtError.TokenPayloadMalformed;
        }

        // Reject the promise
        reject(tokenError);
      });
  });
}
