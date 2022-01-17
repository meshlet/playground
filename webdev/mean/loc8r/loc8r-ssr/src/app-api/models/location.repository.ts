import { _LocationModel as LocationModel, _Location as Location } from './location.model';
import { _processDatabaseOperation as processDbOperation } from './db-utils';
import { Exact } from '../../utils/utils.module';
import createError from 'http-errors';

/**
 * @file Repository that controls access to location data.
 *
 * Provides functions that implement CRUD operations for the
 * locations collection.
 *
 * @note Input data is not sanitized before it is written to DB. This must be
 * done before outputting data to HTML document. All data read from the DB
 * must be considered unsafe.
 */

/**
 * Obtains all locations from the DB sorted by distance to given position.
 *
 * @note Only a subset of Location fields are fetched from the DB. In order to all
 * of the location data, use _getLocationById.
 *
 * @todo Make it possible to specify which fields will be included in the
 * projection.
 *
 * @returns Returns a promise that resolves with an array of locations, empty
 * array (if none are found) or rejects with a HttpError (from http-errors module).
 */
export function _getLocationsByDistance(longitude: number,
                                        latitude: number,
                                        maxDistance?: number,
                                        maxLocations?: number)
: Promise<Array<{ distance: { calculated: number }, [key: string]: unknown }>> {
  return processDbOperation(
    'Failed to obtain locations',
    () => {
      // Validate the parameters
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        throw createError(400, 'The longitude must be a number between -180 and 180.');
      }
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        throw createError(400, 'The latitude must be a number between -90 and 90.');
      }

      if (maxDistance == null) {
        // By default, all locations within the 3 kilometers radius are fetched
        maxDistance = 3000;
      }
      else if (isNaN(maxDistance) || maxDistance < 0) {
        throw createError(400, 'The maximal distance from the user must be greater or equal to 0 meters.');
      }
      else if (!isFinite(maxDistance)) {
        throw createError(400, 'The maximal distance from the user must be a finite number.');
      }

      if (maxLocations == null) {
        // By default, the first 50 locations are fetched
        maxLocations = 50;
      }
      else if (isNaN(maxLocations) || maxLocations <= 0) {
        throw createError(400, 'The maximal number of venues to retrieve must be greater than zero.');
      }
      else if (!Number.isSafeInteger(maxLocations)) {
        throw createError(400, `The maximal number of venues to retrieve must not be larger than ${Number.MAX_SAFE_INTEGER}`);
      }

      return LocationModel.aggregate<{ distance: { calculated: number }, [key: string]: unknown }>([
        {
          $geoNear: {
            distanceField: 'distance.calculated',
            near: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            maxDistance: maxDistance,
            spherical: true
          }
        },
        {
          $limit: Math.floor(maxLocations)
        },
        {
          $project: {
            name: 1,
            rating: 1,
            address: 1,
            facilities: 1,
            distance: '$distance.calculated'
          }
        }
      ]).exec();
    }
  );
}

/**
 * Fetches a single location from the DB.
 *
 * @note Note that mongoose query used here is `lean`. This means that mongoose
 * won't hydrate the objects with mongoose-specific fields, they will remain POJO
 * Location objects. This saves some VM engine cycles.
 *
 * @returns Returns a promise that resolves with a fetched location, or rejects
 * with a HttpError (from http-errors module).
 */
export function _getLocationById(id: string): Promise<Location> {
  return processDbOperation(
    'Failed to obtain the location',
    async() => {
      const location = await LocationModel
        .findById(id)
        .lean()
        .exec();

      if (location == null) {
        throw createError(
          404,
          'A venue with the provided identifier doesn\'t exist.');
      }
      return location;
    }
  );
}

/**
 * A type that defines the structure of the location object sent by the
 * client.
 *
 * @note We don't want to force user of this repository to check types
 * of data sent by the client. Model will take care of type validation
 * and casting, hence all types are unknown here. The goal is to define
 * a set of properties expected to be sent by the client.
 */
export interface _LocationExternal {
  name?: unknown
  address?: unknown
  facilities?: unknown
  coordinates?: unknown
  openingHours?: unknown
}

/**
 * Attempts to create a new Location document and save it to the database.
 *
 * @returns Returns a promise that resolves with the created location or rejects
 * with a HttpError (from http-errors module) or mongoose.Error.ValidationError.
 */
export function _createNewLocation<T>(location: Exact<T, _LocationExternal>)
: Promise<Location> {
  return processDbOperation(
    'Failed to create a new location',
    () => {
      return new LocationModel({
        name: location.name,
        address: location.address,
        facilities: location.facilities,
        coords: {
          type: 'Point',
          coordinates: LocationModel.coordsObjToCoordsArray(location.coordinates)
        },
        openingHours: location.openingHours
      }).save();
    }
  );
}

/**
 * Attempts to update an existing location.
 *
 * @note Location is first obtained from, modified and then saved back to the DB.
 * This is not efficient and is done due to mongoose's update validation
 * deficiencies. See TODO in location.model.ts for more info.
 *
 * @returns Returns a promise that resolves with the mongoose document that was
 * updated or rejects with a HttpError (from http-errors module) or
 * mongoose.Error.ValidationError.
 *
 * @todo Selected paths should be intersected with properties of the changes
 * object, so that only necessary paths are retrieved and not all updatable
 * paths.
 */
export function _updateLocation<T>(id: string, changes: Exact<T, _LocationExternal>)
: Promise<Location> {
  return processDbOperation(
    'Failed to update the location',
    async() => {
      // Fetch the Location from the DB
      const location = await LocationModel
        .findById(id)
        .select(['name', 'address', 'facilities', 'coords', 'openingHours'])
        .exec();

      if (location == null) {
        // Location not found. Throw 404 error.
        throw createError(
          404,
          'A venue with provided identifier doesn\'t exist.');
      }

      // Apply changes to the location object
      location.set(changes);

      // `changes` objects contains longitude/latitude as fields of its coordinates
      // property. Update the locations `coords` property based on these.
      location.setCoordinates(changes.coordinates);

      // If an empty string or string with whitespaces only is received, treat
      // that as a request to remove all facilities
      if (typeof changes.facilities === 'string' && changes.facilities.trim() === '') {
        location.facilities.length = 0;
      }
      // Same for opening hours
      if (typeof changes.openingHours === 'string' && changes.openingHours.trim() === '') {
        location.openingHours.length = 0;
      }
      return location.save();
    }
  );
}

/**
 * Attempts to delete location with the given ID.
 *
 * @returns A promise that is resolved with true to indicate that location has been
 * deleted, false to indicate that location couldn't be found or rejects with
 * a HttpError (from http-errors module).
 */
export function _deleteLocation(id: string): Promise<boolean> {
  return processDbOperation(
    'Failed to remove the location',
    async() => {
      const retVal = await LocationModel.deleteOne({ _id: id }).exec();
      return retVal.deletedCount === 1;
    }
  );
}
