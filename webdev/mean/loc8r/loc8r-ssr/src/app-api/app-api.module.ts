import { _openDefaultConnection as openDefaultConnection } from './models/db';
import { _initMongooseModels as initMongooseModels } from './models/models';

/**
 * @file Defines the public API for the app-api module.
 */

/**
 * To be used by consumers to wait for REST API to get up and running.
 */
export async function initRestApi() {
  // Wait for the default DB connection
  await openDefaultConnection();

  // Wait for initialization of mongoose models
  await initMongooseModels();
}

/**
 * Export the REST API router.
 */
export { _router as restApiRouter } from './routes/index';
