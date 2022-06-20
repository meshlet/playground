import { Injectable } from '@angular/core';
import { UserI, isRecord } from 'loc8r-common/common.module';
import { Observable } from 'rxjs';
import { UserRepository } from '../dal/user.repository';
import { ErrorCode, FrontendError } from './error';

/**
 * A pair consisting of UserI object as well as JWT expiration timestamp
 * (if present in the JWT).
 */
interface ParsedAuthData {
  user: UserI;
  tokenExpiration?: number;
}

/**
 * Provides authentication functionality to the app.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * A parsed copy of the auth data to avoid reading and parsing
   * the auth dadta from the local storage each time app invokes
   * the isAuthenticated or getCurrentUser methods.
   */
  private parsedAuthData?: ParsedAuthData;

  /**
   * The name of the local storage key where user object is stored.
   */
  private static readonly LS_USER_KEY = 'loc8r-user';

  /**
   * The name of the local storage key where the JWT is stored.
   */
  private static readonly LS_JWT_KEY = 'loc8r-jwt';

  constructor(private userRepo: UserRepository) {
    // Attempt to restore the authentication data from the local storage.
    const userStr = localStorage.getItem(AuthService.LS_USER_KEY);
    const jwt = localStorage.getItem(AuthService.LS_JWT_KEY);

    if (userStr && jwt) {
      // Cache the auth info
      // Type-casting here as we rely that server sends us an object with UserI shape
      this.cacheAuthData(jwt, JSON.parse(userStr) as UserI);
    }
  }

  /**
   * Caches authentication data to a class property for quick access.
   */
  private cacheAuthData(jwt: string, user: UserI) {
    // Cache the current user
    this.parsedAuthData = { user: user };

    // Extract and decode JWT payload (sanity check of the JWT is done upon
    // receiving it)
    const jwtPayload = JSON.parse(atob(jwt.split('.')[1])) as unknown;

    // Cache the token expiration if set in the JWT payload
    this.parsedAuthData.tokenExpiration = isRecord(jwtPayload) && typeof jwtPayload.exp === 'number'
      ? jwtPayload.exp
      : undefined;
  }

  /**
   * Saves new auth data to local storage and updates the local cache.
   */
  private saveAuthData(jwt: string, user: UserI) {
    localStorage.setItem(AuthService.LS_JWT_KEY, jwt);
    localStorage.setItem(AuthService.LS_USER_KEY, JSON.stringify(user));
    this.cacheAuthData(jwt, user);
  }

  /**
   * Returns the current user.
   *
   * @note Even if this method returns a non-null object that doesn't
   * necessarily mean that user is logged in. This has to be checked
   * by calling the isAuthenticated method.
   */
  getCurrentUser(): UserI | null {
    return this.parsedAuthData?.user || null;
  }

  /**
   * Returns the JWT token.
   *
   * @note The method might return an expired JWT token. To check whether
   * user is logged in call isAuthenticated method.
   */
  getJwt(): string | null {
    return localStorage.getItem(AuthService.LS_JWT_KEY);
  }

  /**
   * Checks presence and expiration timestamp of the JWT and returns
   * TRUE if token is valid (user logged in), FALSE otherwise.
   *
   * @note This method relies on the cached authentication info
   * instead of reading/parsing it from the local storage.
   */
  isAuthenticated(): boolean {
    if (this.parsedAuthData) {
      // Token is valid if it doesn't have expiration set (valid forever)
      // or if current time is less than its expiration timestamp.
      return !this.parsedAuthData.tokenExpiration || (Date.now() / 1000) < this.parsedAuthData.tokenExpiration;
    }
    return false;
  }

  /**
   * Attempts to log in the user.
   */
  login(user: UserI): Observable<void> {
    return new Observable(subscriber => {
      this.userRepo.loginUser(user)
        .subscribe(rsp => {
          // Sanity check the JWT token
          if (rsp.jwt.split('.').length !== 3) {
            return subscriber.error(new FrontendError(
              ErrorCode.InternalServerError,
              'Failed to log in the user due to an internal server error.'
            ));
          }

          // Store auth data (user + JWT) and inform observer that login has been successfull
          this.saveAuthData(rsp.jwt, rsp.user);
          subscriber.next();
          subscriber.complete();
        },
        err => {
          subscriber.error(err);
        });
    });
  }

  /**
   * Logs out the user.
   *
   * @note Removes authentication data from local storage and clears
   * the local cache.
   */
  logout() {
    localStorage.removeItem(AuthService.LS_JWT_KEY);
    localStorage.removeItem(AuthService.LS_USER_KEY);
    this.parsedAuthData = undefined;
  }
}
