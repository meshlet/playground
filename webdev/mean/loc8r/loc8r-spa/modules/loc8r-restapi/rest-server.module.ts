import express from 'express';
import path from 'path';
import logger from 'morgan';
import {
  _urlEncodedFormParser as urlEncodedFormParser,
  _jsonParser as jsonParser
} from './misc/req-parsers';
import { _Env as Environment } from './misc/env-parser';
import { _registerCleanupTask as registerCleanupTask } from './misc/proc-term-mngr';
import { _router as restApiRouter } from './routes';
import { _openDefaultConnection as openDefaultConnection } from './models/db';
import { _initMongooseModels as initMongooseModels } from './models/models';
import { setupPassport } from './misc/passport-setup';
import passport from 'passport';

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
    // Wait for the default DB connection
    await openDefaultConnection();

    // Wait for initialization of mongoose models
    await initMongooseModels();

    // Create Express app instance
    const app = express();

    // Configure the app instance
    app.set('query parser', 'simple');

    // Setup passport
    setupPassport();

    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Setup middleware for both parsing both JSON and URL encoded
    // HTTP bodies.
    app.use(urlEncodedFormParser);
    app.use(jsonParser);

    // Add passport middleware. Note that passport.session middleware is NOT
    // added because server doesn't have session support.
    app.use(passport.initialize());

    // Setup the REST API router
    app.use('/api', restApiRouter);

    // Start the HTTP server
    const httpServer = app.listen(Environment.REST_SERVER_PORT, Environment.REST_SERVER_ADDRESS, () => {
      console.log(`HTTP server is listening on ${Environment.REST_SERVER_ADDRESS}:${Environment.REST_SERVER_PORT}`);
    });

    // Register a clean-up task that closes the server upon process termination.
    registerCleanupTask(() => {
      return new Promise<void>((resolve, reject) => {
        httpServer.close((err?: Error) => {
          if (err) {
            console.log('Failed to gracefully shutdown the HTTP server.');
            reject(err);
          }
          else {
            console.log('HTTP server is exiting gracefully.');
            resolve();
          }
        });
      });
    });

    // Listen for error events
    httpServer.on('error', (err: Error) => {
      /** @note Is there anything better we can do here? Throwing crashes the app
       * because exception gets picked up by Node's default 'uncaughtException'
       * handler. */
      console.log(`HTTP server reported an error: ${err.message}`);
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
