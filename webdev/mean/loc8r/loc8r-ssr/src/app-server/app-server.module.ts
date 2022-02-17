import express from 'express';
import path from 'path';
import logger from 'morgan';
import { Environment, urlEncodedFormParser, jsonParser } from '../common/common.module';
import { _router as indexRouter } from './routes';
import { initRestApi, restApiRouter } from '../app-api/app-api.module';

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
    // Wait for the REST API to initialize
    await initRestApi();

    // Create Express app instance
    const app = express();

    // Configure the app instance
    app.set('query parser', 'simple');

    // View setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Setup HTTP request parsers
    app.use(urlEncodedFormParser);
    app.use(jsonParser);

    // Setup routers
    app.use('/', indexRouter);
    app.use('/api', restApiRouter);

    // Start the HTTP server
    const httpServer = app.listen(Environment.APP_SERVER_PORT, Environment.APP_SERVER_ADDRESS, () => {
      console.log(`Server is listening on ${Environment.APP_SERVER_ADDRESS}:${Environment.APP_SERVER_PORT}`);
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
