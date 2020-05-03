/**
 * Defines a Router that implements custom middleware and routes
 * for the web server.
 */
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("@models/user");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Returns a middleware function that checks if the user is logged in
// and redirects to the specified URL if not.
function getEnsureAuthenticatedMiddleware(redirectUrl) {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            // User is authenticated, proceed to the next middleware
            next();
        }
        else {
            // Redirect to the specified URL
            req.flash("info", "You must be logged-in to see this page");
            res.redirect(redirectUrl);
        }
    };
}

// Returns a middleware function that checks if the user is logged out
// and redirects to the provided URL if not.
function getEnsureUnauthenticatedMiddleware(getRedirectUrl) {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            // User is not authenticated, proceed to the next middleware
            next();
        }
        else {
            // Redirect to the specified URL
            res.redirect(getRedirectUrl(req.user));
        }
    };
}

// Define a middleware that parses multipart form data using formidable
// module
router.use((req, res, next) => {
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
});

// Define a middleware that sets up view-local variables needed by
// multiple views
router.use((req, res, next) => {
    res.locals.loggedInUser = req.user;
    res.locals.displayName = req.user ? req.user.firstName : undefined;
    res.locals.formFields = req.body;
    next();
});

// Define a route for the home page
router.get("/", async (req, res, next) => {
    try {
        // Retrieve all users from the database and sort them in descending
        // order, with newest users first
        const users = await User.find()
            .sort({ createdAt: "descending" })
            .exec();

        // Render the view
        res.render("index", { users: users });
    }
    catch (err) {
        // The database query failed unexpectedly. Enter error-handling mode
        // which leads to 500 error sent to the client
        next(err);
    }
});

// Define a route for the sign up page
router.get("/signup",
    // Sign-up page is accessible only if user is not already logged in
    getEnsureUnauthenticatedMiddleware(loggedInUser => {
        // If user is logged-in, redirect them to their profile page
        return "/users/" + loggedInUser._id;
    }),

    (req, res) => {
        res.render("signup");
    }
);

// Define a route for the login page
router.get("/login",
    // Login page is accessible only if user is not already logged in
    getEnsureUnauthenticatedMiddleware(loggedInUser => {
        // If user is logged-in, redirect them to their profile page
        return "/users/" + loggedInUser._id;
    }),

    (req, res) => {
        res.render("login");
    }
);

// Define a route for the user profile page
router.get("/users/:id", async (req, res, next) => {
    try {
        // Query the database for the user with the given ID
        const user = await User
            .findById(req.params.id)
            .exec();

        if (user) {
            // Found the user, render their profile page
            return res.render("view_user", { user: user });
        }
    }
    catch (err) {
        // The database query failed unexpectedly. Enter error-handling mode
        // which leads to 500 error sent to the client
        return next(err);
    }

    // Call the error-handling middlware
    req.flash("error", "User with given ID not found");
    res.redirect("/");
});

// Define a route for the update profile page
router.get("/update",
    // Update profile page is accessible only if user is authenticated
    getEnsureAuthenticatedMiddleware("/login"),

    (req, res, next) => {
        res.render("update_user");
    }
);

// Define a route middleware that handles logout action
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});

// Define a route for the sign up POST request
router.post("/signup",
    // The request is ignored if user is logged in
    getEnsureUnauthenticatedMiddleware(loggedInUser => {
        // Redirect the user to their profile page
        return "/users/" + loggedInUser._id;
    }),

    async (req, res, next) => {
        try {
            // Check if the user with the specified email already exists
            const user = await User
                .findOne({email: req.body.email})
                .exec();

            if (user) {
                // User with the given email already exists
                req.flash("error", `User with ${req.body.email} email already exists`);

                // Re-render the signup page with the error
                return res.status(403).render("signup");
            }

            // Otherwise, create a new user
            await User.create({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                birthDate: req.body.birth_date
            });

            // Redirect the user to the login page. Note the `303 See Other`
            // status which indicates that client should redirect to the new
            // URL with GET method
            req.flash("info", "Account has been created");
            res.redirect(303, "/login");
        }
        catch (err) {
            // If `error` is not instance of ValidationError, something has gone
            // wrong at server-side. Report the internal server error
            if (!(err instanceof mongoose.Error.ValidationError)) {
                return next(err);
            }

            if (err.errors) {
                // Create flash error message for each field of the User document
                Object.getOwnPropertyNames(err.errors).forEach(prop => {
                    req.flash("error", err.errors[prop].message);
                });
            }

            // Re-render the sign-up page with errors
            res.status(400).render("signup");
        }
    }
);

// Define a route for the login POST request. This is where the Passport's
// authenticate middleware is invoked
router.post("/login",
    // The request is ignored if user is logged in
    getEnsureUnauthenticatedMiddleware(loggedInUser => {
        // Redirect the user to their profile page
        return "/users/" + loggedInUser._id;
    }),

    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                // Server error has occurred
                return next(err);
            }

            if (!user) {
                // User authentication failed. Re-render the login page
                req.flash("error", info.message);
                return res.status(401).render("login");
            }

            // Login the user
            req.login(user, err => {
                if (err) {
                    // Internal server error has occurred
                    return next(err);
                }

                // User has been successfully logged in, redirect to their
                // profile page
                res.redirect("/users/" + user._id);
            })
        })(req, res, next);
    }
);

// Define a route for the update profile POST request
router.post("/update",
    // The request is ignored unless the user is logged in
    getEnsureAuthenticatedMiddleware("/login"),

    async (req, res, next) => {
        try {
            // Update the logged-in user instance fields with the parsed
            // form data. Note that this does not mean that logged-in user
            // will actually be modified. That will happen only if the
            // modification are successfully saved to the database
            req.user.firstName = req.body.first_name;
            req.user.lastName = req.body.last_name;
            req.user.birthDate = req.body.birth_date;
            req.user.work = req.body.work;
            req.user.education = req.body.education;
            req.user.residence = req.body.residence;
            req.user.birthplace = req.body.birth_place;

            // Split the biography text using newline characters as a delimiter.
            // Each of the produced strings will be rendered as a single HTML
            // paragraph
            if (req.body.biography) {
                req.user.biography = [];
                req.body.biography.split("\r\n").forEach(str => {
                    if (str) {
                        req.user.biography.push(str);
                    }
                });
            }

            // If profile picture has been uploaded, move it to proper location
            const profilePic = req.uploadedFiles.selected_profile_pic;
            if (profilePic && profilePic.size > 0) {
                // Take the uploaded image basename and form the destination
                // path
                const basename = path.basename(profilePic.path);
                const destPath = path.join(__dirname, "public", "images", basename);

                // Move the file to the destination directory
                await fs.promises.rename(profilePic.path, destPath);

                // Update the logged-in user profile pic fields
                req.user.profilePic.basename = basename;
                req.user.profilePic.type = profilePic.type;
            }

            // Save the user back to the database
            await req.user.save();

            // Redirect the user to their profile page
            res.redirect(303, "/users/" + req.user._id);
        }
        catch (err) {
            // If `error` is not instance of ValidationError, something has gone
            // wrong at server-side. Report the internal server error
            if (!(err instanceof mongoose.Error.ValidationError)) {
                return next(err);
            }

            if (err.errors) {
                // Create flash error message for each field of the User document
                Object.getOwnPropertyNames(err.errors).forEach(prop => {
                    req.flash("error", err.errors[prop].message);
                });
            }

            // Re-render the update profile page with errors
            res.status(400).render("update_user");
        }
    }
);

// Define a 404 middleware
router.use((req, res) => {
    req.flash("error", "Resource Not Found (404)");
    res.redirect("/");
});

// Define the error-handling middleware
router.use((err, req, res, next) => {
    console.log(err.message);
    req.flash("error", "Unable to process the request due to an internal server error");
    res.redirect("/");
});

// Export the router
module.exports = router;