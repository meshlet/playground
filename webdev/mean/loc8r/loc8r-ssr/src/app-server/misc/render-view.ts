import { Response } from 'express-serve-static-core';
import { _ViewLocalsBaseI as ViewLocalsBaseI } from './view-locals-base';
import { _HttpRspErrorRedirect as HttpRspErrorRedirect } from './http-rsp-error';

/**
 * Renders the specified view using provided view locals and
 * processes potential errros.
 */
export function _renderView(
  httpResponse: Response<string>,
  viewName: string,
  viewLocalsObj: ViewLocalsBaseI): void {
  // Render the view and handle potential errors
  httpResponse.render(viewName, viewLocalsObj, (err: Error | undefined, html: string) => {
    if (err != null) {
      // Page rendering failed unexpectedly
      console.log(err);
      throw new HttpRspErrorRedirect(
        '/error',
        'Operation could not be completed due to an internal server error.');
    }
    else {
      httpResponse.status(200).send(html);
    }
  });
}
