import { HttpError, RestErrorI } from '../../common/common.module';
import { _ViewLocalsBaseI as ViewLocalsBaseI } from './view-locals-base';

/** @file Defines classes/types used to communicate errors within the server. */

/**
 * Interface that defines properties required
 */
export class _HttpRspErrorRender<T extends ViewLocalsBaseI = ViewLocalsBaseI> extends HttpError {
  public view: string;
  public viewLocals: (ViewLocalsBaseI & { error: RestErrorI });

  constructor(statusCode: number, view: string, viewLocals: T, error?: RestErrorI) {
    super(statusCode);
    this.view = view;
    this.viewLocals = {
      ...viewLocals,
      error: error || {
        message: statusCode >= 500
          ? 'An unexpected server error has occurred.'
          : 'An error has occurred due to a malformed client request.'
      }
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
