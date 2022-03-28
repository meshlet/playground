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
  }
}
