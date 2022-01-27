import { model } from 'mongoose';
import {
  _locationSchema as locationSchema,
  _LocationModelInterface as LocationModelInterface,
  _Location as Location
} from './location.schema';
import { _configureMongoose as configureMongoose } from '../misc/mongoose-config';

/**
 * @file Compiles schemas and initializes all the application's models.
 */

/** Configure mongoose before compiling models. */
configureMongoose();

/** Re-export TS interfaces from schemas as models and interfaces are often imported together */
export { _Location, _Review } from './location.schema';

/**
 * Compile schemas and export models.
 *
 * @note Compile new schemas here.
 */
export const _LocationModel = model<Location, LocationModelInterface>('Location', locationSchema);

/**
 * Export a function that initializes all mongoose models in the
 * application and returns a promise for caller to wait for the
 * process to complete.
 *
 * @note Waiting for the returned promise makes sure collection
 * indices are built before writing any data to the
 * DB.
 */
export async function _initMongooseModels() {
  try {
    /**
     * Wait for all mongoose models to become ready. This makes sure
     * that corresponding MongoDB collections have had their indices
     * built before inserting data.
     *
     * @note Init other models here.
     */
    await Promise.all([
      _LocationModel.init()
    ]);
  }
  catch (e) {
    throw new Error(`Failed to build DB indexes. ${e instanceof Error ? e.message : ''}`);
  }
}
