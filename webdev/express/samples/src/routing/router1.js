/**
 * Implements an Express router.
 */
const express = require("express");

// Expose a function that creates and returns router1 instance
module.exports = () => {
    // Create a router instance
    const router = express.Router();

    // Define a middleware that checks if the request URL is /error
    // and fails the request if that's the case
    router.use((req, res, next) => {
        if (req.url === "/error") {
            // Internal server error
            res.sendStatus(500);
        }
        else {
            // Otherwise, go to the next middleware or route
            next();
        }
    });

    // Define a route for the /user/id middleware
    router.get("/user/:id", (req, res) => {
        // Send the user ID back to the client
        res.send(req.params.id);
    });

    // Return the new router instance
    return router;
};

