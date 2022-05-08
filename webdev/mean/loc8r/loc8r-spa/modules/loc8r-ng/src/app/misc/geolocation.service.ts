import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorCode, FrontendError } from './error';

/**
 * A service used to query user's geo location using the
 * browser's HTML5 geo location API.
 */
@Injectable()
export class GeolocationService {
  /**
   * The observable returned by this method is resolved either
   * with GeolocationPosition object representing user's geo
   * location, or fails with a Frontend error whose error code
   * describes what went wrong.
   */
  getLocation(): Observable<GeolocationPosition> {
    return new Observable(subscriber => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            subscriber.next(position);
            subscriber.complete();
          },
          locErr => {
            let errCode = ErrorCode.GeolocationPositionUnavailable;
            switch (locErr.code) {
              case GeolocationPositionError.PERMISSION_DENIED:
                errCode = ErrorCode.GeolocationPermissionDenied;
                break;
              case GeolocationPositionError.TIMEOUT:
                errCode = ErrorCode.GeolocationTimeout;
            }
            subscriber.error(new FrontendError(errCode));
          });
      }
      else {
        // Running on browser without support for HTML5 geo location API
        subscriber.error(new FrontendError(ErrorCode.GeolocationUnsupported));
      }
    });
  }
}
