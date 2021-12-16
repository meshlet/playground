import { Request, Response } from 'express';

/**
 * @file Contains controllers for the /locations/:locationid/reviews routes.
 */

/**
 * Controller for the GET /locations/:locationid/reviews/:reviewid route.
 *
 * Retrieves a specific review.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _getReview(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the POST /locations/:locationid/reviews route.
 *
 * Adds a new review for the given locationid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _createReview(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the PUT /locations/:locationid/reviews/:reviewid route.
 *
 * Updates an existing review.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _updateReview(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the DELETE /locations/:locationid/reviews/:reviewid route.
 *
 * Deletes a review.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _deleteReview(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}
