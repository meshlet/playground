import express from 'express';
import path from 'path';
import logger from 'morgan';
import {
  Environment,
  urlEncodedFormParser,
  jsonParser,
  registerCleanupTask
} from '../common/common.module';
import { _router as indexRouter } from './routes';
import { initRestApi, restApiRouter } from '../app-api/app-api.module';
import { _connectRedis as connectRedis } from './misc/redis-connector';
import session from 'express-session';
import getRedisStoreCtor from 'connect-redis';
import flash from 'express-flash';

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

    // Wait for Redis client to connect to the server
    const redisClient = await connectRedis();

    // Create Express app instance
    const app = express();

    // Configure the app instance
    app.set('query parser', 'simple');

    // View setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Obtain RedisStore constructor used to create a store instance
    const RedisStore = getRedisStoreCtor(session);

    // Setup express-session middleware used for session management
    app.use(session({
      cookie: {
        httpOnly: true,
        sameSite: 'strict'
        /** @todo Uncomment once HTTPS is enabled */
        // secure: true
      },
      resave: false,
      saveUninitialized: false,
      /** @todo Make ENVVAR */
      secret: Environment.SESSION_SECRET,
      store: new RedisStore({
        client: redisClient,
        ttl: 43200
      })
    }));

    // Register express-flash middleware for persisting flash messages
    // across requests
    app.use(flash());

    // Setup HTTP request parsers
    app.use(urlEncodedFormParser);
    app.use(jsonParser);

    // Setup routers
    app.use('/', indexRouter);
    app.use('/api', restApiRouter);

    // Start the HTTP server
    const httpServer = app.listen(Environment.APP_SERVER_PORT, Environment.APP_SERVER_ADDRESS, () => {
      console.log(`HTTP server is listening on ${Environment.APP_SERVER_ADDRESS}:${Environment.APP_SERVER_PORT}`);
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
