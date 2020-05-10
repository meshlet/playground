/**
 * Middleware used to parse HTTP request body.
 */
const bodyParser = require("body-parser");
const formidable = require("formidable");

// Export a body-parser middleware instance used to parser URL-encoded form data
module.exports.parseUrlEncodedForm = bodyParser.urlencoded({
    // The values parsed from the request can only be strings or arrays
    extended: false
});

// Export a middleware function used to parse multipart form data using formidable
module.exports.parseMultipartForm = (req, res, next) => {
    if (req.is("multipart/form-data")) {
        // Create a formidable instance
        const form = formidable({
            keepExtensions: true
        });

        // Parse the form data
        form.parse(req, (err, fields, files) => {
            if (err) {
                // Malformed body
                return next(err);
            }

            // Add parsed fields and files to the req object
            req.body = fields;
            req.uploadedFiles = files;

            // Proceed to the next middleware
            next();
        });
    }
    else {
        // Proceed to the next middleware
        next();
    }
};