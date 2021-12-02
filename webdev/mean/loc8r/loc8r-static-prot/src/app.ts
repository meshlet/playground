import express from 'express';
import path from 'path';
import logger from 'morgan';
import { router } from './app_server/routes';

// TODO: port needs to be parsed from command line before using a default port
const port = 3000;

// Create Express app instance
const app = express();

// View setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Setup routers
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
