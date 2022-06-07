import { Router } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import * as locations from '../controllers/location.controller';
import * as reviews from '../controllers/review.controller';
import * as users from '../controllers/user.controller';
import { RestResponseFailureI } from 'loc8r-common';
import { _RestError as RestError } from '../misc/rest-error';
import { isAuthenticatedMiddleware } from '../misc/auth-middleware';
import {
  _getExpressCallbackThatStopsOnSuccess as getExpressCallbackThatStopsOnSuccess,
  _getExpressCallbackThatContinuesOnSuccess as getExpressCallbackThatContinuesOnSuccess
} from '../misc/server-helpers';

/**
 * @file Contains route definitions for the Loc8r REST API.
 *
 * @todo Many of the routes need to be protected so that only
 * logged in users can access them. Moreover, many routes should
 * only be accessible to users with admin priviliges.
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
  .post(
    getExpressCallbackThatContinuesOnSuccess(isAuthenticatedMiddleware),
    getExpressCallbackThatStopsOnSuccess(reviews._createReview));

_router.route('/locations/:locationid/reviews/:reviewid')
  .get(getExpressCallbackThatStopsOnSuccess(reviews._getReview))
  .put(getExpressCallbackThatStopsOnSuccess(reviews._updateReview))
  .delete(getExpressCallbackThatStopsOnSuccess(reviews._deleteReview));

/**
 * Register controllers for the user related routes.
 */
_router.post('/users', getExpressCallbackThatStopsOnSuccess(users._createUser));
_router.post('/login', getExpressCallbackThatStopsOnSuccess(users._loginUser));

/**
 * Register 404 middleware for the REST API.
 *
 * @todo Both 404 and error middleware needs to be registered at the Express
 * app instance level. At the moment, Express' default response is sent if
 * clients requests an unknown resourse whose URL doesn't start with /api.
 */
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
