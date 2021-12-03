import express from 'express';
import path from 'path';
import logger from 'morgan';
import { SERVER_PORT } from './env-parser';
import { router } from './app_server/routes';

// Create Express app instance
const app = express();

// View setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Setup routers
app.use('/', router);

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
