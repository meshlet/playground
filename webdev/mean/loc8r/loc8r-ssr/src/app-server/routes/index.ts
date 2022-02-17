import { Router } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import * as locations from '../controllers/locations.controller';
import * as other from '../controllers/others.controller';
import { getExpressCallbackThatStopsOnSuccess } from '../../common/common.module';
import {
  _HttpRspErrorRender as HttpRspErrorRender,
  _HttpRspErrorRedirect as HttpRspErrorRedirect
} from '../misc/http-rsp-error';

// Create a router
export const _router = Router();

// GET home page
_router.get('/', getExpressCallbackThatStopsOnSuccess(locations._locationsList));
_router.get('/locations', getExpressCallbackThatStopsOnSuccess(locations._locationsList));

// GET details page
_router.get('/locations/:locationid', getExpressCallbackThatStopsOnSuccess(locations._locationInfo));

// GET add review page
_router.route('/locations/:locationid/newreview')
  .get(getExpressCallbackThatStopsOnSuccess(locations._getNewReviewPage))
  .post(getExpressCallbackThatStopsOnSuccess(locations._postNewReview));

// Get about page
_router.get('/about', getExpressCallbackThatStopsOnSuccess(other._about));

// Get error page
_router.get('/error', getExpressCallbackThatStopsOnSuccess(other._error));

/**
 * Register 404 middleware.
 *
 * @note Regex needs to be used to exclude paths starting with /api,
 * otherwise middleware runs for the REST API router before its own
 * routes get a chance to execute.
 */
_router.use(/^(?!\/api)/, (req: Request, _2: Response<string>, next: NextFunction) => {
  next(new HttpRspErrorRedirect('/', `The requested page could not be found: ${req.path}`));
});

/**
 * Register error-handling middleware that handles any errors reported
 * by REST API routes.
 */
_router.use((err: unknown, _: Request, res: Response<string>, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpRspErrorRender) {
    console.log(`HttpRspErrorRender: ${err.viewLocals.error.message}`);
    if (err.viewLocals.error.validationErr) {
      console.log(err.viewLocals.error.validationErr);
    }
    res.render(
      err.view,
      err.viewLocals,
      (renderErr: Error | null, html: string) => {
        if (renderErr != null) {
          // This is a serious server bug
          /** @todo Set flash message */
          console.log('Error middleware failed to render the view.');
          res.status(302).redirect('/error');
        }
        else {
          res.status(err.statusCode).send(html);
        }
      });
  }
  else if (err instanceof HttpRspErrorRedirect) {
    /** @todo Set flash msg. */
    console.log(`HttpRspErrorRedirect: ${err.message}`);
    res.redirect(err.redirectUrl);
  }
  else {
    // This is an unknown and unprocessed internal server error.
    /** @todo Set flash msg. */
    console.log('Unknown internal server error has occurred.');
    res.status(302).redirect('/error');
  }
});
