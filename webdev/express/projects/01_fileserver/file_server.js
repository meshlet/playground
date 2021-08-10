/**
 * Implements a static file server.
 */
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

// Create the Express app instance
const app = express();

// Define the logger middleware
app.use((req, res, next) => {
    // Record the time at which the request was received
    const receivedTimestamp = performance.now();

    // The logging is done once the response is ended (meaning the last
    // segment of its headers and body has been sent to the client).
    res.on("finish", () => {
        // Calculate the time it took to process the request
        const processingDuration = (performance.now() - receivedTimestamp).toFixed(3);

        // Print the log
        console.log(`${req.method} ${req.url} ${res.statusCode} ${processingDuration} ms`);
    });

    // Proceed to the next middleware
    next();
});

// Define the static file server middleware. The root of the file server
// is the `current_dir/public/` directory. The full file path is formed
// by appending the request URL to this root directory
const rootDir = path.join(__dirname, "public");
app.use(async (req, res, next) => {
    const filePath = path.join(rootDir, req.url);

    try {
        // Check if the requested path exists
        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
            // If the `stats` object describes a regular file, send it back to
            // the client
            res.sendFile(filePath);
        }
        else {
            // Otherwise, proceed to the next middleware
            next();
        }
    }
    catch(err) {
        // The path doesn't exist, proceed to the next middleware
        next();
    }
});

// Define the 404 middleware
app.use((req, res) => {
    res.sendStatus(404);
});

// Start the server
http.createServer(app).listen(3000, () => {
    console.log("Server started at port 3000");
});