/**
 * Defines the database model for the user account.
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { JSDOM } = require("jsdom");
const DOMPurify = require("dompurify")(new JSDOM("").window);
const validator = require("validator");
const PasswordValidator = require("password-validator");

// Setup the password validator instance.
// TODO:
//  should add a list of blacklisted passwords with
//  is().not().oneOf([])
const passwordValidatorSchema = new PasswordValidator();
passwordValidatorSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

// Create the user schema
const userSchema = mongoose.Schema({
    email: {
        type: "String",
        required: [ true, "Email address is required"],
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: "String",
        required: [ true, "Password is required" ],
        validate: {
            validator: value => {
                return passwordValidatorSchema.validate(value);
            },
            message: () => {
                return "Password length must be between 8 and 100 characters. It must contain " +
                    "at least one of: uppercase and lowercase letters, a digit and a symbol. It " +
                    "must not contain spaces.";
            }
        }
    },
    firstName: {
        type: "String",
        required: [ true, "First name is required" ],
        minLength: [1, "First name must not be empty"]
    },
    lastName: {
        type: "String",
        required: [ true, "Last name is required" ],
        minLength: [1, "Last name must not be empty"]
    },
    birthDate: {
        type: "Date",
        required: [ true, "The date of birth is required" ],
        validate: {
            validator: value => {
                return new Date(value).toString().toLowerCase() !== "invalid date";
            },
            message: props => `${props.value} doesn't represent a valid date`
        }
    },
    createdAt: { type: "Date", default: Date.now },
    work: String,
    education: String,
    residence: String,
    birthplace: String,
    biography: [String],
    profilePic: {
        basename: {
            type: "String",
            default: "placeholder-profile-pic.png",
            minLength: [1, "The profile picture filename must not be empty"]
        },
        type: {
            type: "String",
            default: "image/png",
            validate: {
                validator: value => {
                    // Accepts only JPEG and PNG image types
                    return value === "image/png" || value === "image/jpeg";
                },
                message: props => `Only JPEG and PNG images are accepted`
            }
        }
    }
});

// Attach a hook that is executed before the `validate` is called on
// the User model, which is typically done right before the document
// is stored to the database. The purpose of this hook is to sanitize
// the insecure user input, to make sure that unsafe data is never
// stored in the database. This helps mitigate XSS attacks
userSchema.pre("validate", function (next) {
    // `password` is hashed and it's not shown in DOM so there's no
    // need to sanitize it. `birthDate` is not sanitized as any unsafe
    // string (i.e. executable JavaScript) is not a valid Date.
    // `createdAt` is not sanitized because it's automatically set.
    // `profilePic` is not sanitized because it's automatically
    // generated. `email` is not sanitized because doing that would
    // mark many valid email addresses invalid. Hence, `email` address
    // is HTML-escaped before it is displayed in the DOM.
    this.firstName = DOMPurify.sanitize(this.firstName);
    this.lastName = DOMPurify.sanitize(this.lastName);
    this.work = DOMPurify.sanitize(this.work);
    this.education = DOMPurify.sanitize(this.education);
    this.residence = DOMPurify.sanitize(this.residence);
    this.birthplace = DOMPurify.sanitize(this.birthplace);

    // Sanitize each of the paragraphs in the biography
    if (this.biography) {
        this.biography = this.biography.map(str => DOMPurify.sanitize(str));
    }

    // Move to the next middleware (pre-save)
    next();
});

// Define a pre-save function that is run before saving the model
// to the database. The purpose of this pre-save action is to
// produce a one-way hash for the account password, that is stored
// to the database instead of the plain text password.
userSchema.pre("save", function(next) {
    // Save the reference to the user document
    const user = this;

    // If account password wasn't modified, skip the following code
    if (!user.isModified("password")) {
        return next();
    }

    // Generate a salt for the hash. The following code uses 10 algorithm
    // iterations to generate the salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            // Couldn't generate the salt, the changes won't be saved to
            // the database
            return next(err);
        }

        // Hash the password. The function passed as the last argument is
        // invoked once hashing finishes (or error occurs)
        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if (err) {
                // Couldn't hash the password
                return next(err);
            }

            // Replace the plain text with the hashed password and proceed
            // with the save operation
            user.password = hashedPassword;
            next();
        });
    });
});

// Add a method to the account schema which is used to check the password
// entered by the user with the password stored in the database. The method
// returns a promise that is resolved with the true/false boolean value
// depending on the result of comparison, or rejected in case of an error.
userSchema.methods.checkPassword = function(passwordGuess) {
    // Use bcrypt to compare the passwords. Note that passwordGuess is hashed
    // by the `bcrypt.compare` method before it is compared with the password
    // hash stored in the database
    return bcrypt.compare(passwordGuess, this.password);
};

// Create the user model
module.exports = mongoose.model("User", userSchema);
