import { _defaultDbReady as defaultDbReady } from './models/db';

/**
 * @file Defines the public API for the app-api module.
 */

/**
 * To be used by consumers to wait for REST API to get up and running.
 */
export const restApiReady = (async function() {
  // Wait for the DB connection
  await defaultDbReady;
})();

/**
 * Export the REST API router.
 */
export { _router as restApiRouter } from './routes/index';
