/** @file Defines re-usable base error classes. */

/** Base error class that inherits native Error. */
export class _ErrorBase extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
