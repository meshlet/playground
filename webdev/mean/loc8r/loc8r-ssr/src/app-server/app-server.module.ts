import express from 'express';
import path from 'path';
import logger from 'morgan';
import { SERVER_PORT, SERVER_ADDRESS } from '../utils/utils.module';
import { _router as indexRouter } from '../app-server/routes';
import { restApiReady, restApiRouter } from '../app-api/app-api.module';

/**
 * @file Defines the public API for the app-server module.
 */

/**
 * Export a function that runs the HTTP server.
 */
export function runAppServer() {
  // Wrap the code in async immediate function so that we can await for
  // promises.
  (async function() {
    // Wait for the REST API
    await restApiReady;

    // Create Express app instance
    const app = express();

    // View setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Setup routers
    app.use('/', indexRouter);
    app.use('/api', restApiRouter);

    // Start the HTTP server
    const httpServer = app.listen(SERVER_PORT, SERVER_ADDRESS, () => {
      console.log(`Server is listening on ${SERVER_ADDRESS}:${SERVER_PORT}`);
    });

    // Listen for errors
    httpServer.on('error', (err: Error) => {
      // Throw the error to reject the promise returned by the outer IIFE
      throw err;
    });
  })()
    .then(
      undefined,
      (reason) => {
        if (reason instanceof Error) {
          console.log(`${reason.message}`);
        }
      });
}
