import { Request, Response } from 'express';

/**
 * @file Contains controllers for the /locations routes.
 */

/**
 * Controller for the GET /locations route.
 *
 * Retrieves all locations sorted by the distance from the user.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _getLocationsByDistance(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the GET /locations/:locationid route.
 *
 * Retrieves a single location.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _getLocation(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the POST /locations route.
 *
 * Creates a new location.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _createLocation(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the PUT /locations/:locationid route.
 *
 * Updates an existing location.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _updateLocation(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}

/**
 * Controller for the DELETE /locations/:locationid route.
 *
 * Deletes a location.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _deleteLocation(req: Request, res: Response) {
  res
    .status(200)
    .json({ status: 'success' });
}
