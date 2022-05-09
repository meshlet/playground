import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorCode, FrontendError } from './error';

/**
 * A service used to query user's geo location using the
 * browser's HTML5 geo location API.
 *
 * @note Service caches the device location upon first
 * read and will read the location again only after the
 * cacheIntervalMs is exceeded.
 *
 * @todo The service currently only relies on HTML 5 geolocation
 * API to read device's location. If this API is unavailable,
 * the service returns an error. Make the service more general
 * so that it can use IP address to approximate device's location
 * if geolocation API is unavailable.
 */
@Injectable()
export class GeolocationService {
  /**
   * Cached device position.
   */
  private cachedPosition?: GeolocationPosition;

  /**
   * Timestamp representing the momement when the device location
   * has been read the last time.
   */
  private lastLocationRead = 0;

  /**
   * The time interval to cache the device location for. Once this
   * interval is exceeded, the next call to getLocation() leads to a
   * new location read.
   *
   * @todo It might make sense to make this configurable via an
   * environment variable.
   */
  private readonly cacheIntervalMs = 60 * 1000; // 60 seconds

  /**
   * The observable returned by this method is resolved either
   * with GeolocationPosition object representing user's geo
   * location, or fails with a Frontend error whose error code
   * describes what went wrong.
   */
  getLocation(): Observable<GeolocationPosition> {
    return new Observable(subscriber => {
      if (this.cachedPosition && Date.now() - this.lastLocationRead <= this.cacheIntervalMs) {
        // The currently cached location is still considered fresh
        subscriber.next(this.cachedPosition);
        subscriber.complete();
      }
      else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            // Update the timestamp of the last device location read and cache the
            // newly read geolocation
            this.lastLocationRead = Date.now();
            this.cachedPosition = position;

            // Send newly read geolocation to the subscriber
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
        // @todo: approximate device location by its IP address.
        subscriber.error(new FrontendError(ErrorCode.GeolocationUnsupported));
      }
    });
  }
}
