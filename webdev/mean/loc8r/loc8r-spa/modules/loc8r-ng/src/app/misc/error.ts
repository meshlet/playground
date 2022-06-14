import { ErrorBase } from 'loc8r-common/common.module';

export const enum ErrorCode {
  InternalServerError,
  BadRequest,
  ResourceNotFound,
  NetworkError,
  Unauthenticated,
  Forbidden,
  GeolocationTimeout,
  GeolocationPermissionDenied,
  GeolocationPositionUnavailable,
  GeolocationUnsupported
}

export class FrontendError extends ErrorBase {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message);
    this.code = code;

    // If message wasn't provided, use a default one
    if (message == null) {
      switch (code) {
        case ErrorCode.InternalServerError: {
          this.message = 'Request could not be completed due to a server error. Please try again.';
          break;
        }
        case ErrorCode.BadRequest: {
          this.message = 'Request could not be completed to invalid or incomplete data provided by the user.';
          break;
        }
        case ErrorCode.ResourceNotFound: {
          this.message = 'The page you requested does not exist.';
          break;
        }
        case ErrorCode.NetworkError: {
          this.message = 'The action has failed due to a network error. Please ensure you are connected to the network.';
          break;
        }
        case ErrorCode.Unauthenticated: {
          this.message = 'You must log in to be able to perform this action.';
          break;
        }
        case ErrorCode.Forbidden: {
          this.message = 'The server has refused to perform the requested action.';
          break;
        }
        case ErrorCode.GeolocationTimeout: {
          this.message = 'We were unable to read your position. Have you allowed access to geolocation services?';
          break;
        }
        case ErrorCode.GeolocationPermissionDenied: {
          this.message = 'We were unable to read your position because you didn\'t grant access to geolocation services. In order to do so please refresh the page and agree to give access to your position.';
          break;
        }
        case ErrorCode.GeolocationPositionUnavailable: {
          this.message = 'We were unable to read your position. Please refresh the page and grant access to your position if prompted.';
          break;
        }
        case ErrorCode.GeolocationUnsupported: {
          this.message = 'We were unable to read your position because your browser does not support geolocation services.';
          break;
        }
        default: {
          const _exhaustivnessCheck: never = code;
          void _exhaustivnessCheck;
        }
      }
    }
  }
}
