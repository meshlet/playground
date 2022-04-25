import { ErrorBase } from 'loc8r-common/common.module';

export const enum ErrorCode {
  InternalServerError,
  BadRequest,
  ResourceNotFound,
  NetworkError
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
          this.message = 'Request could not be completed to invalid user agent request.';
          break;
        }
        case ErrorCode.ResourceNotFound: {
          this.message = 'The requested resource does not exist';
          break;
        }
        case ErrorCode.NetworkError: {
          this.message = 'Request could not be completed due to a network error. Please ensure you are connected to the network';
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
