/**
 * The starting point for the social network backend.
 */

// Bootstrap module aliases
require('module-alias/register');

const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
const dbSetup = require("@root/db_setup");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const logger = require("morgan");
const flash = require("express-flash");
const passport = require("passport");
const routes = require("@root/routes");
const setupPassport = require("@root/passport_setup");
const enforceTLS = require("express-enforces-ssl");
const helmet = require("helmet");
const ms = require("ms");

// Functions that resolve/reject the exported promises, once the HTTP
// and HTTPS servers start listening or a failure occurs
let resolveHttpServerPromise = undefined;
let rejectHttpServerPromise = undefined;
let resolveSecureHttpServerPromise = undefined;
let rejectSecureHttpServerPromise = undefined;

// Export a promise that resolves with the HTTP server
module.exports.httpServerPromise = new Promise((resolve, reject) => {
    resolveHttpServerPromise = resolve;
    rejectHttpServerPromise = reject;
});

// Export a promise that resolves with the HTTPS server
module.exports.httpsServerPromise = new Promise((resolve, reject) => {
    resolveSecureHttpServerPromise = resolve;
    rejectSecureHttpServerPromise = reject;
});

(async () => {
    try {
        // Attempt to connect to the MongoDB database
        await dbSetup.connect();
    }
    catch (err) {
        // Reject the exported promises and re-throw
        rejectHttpServerPromise();
        rejectSecureHttpServerPromise();
        throw err;
    }

    // Wait for the User model indexes to get built
    await require("@models/user").init();

    // Create an Express app instance
    const app = express();

    // Let Express know about the location of views and that EJS
    // templating engine should be used
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    // Setup Passport
    setupPassport();

    // Add Morgan logging middleware
    app.use(logger("dev"));

    // Add middleware that redirects to HTTPS URL whenever an HTTP
    // request is received.
    // TODO:
    //  should be used for testing too, once integration tests
    //  are fixed to work with HTTPS.
    if (process.env.NODE_ENV !== "test") {
        app.use(enforceTLS());
    }

    // Use HSTS to instruct client to stay on HTTPS for 2 years
    app.use(helmet.hsts({
        maxAge: ms("2 years"),
        includeSubDomains: true
    }));

    // Add express.static middleware that will serve static assets
    // from the public/ directory
    app.use(express.static(path.join(__dirname, "public")));

    // Use express-session middleware for session management
    app.use(session({
        cookie: {
            sameSite: "strict"
        },
        resave: false,
        saveUninitialized: false,
        secret: "5dfdjk%$^@$@#$#@jkfdjsfds@#$%@mmvdfdsf+++===``12",
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            touchAfter: 3 * 3600
        })
    }));

    // Use body-parser middleware to parser URL-encoded form data
    app.use(bodyParser.urlencoded({
        // The values parsed from the request can only be strings or
        // arrays
        extended: false
    }));

    // Use express-flash for displaying flash messages
    app.use(flash());

    // Add passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // TODO: add favicon.ico to the root of the website
    app.get("/favicon.ico", (req, res) => {
        res.sendStatus(204);
    });

    // Register the custom Router
    app.use(routes);

    // Start the HTTP server
    const httpServer = http.createServer(app).listen(3080, "localhost", () => {
        console.log(`HTTP server started at port ${httpServer.address().port}`);

        // Resolve the exported promise with the HTTP server instance
        resolveHttpServerPromise(httpServer);
    });

    // Start the HTTPS server
    const httpsServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname, "tls_cert", "socialnetwork-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "tls_cert", "socialnetwork-cert.pem"))
    },
    app)
        .listen(3443, "localhost", () => {
            console.log(`HTTPS server started at port ${httpsServer.address().port}`);

            // Resolve the exported promise with the HTTP server instance
            resolveSecureHttpServerPromise(httpsServer);
        });

    // Attach a listener for the HTTP server's `close` event. Once the server
    // is closed the database connection is terminated as well. An assumption
    // is made that HTTPS server will never remain opened after HTTP server
    // is closed
    httpServer.on("close", () => {
        dbSetup.close();
    });
})();