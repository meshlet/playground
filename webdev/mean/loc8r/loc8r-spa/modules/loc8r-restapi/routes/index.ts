import { Router } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import * as locations from '../controllers/location.controller';
import * as reviews from '../controllers/review.controller';
import { RestResponseFailureI } from 'loc8r-common';
import { _RestError as RestError } from '../misc/rest-error';
import { _getExpressCallbackThatStopsOnSuccess as getExpressCallbackThatStopsOnSuccess } from '../misc/server-helpers';

/**
 * @file Contains route definitions for the Loc8r REST API
 */

export const _router = Router();

/**
 * The following routes implement CRUD for locations.
 */
_router.route('/locations')
  .get(getExpressCallbackThatStopsOnSuccess(locations._getLocationsByDistance))
  .post(getExpressCallbackThatStopsOnSuccess(locations._createLocation));

_router.route('/locations/:locationid')
  .get(getExpressCallbackThatStopsOnSuccess(locations._getLocation))
  .put(getExpressCallbackThatStopsOnSuccess(locations._updateLocation))
  .delete(getExpressCallbackThatStopsOnSuccess(locations._deleteLocation));

/**
 * The following routes implement CRUD for reviews.
 *
 * @note Controller that retrieves all the reviews for a given location
 * is not needed as reviews are pulled from the database by the
 * getLocation controller in location-controller.ts.
 */
_router.route('/locations/:locationid/reviews')
  .post(getExpressCallbackThatStopsOnSuccess(reviews._createReview));

_router.route('/locations/:locationid/reviews/:reviewid')
  .get(getExpressCallbackThatStopsOnSuccess(reviews._getReview))
  .put(getExpressCallbackThatStopsOnSuccess(reviews._updateReview))
  .delete(getExpressCallbackThatStopsOnSuccess(reviews._deleteReview));

/**
 * Register 404 middleware for the REST API.
 */
// _router.use(/^(?=\/api\/)/, (_1: Request, _2: Response, next: NextFunction) => {
_router.use((_1: Request, _2: Response, next: NextFunction) => {
  next(new RestError(
    404,
    'An unknown resource has been requested by the client.'
  ));
});

/**
 * Register error-handling middleware that handles any errors reported
 * by REST API routes.
 */
_router.use((err: unknown, _: Request, res: Response<RestResponseFailureI>, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const resBody: RestResponseFailureI = {
    success: false,
    error: new RestError(500, 'Failed to process the request due to an internal server error.')
  };

  // Send error response
  if (err instanceof RestError) {
    resBody.error = err;
    res.status(err.statusCode);
  }
  res.json(resBody);
});
