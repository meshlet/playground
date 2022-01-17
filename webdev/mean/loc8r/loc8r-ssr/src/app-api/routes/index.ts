import { Router, Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { Error } from 'mongoose';
import * as locations from '../controllers/location.controller';
import * as reviews from '../controllers/review.controller';
import { wrapExpressCallback } from '../../utils/utils.module';

/**
 * @file Contains route definitions for the Loc8r REST API
 */

export const _router = Router();

/**
 * The following routes implement CRUD for locations.
 */
_router.route('/locations')
  .get(wrapExpressCallback(locations._getLocationsByDistance))
  .post(wrapExpressCallback(locations._createLocation));

_router.route('/locations/:locationid')
  .get(wrapExpressCallback(locations._getLocation))
  .put(wrapExpressCallback(locations._updateLocation))
  .delete(wrapExpressCallback(locations._deleteLocation));

/**
 * The following routes implement CRUD for reviews.
 *
 * @note Controller that retrieves all the reviews for a given location
 * is not needed as reviews are pulled from the database by the
 * getLocation controller in location-controller.ts.
 */
_router.route('/locations/:locationid/reviews')
  .post(wrapExpressCallback(reviews._createReview));

_router.route('/locations/:locationid/reviews/:reviewid')
  .get(wrapExpressCallback(reviews._getReview))
  .put(wrapExpressCallback(reviews._updateReview))
  .delete(wrapExpressCallback(reviews._deleteReview));

/**
 * Register error-handling middleware that handles any errors reported
 * by routes/controllers.
 */
_router.use((err: unknown, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const retObj: {
    error: Error | string
  } = {
    error: 'Failed to process the request due to an internal server error.'
  };

  // Send error response
  if (err instanceof Error.ValidationError) {
    retObj.error = err;
    res.status(400);
  }
  else if (err instanceof HttpError) {
    retObj.error = err.message;
    res.status(err.status);
  }
  res.json(retObj);
});
