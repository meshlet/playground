import express from 'express';
import * as locations from '../controllers/locations';
import * as reviews from '../controllers/reviews';

/**
 * @file Contains route definitions for the Loc8r REST API
 */

export const _router = express.Router();

/**
 * The following routes implement CRUD for locations.
 */
_router.route('/locations')
  .get(locations._getLocationsByDistance)
  .post(locations._createLocation);

_router.route('/locations/:locationid')
  .get(locations._getLocation)
  .put(locations._updateLocation)
  .delete(locations._deleteLocation);

/**
 * The following routes implement CRUD for reviews.
 *
 * @note Controller that retrieves all the reviews for a given location
 * is not needed as reviews are pulled from the database by the
 * getLocation controller in locations.ts.
 */
_router.route('/locations/:locationid/reviews')
  .post(reviews._createReview);

_router.route('/locations/:locationid/reviews/:reviewid:')
  .get(reviews._getReview)
  .put(reviews._updateReview)
  .delete(reviews._deleteReview);
