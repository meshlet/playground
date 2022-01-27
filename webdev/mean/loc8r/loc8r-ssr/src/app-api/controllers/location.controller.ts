import { Request, Response } from 'express-serve-static-core';
import * as locRepository from '../models/location.repository';
import {
  isRecord, convertStrToInt, convertStrToFloat, RestResponseSuccessI
} from '../../common/common.module';
import { _RestError as RestError } from '../misc/error';

/**
 * @file Contains controllers for the /locations routes.
 */

/**
 * Controller for the GET /locations route.
 *
 * Retrieves all locations sorted by the distance from the user.
 *
 * @todo Make it possible to specify which fields will be included in the
 * location objects returned to the client. At the moment, the projection
 * is hardcoded which would force the client to send further requests if
 * they need data outside of the subset returned here.
 */
export async function _getLocationsByDistance(req: Request, res: Response<RestResponseSuccessI>) {
  if (typeof req.query.longitude !== 'string' || req.query.longitude.length > 50) {
    // longitude query parameter must be present and must be a string. We also
    // want to limit the length of the string, to prevent user from specifying
    // arbitrary long strings causing server to waste cycles parsing these to
    // numbers. Limit length to 50 characters.
    throw new RestError(
      400,
      'Failed to retrieve venues due to missing or malformed longitude.');
  }
  if (typeof req.query.latitude !== 'string' || req.query.latitude.length > 20) {
    // latitude query parameter must be present and must be a string. Limit
    // the param length to 20 characters.
    throw new RestError(
      400,
      'Failed to retrieve venues due to missing or malformed latitude.');
  }
  let maxDistance: number | undefined;
  if (req.query.maxDistance) {
    if (typeof req.query.maxDistance !== 'string' || req.query.maxDistance.length > 50) {
      // If present, maxDistance query parameter must be a string and must not
      // be longer than 50 characters.
      throw new RestError(
        400,
        'Failed to retrieve venues due to malformed maximal distance from user.');
    }
    else {
      maxDistance = convertStrToFloat(req.query.maxDistance);
    }
  }
  let maxLocations: number | undefined;
  if (req.query.maxLocations) {
    if (typeof req.query.maxLocations !== 'string' || req.query.maxLocations.length > 20) {
      // If present, maxLocations query parameter must be a string and must not
      // be longer than 20 characters.
      throw new RestError(
        400,
        'Failed to retrieve venues due to malformed maximal locations count.');
    }
    else {
      maxLocations = convertStrToInt(req.query.maxLocations);
    }
  }

  // Query the locations and send response
  res
    .status(200)
    .json({
      success: true,
      data: await locRepository._getLocationsByDistance(
        convertStrToFloat(req.query.longitude),
        convertStrToFloat(req.query.latitude),
        maxDistance,
        maxLocations)
    });
}

/**
 * Controller for the GET /locations/:locationid route.
 *
 * Retrieves a single location.
 */
export async function _getLocation(req: Request, res: Response<RestResponseSuccessI>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new RestError(
      500,
      'Failed to retrieve venue information due to an internal server error.');
  }

  res
    .status(200)
    .json({
      success: true,
      data: await locRepository._getLocationById(req.params.locationid)
    });
}

/**
 * Controller for the POST /locations route.
 *
 * Creates a new location. The request body should have the following fields:
 *
 * name: string
 * address: string
 * facilities?: Array<string>
 * coords: `{` longitude: number, latitude: number `}`
 * openingHours: Array<`{` dayRange: string, opening?: string, closing?: string, closed: boolean `}`>
 *
 * All other fields present in the body are ignored.
 */
export async function _createLocation(req: Request, res: Response<RestResponseSuccessI>) {
  if (isRecord(req.body)) {
    const props: Array<keyof locRepository._LocationExternal> = ['name', 'address', 'facilities', 'coords', 'openingHours'];
    const bodyObj: locRepository._LocationExternal = {};
    for (const prop of props) {
      if (req.body[prop]) {
        bodyObj[prop] = req.body[prop];
      }
    }
    res
      .status(201)
      .json({
        success: true,
        data: await locRepository._createNewLocation(bodyObj)
      });
  }
  else {
    throw new RestError(
      400,
      'Failed to create a new venue due to malformed data in request body.');
  }
}

/**
 * Controller for the PUT /locations/:locationid route.
 *
 * Updates an existing location. The request body can contain the following
 * fields:
 *
 * name?: string
 * address?: string
 * facilities?: Array<string>
 * coords: `{` longitude: number, latitude: number `}`
 * openingHours?: Array<`{` dayRange: string, opening?: string, closing?: string, closed: boolean `}`>
 *
 * All other fields are ignored. If some of the listed fields are absent, the
 * value of a corresonding field in the database won't be modified.
 */
export async function _updateLocation(req: Request, res: Response<RestResponseSuccessI>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new RestError(
      500,
      'Failed to update venue information due to an internal server error.');
  }
  else if (!isRecord(req.body)) {
    throw new RestError(
      400,
      'Failed to update venue information due to malformed data in request body.');
  }

  const props: Array<keyof locRepository._LocationExternal> = ['name', 'address', 'facilities', 'coords', 'openingHours'];
  const bodyObj: locRepository._LocationExternal = {};
  for (const prop of props) {
    if (req.body[prop] != null) {
      bodyObj[prop] = req.body[prop];
    }
  }
  res
    .status(200)
    .json({
      success: true,
      data: await locRepository._updateLocation(req.params.locationid, bodyObj)
    });
}

/**
 * Controller for the DELETE /locations/:locationid route.
 *
 * Deletes a location.
 */
export async function _deleteLocation(req: Request, res: Response<null>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new RestError(
      500,
      'Failed to delete a venue due to an internal server error.');
  }

  if (!(await locRepository._deleteLocation(req.params.locationid))) {
    throw new RestError(404, 'A venue with provided identifier doesn\'t exist.');
  }

  res
    .status(204)
    .json(null);
}
