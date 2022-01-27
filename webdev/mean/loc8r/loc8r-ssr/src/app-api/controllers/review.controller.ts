import { Request, Response } from 'express-serve-static-core';
import * as reviewRepository from '../models/review.repository';
import { isRecord, RestResponseSuccessI } from '../../common/common.module';
import { _RestError as RestError } from '../misc/error';

/**
 * @file Contains controllers for the /locations/:locationid/reviews routes.
 */

/**
 * Controller for the GET /locations/:locationid/reviews/:reviewid route.
 *
 * Retrieves a specific review.
 */
export async function _getReview(req: Request, res: Response<RestResponseSuccessI>) {
  if (!req.params.locationid || !req.params.reviewid) {
    // It is a programming error to call this controller for a route without
    // the locationid or reviewid parameters
    throw new RestError(
      500,
      'Failed to retrieve venue review due to an internal server error.');
  }
  res
    .status(200)
    .json({
      success: true,
      data: await reviewRepository._getReviewById(req.params.locationid, req.params.reviewid)
    });
}

/**
 * Controller for the POST /locations/:locationid/reviews route.
 *
 * Adds a new review for the given locationid. The request body can contain
 * the following fields:
 *
 * reviewer: string,
 * rating: number,
 * text: string
 */
export async function _createReview(req: Request, res: Response<RestResponseSuccessI>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new RestError(
      500,
      'Failed to create a new venue review due to an internal server error.');
  }
  else if (!isRecord(req.body)) {
    throw new RestError(
      400,
      'Failed to create a new venue review due to malformed data in request body.');
  }

  const props: Array<keyof reviewRepository._ReviewExternal> = ['reviewer', 'rating', 'text'];
  const bodyObj: reviewRepository._ReviewExternal = {};
  for (const prop of props) {
    if (req.body[prop] != null) {
      bodyObj[prop] = req.body[prop];
    }
  }
  res
    .status(201)
    .json({
      success: true,
      data: await reviewRepository._createNewReview(req.params.locationid, bodyObj)
    });
}

/**
 * Controller for the PUT /locations/:locationid/reviews/:reviewid route.
 *
 * Updates an existing review. The request body can contain the following fields:
 *
 * reviewer: string,
 * rating: number,
 * text: string
 */
export async function _updateReview(req: Request, res: Response<RestResponseSuccessI>) {
  if (!req.params.locationid || !req.params.reviewid) {
    // It is a programming error to call this controller for a route without
    // the locationid or reviewid parameters
    throw new RestError(
      500,
      'Failed to update venue review due to an internal server error.');
  }
  else if (!isRecord(req.body)) {
    throw new RestError(
      400,
      'Failed to update venue review due to malformed data in request body.');
  }

  const props: Array<keyof reviewRepository._ReviewExternal> = ['reviewer', 'rating', 'text'];
  const bodyObj: reviewRepository._ReviewExternal = {};
  for (const prop of props) {
    if (req.body[prop] != null) {
      bodyObj[prop] = req.body[prop];
    }
  }
  res
    .status(200)
    .json({
      success: true,
      data: await reviewRepository._updateReview(
        req.params.locationid,
        req.params.reviewid,
        bodyObj)
    });
}

/**
 * Controller for the DELETE /locations/:locationid/reviews/:reviewid route.
 *
 * Deletes a review.
 */
export async function _deleteReview(req: Request, res: Response<null>) {
  if (!req.params.locationid || !req.params.reviewid) {
    // It is a programming error to call this controller for a route without
    // the locationid or reviewid parameters
    throw new RestError(
      500,
      'Failed to delete the venue review due to an internal server error.');
  }

  if (!(await reviewRepository._deleteReview(req.params.locationid, req.params.reviewid))) {
    throw new RestError(404, 'A venue review with provided identifier doesn\'t exist.');
  }

  res
    .status(204)
    .json(null);
}
