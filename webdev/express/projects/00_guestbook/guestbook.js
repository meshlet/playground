/**
 * Implements the server backend for the Guestbook app.
 */
const express = require("express");
const http = require("http");
const { once } = require("events");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");

// Create the Express app instance
const app = express();

// Inform Express that views are contained in the views/ directory
// and that EJS templating engine should be used
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// An array that stores the guestbook entries
const entries = [];

// Make the `entries` array visible in all views
app.locals.entries = entries;

// Add logging middleware
app.use(logger("dev"));

// Use body-parser middleware to read the body of the POST request
// when posting a new entry. Note that form data is URL-encoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// Add the express.static middleware that will serve static assets
// (in this case only CSS stylesheets)
app.use(express.static(path.join(__dirname, "public")));

// Define route for retrieving the home page
app.get("/", (req, res) => {
    res.render("home");
});

// Define the route for retrieve the new_entry page
app.get("/new_entry", (req, res) => {
    res.render("new_entry");
});

// Define the route for posting new guestbook entry
app.post("/new_entry", (req, res) => {
    if (!req.body.entry_title || !req.body.entry_text) {
        // The request must contain `entry_title` and `entry_text` form
        // fields
        req.status(400).end("Entries must have a title and a text");
    }
    else {
        // Add new entry
        entries.push({
            title: req.body.entry_title,
            text: req.body.entry_text,
            date: new Date()
        });

        // Redirect the client to the home page
        res.redirect("/");
    }
});

// Define the middleware that handles the request to an unknown URL
app.use((req, res) => {
    res.status(404).render("page_not_found");
});

// Start listening on port 3000
http.createServer(app).listen(3000, "localhost", () => {
    console.log("Server is now running at port 3000");
});

