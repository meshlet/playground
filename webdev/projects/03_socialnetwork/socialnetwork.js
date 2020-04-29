/**
 * The starting point for the social network backend.
 */

// Bootstrap module aliases
require('module-alias/register');

const express = require("express");
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

(async () => {
    // Attempt to connect to the MongoDB database
    await dbSetup.connect();

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

    // Register the custom Router
    app.use(routes);

    // Start the HTTP server at port 3000
    app.listen(3000, () => {
        console.log("Server started at port 3000");
    });
})();