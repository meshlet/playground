/**
 * Exposes a function that sets up Passport with local authentication
 * strategy (username and password).
 */
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

module.exports = () => {
    // Define a function that serializes user to the session. Only
    // User ID is stored in the session. Passport calls this from
    // within its authenticate middleware (when the user is getting
    // authenticated)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Define a function that de-serializes user from the session.
    // Passport invokes this on each request to restore the authenticated
    // user from the session and assign it to `req.user`
    passport.deserializeUser(async (userId, done) => {
        try {
            // Query the database for the user with the specified ID
            const user = await User
                .findById(userId)
                .exec();

            // Pass the user to the `done` callback
            done(null, user);
        }
        catch (err) {
            // Report an error by passing it as the first argument to `done`
            done(err);
        }
    });

    // Define a local authentication strategy used by passport to authenticate
    // users using their username and password
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    async (email, password, done) => {
        try {
            // Find the user with the specified email
            const user = await User
                .findOne({email: email})
                .exec();

            if (!user) {
                // No such user
                return done(null, false, {
                    message: "Unknown email address"
                });
            }

            // Check the password
            if (await user.checkPassword(password)) {
                // Password matches
                done(null, user);
            }
            else {
                // Password mismatch
                done(null, false, {
                    message: "Incorrect password"
                });
            }
        }
        catch (err) {
            done(err);
        }
    }))
};