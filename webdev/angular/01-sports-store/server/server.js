/**
 * Implements an Express HTTP server used as a backed for the SportsStore Angular app.
 *
 * @note HTTP/HTTPS servers listen on 8080/8443 ports respectively to avoid having to
 * run the server with admin privileges. This however means that port forwarding needs
 * to be setup, so that any traffic to port 80/443 is re-routed to port 8080/8443.
 *
 * The following can be used to setup port forwarding on OSX:
 echo "
 rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 8080
 rdr pass inet proto tcp from any to any port 443 -> 127.0.0.1 port 8443
 " | sudo pfctl -ef -
 */

const express = require('express');
const http = require('http');
const https = require('https');
const connect_history = require('connect-history-api-fallback');
const morgan = require('morgan');
const body_parser = require('body-parser');
const json_server = require('json-server');
const { registerSecurityMiddleware } = require('./security');
const auth = require('./authMiddleware');
const path = require('path');
const fs = require('fs');

// Create Express app isntance
const app = express();

// Register various security middleware
registerSecurityMiddleware(app);

// Enable logging
app.use(morgan('dev'));

// Add JSON parser middleware
app.use(body_parser.json());

// Add user authentication middleware
app.use(auth);

// JSON server handles all the HTTP requests where URL starts with /api
app.use('/api', json_server.router(path.join(__dirname, 'serverdata.json')));

// Use connect-history-api-fallback middleware to work-around the issues where
// browser requests an HTML file other than index.html (which can be the case
// if user manually modifies URL). This middleware will modify the URL in these
// cases, so that index.html is requested instead. This is not done for direct
// file requests (such as images, scripts etc.).
app.use(connect_history());

// Add express.static middleware that serves Angular files
app.use(express.static(path.normalize(path.join(__dirname, '../dist/sports-store'))));

// If this point is reached, client request a file which doesn't exist
app.use((req, res) => {
  res.sendStatus(404);
});

// Finally, register the server error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).redirect('/');
});

// Start the HTTP server
const httpServer = http.createServer(app).listen(8080, 'localhost', () => {
  console.log(`HTTP server started at port ${httpServer.address().port}`);
});

// Start the HTTPS server
const httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "tls_cert", "sportsstore-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "tls_cert", "sportsstore-cert.pem"))
  },
  app).listen(8443, 'localhost', () => {
  console.log(`HTTPS server started at port ${httpsServer.address().port}`);
});
