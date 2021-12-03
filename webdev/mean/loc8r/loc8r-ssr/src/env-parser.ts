/**
 * Parses environment variables making sure all of the mandatory ones are
 * provided, that they're well formed and exports these variables to the
 * rest of the application.
 */

// Server port must be provided through the environment
if (process.env.SERVER_PORT === undefined) {
  console.log('SERVER_PORT environment variable hasn\'t been provided. Exiting.');
  process.exit(-1);
}

// Parse the port as integer and verify the result
export const SERVER_PORT = Number.parseInt(process.env.SERVER_PORT);
if (Number.isNaN(SERVER_PORT)) {
  console.log(`SERVER_PORT environment variable set to ${process.env.SERVER_PORT}, which is not an integer. Exiting.`);
  process.exit(-1);
}

// Google Maps API key must be provided through the environment
if (process.env.GOOGLE_MAPS_API_KEY === undefined) {
  console.log('GOOGLE_MAPS_API_KEY environment variable hasn\'t been provided. Exiting.');
  process.exit(-1);
}
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
