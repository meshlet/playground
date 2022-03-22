/** @file Defines re-usable base error classes. */

/** Base error class that inherits native Error. */
export class _ErrorBase extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** A base for HTTP related errors. */
export class _HttpError extends _ErrorBase {
  public statusCode: number;
  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
