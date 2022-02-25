import { HttpError, RestErrorI, ValidationErrorT } from '../../common/common.module';
import { _ViewLocalsBaseI as ViewLocalsBaseI } from './view-locals-base';

/** @file Defines classes/types used to communicate errors within the server. */

/**
 * Interface that defines properties required
 */
export class _HttpRspErrorRender extends HttpError {
  public view: string;
  public viewLocals: ViewLocalsBaseI & { validationErr?: ValidationErrorT };

  constructor(statusCode: number, view: string, viewLocals: ViewLocalsBaseI, error?: RestErrorI) {
    super(
      statusCode,
      error ? error.message
        : statusCode >= 500
          ? 'An unexpected server error has occurred.'
          : 'An error has occurred due to a malformed client request.'
    );
    this.view = view;
    this.viewLocals = {
      ...viewLocals,
      validationErr: error?.validationErr
    };
  }
}

/**
 * An error that results in a redirect to the specified URL.
 */
export class _HttpRspErrorRedirect extends HttpError {
  public redirectUrl: string;

  constructor(redirectUrl: string, message?: string, statusCode = 302) {
    super(statusCode, message);
    this.redirectUrl = redirectUrl;
  }
}
