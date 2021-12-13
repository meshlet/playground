import express from 'express';
import path from 'path';
import logger from 'morgan';
import { SERVER_PORT, SERVER_ADDRESS } from './env-parser';
import { router } from './app_server/routes';
import { defaultDbReady } from './app_server/models/db';

// Wrap the code in async immediate function so that we can await for
// promises.
(async function() {
  // Wait for the DB
  try {
    await defaultDbReady;
  }
  catch (e) {
    process.exit(-1);
  }

  // Create Express app instance
  const app = express();

  // View setup
  app.set('views', path.join(__dirname, 'app_server', 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));

  // Setup routers
  app.use('/', router);

  app.listen(SERVER_PORT, SERVER_ADDRESS, () => {
    console.log(`Server is listening on ${SERVER_ADDRESS}:${SERVER_PORT}`);
  });
})();
