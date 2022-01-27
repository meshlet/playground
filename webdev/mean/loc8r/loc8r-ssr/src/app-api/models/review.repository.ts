import { HydratedDocument, isValidObjectId } from 'mongoose';
import { _LocationModel as LocationModel, _Review as Review } from './models';
import { _processDatabaseOperation as processDbOperation } from './db-utils';
import { Exact } from '../../common/common.module';
import { _RestError as RestError } from '../misc/error';

/**
 * @file Repository that controls access to review data.
 *
 * Provides functions that implement CRUD operations for the
 * reviews sub-collection that resides within location documents.
 */

/**
 * Fetches a single review from the DB.
 *
 * @todo Make it possible to specify which fields besides the review
 * itself should be included in the projection.
 *
 * @returns Returns a promise that resolves with an object containing the name
 * of the location and  the review object itself, or rejects with a RestError.
 */
export function _getReviewById(locationId: string, reviewId: string)
: Promise<{ locationName: string, review: Review }> {
  return processDbOperation(
    'Failed to obtain the review',
    async() => {
      // Check whether reviewid is a valid ObjectId. No need to check locationid
      // as that's handled by the findById method.
      if (!isValidObjectId(reviewId)) {
        throw new RestError(400, 'Failed to obtain the review due to a malformed client request.');
      }

      // Fetch a projection of a location from the DB
      const location = await LocationModel
        .findById(locationId)
        .select(['_id', 'name', 'reviews'])
        .exec();

      if (location == null) {
        throw new RestError(
          404,
          'Failed to obtain the review because a venue with the provided identifier doesn\'t exist.');
      }

      // Find the review
      const review = location.reviews.id(reviewId);
      if (review == null) {
        throw new RestError(404, 'A review with the provided identifier doesn\'t exist.');
      }
      return {
        locationName: location.name,
        review: review
      };
    }
  );
}

/**
 * An interface describing how to review received from the client should
 * look like. Note that we don't want to force caller to check/cast types,
 * which is why all types are set to unknown. Type checks and casts are
 * done by model/mongoose.
 */
export interface _ReviewExternal {
  reviewer?: unknown,
  rating?: unknown,
  text?: unknown
}

/**
 * Creates a new review for the given location.
 *
 * @returns Returns a promise that resolves with the Review object if the new review
 * has been successfully created, or rejects with a RestError.
 */
export function _createNewReview<T>(locationId: string, changes: Exact<T, _ReviewExternal>)
: Promise<Review> {
  return processDbOperation(
    'Failed to create a new review',
    async() => {
      // Fetch a projection of a location from the DB
      const location = await LocationModel
        .findById(locationId)
        .select(['reviews'])
        .exec();

      if (location == null) {
        throw new RestError(
          404,
          'Failed to create a new review because a venue with provided identifier doesn\'t exist.');
      }

      // Push new review and try saving the modified location to the DB
      location.reviews.push(changes);
      const savedLocation = await location.save();
      return savedLocation.reviews[savedLocation.reviews.length - 1];
    }
  );
}

/**
 * Attempts to update an existing review.
 *
 * @returns Returns a promise that resolves with the Review object if the new review
 * has been successfully created, or rejects with a RestError.
 */
export function _updateReview<T>(locationId: string, reviewId: string, changes: Exact<T, _ReviewExternal>)
: Promise<Review> {
  return processDbOperation(
    'Failed update the review',
    async() => {
      // Check whether reviewid is a valid ObjectId. No need to check locationid
      // as that's handled by the findById method.
      if (!isValidObjectId(reviewId)) {
        throw new RestError(400, 'Failed to obtain the review due to a malformed client request.');
      }

      // Fetch a projection of a location from the DB
      const location = await LocationModel
        .findById(locationId)
        .select(['reviews'])
        .exec();

      if (location == null) {
        throw new RestError(
          404,
          'Failed to update the review because a venue with provided identifier doesn\'t exist.');
      }

      // It is safe to use type assertion here as moongose's DocumentArray.id
      // method is guaranteed to return a hydrated document if the query used
      // to obtain the document isn't lean.
      const review = location.reviews.id(reviewId) as HydratedDocument<Review>;
      if (!review) {
        throw new RestError(404, 'A review with the provided identifier doesn\'t exist.');
      }

      // Write the changes to the review document
      review.set(changes);
      await location.save();
      return review;
    }
  );
}

/**
 * Attempts to delete review with the given ID.
 *
 * @returns A promise that is resolved with true to indicate that review has been
 * deleted, false to indicate that location or view couldn't be found or rejects with
 * RestError.
 */
export function _deleteReview(locationId: string, reviewId: string): Promise<boolean> {
  return processDbOperation(
    'Failed to delete the review',
    async() => {
      // Check whether reviewid is a valid ObjectId. No need to check locationid
      // as that's handled by the findById method.
      if (!isValidObjectId(reviewId)) {
        throw new RestError(400, 'Failed to obtain the review due to a malformed client request.');
      }

      // Fetch a projection of a location from the DB
      const location = await LocationModel
        .findById(locationId)
        .select(['reviews'])
        .exec();

      if (!location) {
        // Location not found. Resolve the outer promise with false
        return false;
      }

      // It is safe to use type assertion here as moongose's DocumentArray.id
      // method is guaranteed to return a hydrated document if query used to
      // obtain the document is not lean.
      const review = location.reviews.id(reviewId) as HydratedDocument<Review>;
      if (!review) {
        return false;
      }

      // Remove the review and save changes. As review is a subdocument,
      // the remove call won't actually save the changes in the DB.
      await review.remove();
      await location.save();
      return true;
    }
  );
}
