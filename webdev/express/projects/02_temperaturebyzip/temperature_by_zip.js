/**
 * Implements an Express server that accepts the USA ZIP code from
 * the client and returns the current temperature in that area as
 * JSON.
 */
const express = require("express");
const logger = require("morgan");
const path = require("path");
const zipdb = require("zippity-do-dah");
const weather = require('openweather-apis');

// Create an Express app instance
const app = express();

// Inform Express that views are contained in the views/ directory
// and that EJS templating engine should be used
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Setup the weather module
weather.setLang("en");
weather.setUnits("metric");
weather.setAPPID("37ab7fc4309a5a8bb9e9b09fbd1897aa");

// Add logging middleware
app.use(logger("dev"));

// Add the express.static middleware that will serve static assets
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the home page
app.get("/", (req, res) => {
    res.render("index");
});

// Define a route for the /zipcode request. The regex matches any
// digit sequence with length 1 to 5 digits. Note that this includes
// digit sequences which are not valid US ZIP codes
app.get(/^\/(\d{1,5})$/, (req, res, next) => {
    // Convert the ZIP code to a location
    const location = zipdb.zipcode(req.params[0]);

    if (!location.zipcode) {
        // Couldn't get location from the ZIP code. Execute the error
        // middleware
        next(new Error(`Unknown ZIP code '${req.params[0]}'`));
    }
    else {
        // Set latitude and longitude in the weather module
        const { latitude, longitude } = location;
        weather.setCoordinate(latitude, longitude);

        // Get the temperature
        weather.getTemperature((err, temp) => {
            if (err) {
                // Couldn't get the temperature measurement. Execute the error
                // middleware
                next(new Error(`Failed to obtain the temperature for ZIP code '${req.params[0]}'`));
            }
            else {
                // Send a response as a JSON object with ZIP code and temperature
                // measurement
                res.json({
                    zipcode: req.params[0],
                    temperature: temp
                });
            }
        });
    }
});

// Define the 404 middleware
app.use((req, res) => {
    res.status(404).render("404");
});

// Define the error middleware that is executed if /zipcode route encounters
// an error
app.use((err, req, res, next) => {
    // Fail with 500 (internal server error) and send the failure reason
    res.status(500).json({
        error: err.message
    });
});

// Start the server at port 3000
app.listen(3000, () => {
    console.log("Server is now running at port 3000");
});