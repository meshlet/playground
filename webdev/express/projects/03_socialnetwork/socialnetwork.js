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
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const logger = require("morgan");
const flash = require("express-flash");
const passport = require("passport");
const routes = require("@root/routes");
const { parseUrlEncodedForm, parseMultipartForm } = require("@root/req_body_parsers");
const setupPassport = require("@root/passport_setup");
const { registerSecurityMiddleware } = require("@root/security");
const csrf = require("csurf");

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

    // Register various security middleware
    registerSecurityMiddleware(app);

    // Add Morgan logging middleware
    app.use(logger("dev"));

    // Add express.static middleware that will serve static assets
    // from the public/ directory
    app.use(express.static(path.join(__dirname, "public")));

    // Use express-session middleware for session management
    app.use(session({
        // Configure the cookies
        cookie: {
            httpOnly: true,
            sameSite: "strict",

            // TODO: always enable secure cookies once HTTPS is enabled in tests
            secure: process.env.NODE_ENV !== "test" ? true : false
        },
        resave: false,
        saveUninitialized: false,
        secret: "5dfdjk%$^@$@#$#@jkfdjsfds@#$%@mmvdfdsf+++===``12",
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            touchAfter: 3 * 3600
        })
    }));

    // Use express-flash for displaying flash messages
    app.use(flash());

    // Add middleware for passing URL-encoded HTML forms
    app.use(parseUrlEncodedForm);

    // Add middleware for parsing multipart HTML forms (won't have any effect if
    // the form data is URL encoded)
    app.use(parseMultipartForm);

    // Add CSRF protection middleware used to send CSRF tokens embedded in HTML
    // forms and verify these tokens in request bodies (for all HTTP requests
    // except GET, OPTIONS and HEAD)
    app.use(csrf());

    // Add passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // TODO: add favicon.ico to the root of the website
    app.get("/favicon.ico", (req, res) => {
        res.sendStatus(204);
    });

    // Register the custom Router
    app.use(routes);

    // Define a 404 middleware
    app.use((req, res) => {
        req.flash("error", "Resource Not Found (404)");
        res.redirect("/");
    });

    // Define the error-handling middleware
    // TODO:
    //  - customize message for the CSRF token verification failure (EBADCSRFTOKEN)
    //  - improve error handling in general (instead of redirecting consider rendering
    //    an error page and setting proper HTTP error status instead of the default
    //    302 status set by the redirect method
    app.use((err, req, res, next) => {
        req.flash("error", "Unable to process the request due to an internal server error");
        res.redirect("/");
    });

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