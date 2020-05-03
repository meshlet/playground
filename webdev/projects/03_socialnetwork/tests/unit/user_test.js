/**
 * User model unit tests.
 */
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const bcrypt = require("bcryptjs");
const User = require("@models/user");
const dbSetup = require("@root/db_setup");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("user", function() {
    it('validation fails if email is not specified', async function () {
        const error = await expect(User.create({
            password: "Validpassword1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-02-21"
        }))
            .to.be.rejectedWith(mongoose.Error.ValidationError)
            .eventually.with.property("errors");

        // Assert that error has an `email` field (which indicates that email
        // validation has failed) and that this is the only property with
        // validation errors
        expect(error).to.have.property("email");
        expect(Object.getOwnPropertyNames(error).length).to.equal(1);
    });

    it('validation fails if email is invalid', async function () {
        const invalidEmailAddresses = [
            "",
            "abcd",
            "abcd@",
            "@",
            "@abc",
            "abc@domain",
            "abc@.com",
            null,
            undefined
        ];

        for (const emailAddress of invalidEmailAddresses) {
            const error = await expect(User.create({
                email: emailAddress,
                password: "Validpassword1234_",
                firstName: "Mickey",
                lastName: "Mouse",
                birthDate: "1972-02-21"
            }))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            expect(error).to.have.property("email");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if password is not specified', async function () {
        const error = await expect(User.create({
            email: "mickey.mouse@domain.com",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-02-21"
        }))
            .to.be.rejectedWith(mongoose.Error.ValidationError)
            .eventually.with.property("errors");

        // Assert that error has a `password` field (which indicates that
        // password validation has failed)
        expect(error).to.have.property("password");
        expect(Object.getOwnPropertyNames(error).length).to.equal(1);
    });

    it('validation fails if password does not satisfy requirements', async function () {
        const invalidPasswords = [
            "",
            null,
            undefined,
            "abc",
            "ABCDEFGHIJ",
            "abcdefghij",
            "123456678",
            "abcdeftgh1325",
            "ABCDEFTGHSE321",
            "Abcdefghtijd124",
            "jfdsJLdsf 1223_% fd!",
            "(!$#@^&**#$#@!@@~#@",
            "%^$434aABC%^$434aABC%^$434aABC%^$434aABC%^$434aABC%^$434aABC%^$434aABC%^$434aABC" +
                "%^$434aABC%^$434aABC%^"
        ];

        for (const password of invalidPasswords) {
            const error = await expect(User.create({
                email: "mickey.mouse@domain.com",
                password: password,
                firstName: "Mickey",
                lastName: "Mouse",
                birthDate: "1972-02-21"
            }))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            expect(error).to.have.property("password");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if first name is not specified', async function () {
        const error = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            lastName: "Mouse",
            birthDate: "1972-02-21"
        }))
            .to.be.rejectedWith(mongoose.Error.ValidationError)
            .eventually.with.property("errors");

        // Assert that error has a `firstName` field (which indicates that
        // first name validation has failed)
        expect(error).to.have.property("firstName");
        expect(Object.getOwnPropertyNames(error).length).to.equal(1);
    });

    it('validation fails if first name is null or empty string', async function () {
        const invalidNames = [
            "",
            null,
            undefined
        ];

        for (const name of invalidNames) {
            const error = await expect(User.create({
                email: "mickey.mouse@domain.com",
                password: "Mickey1234_",
                firstName: name,
                lastName: "Mouse",
                birthDate: "1972-02-21"
            }))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            expect(error).to.have.property("firstName");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if last name is not specified', async function () {
        const error = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            birthDate: "1972-02-21"
        }))
            .to.be.rejectedWith(mongoose.Error.ValidationError)
            .eventually.with.property("errors");

        // Assert that error has a `lastName` field (which indicates that
        // last name validation has failed)
        expect(error).to.have.property("lastName");
        expect(Object.getOwnPropertyNames(error).length).to.equal(1);
    });

    it('validation fails if last name is null or empty string', async function () {
        const invalidSurnames = [
            "",
            null,
            undefined
        ];

        for (const surname of invalidSurnames) {
            const error = await expect(User.create({
                email: "mickey.mouse@domain.com",
                password: "Mickey1234_",
                firstName: "Mickey",
                lastName: surname,
                birthDate: "1972-02-21"
            }))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            expect(error).to.have.property("lastName");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if birth date is not specified', async function () {
        const error = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mickey",
        }))
            .to.be.rejectedWith(mongoose.Error.ValidationError)
            .eventually.with.property("errors");

        // Assert that error has a `birthDate` field (which indicates that
        // birth date validation has failed)
        expect(error).to.have.property("birthDate");
        expect(Object.getOwnPropertyNames(error).length).to.equal(1);
    });

    it('validation fails if birth date is invalid', async function () {
        const invalidDates = [
            "",
            null,
            undefined,
            "abcderf",
            "ab/cd/1990",
            "1973/10/1a",
            "1988/13/24",
            "1982/10/32",
            "24.06.1990",
            "1990/ab/ab",
            "1990-12-32"
        ];

        for (const date of invalidDates) {
            const error = await expect(User.create({
                email: "mickey.mouse@domain.com",
                password: "Mickey1234_",
                firstName: "Mickey",
                lastName: "Mouse",
                birthDate: date
            }))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            expect(error).to.have.property("birthDate");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if profile picture basename is empty or null', async function () {
        const invalidBasenames = [
            "",
            null
        ];

        const user = {
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-01-17",
            profilePic: {
                type: "image/png"
            }
        };

        for (const basename of invalidBasenames) {
            user.profilePic.basename = basename;

            const error = await expect(User.create(user))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            // Assert that error has the `picturePic.basename` field (which indicates
            // that picturePic basename validation has failed)
            expect(error).to.have.property("profilePic.basename");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('validation fails if profile picture type is invalid', async function () {
        const invalidImageTypes = [
            "",
            null,
            "abcd",
            "image/",
            "png",
            "jpg",
            "image/svg+xml",
            "image/bmp"
        ];

        const user = {
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-01-17",
            profilePic: {
                basename: "profilepic"
            }
        };

        for (const imageType of invalidImageTypes) {
            user.profilePic.type = imageType;

            const error = await expect(User.create(user))
                .to.be.rejectedWith(mongoose.Error.ValidationError)
                .eventually.with.property("errors");

            // Assert that error has the `picturePic.type` field (which indicates that
            // picturePic type validation has failed)
            expect(error).to.have.property("profilePic.type");
            expect(Object.getOwnPropertyNames(error).length).to.equal(1);
        }
    });

    it('user can be saved to and retrieved from the database', async function () {
        // User must be created successfully
        const savedUser = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-01-17",
            work: "Walt Disney Company",
            education: "Cartoon University",
            residence: "Disneyland",
            birthplace: "Disneyland",
            biography: [ "Mickey Mouse is a cartoon" ],
            profilePic: {
                basename: "mickeymouse.png",
                type: "image/png"
            }
        })).to.be.fulfilled;

        // Find the user by their email
        const retrievedUser = await expect(User
            .findOne({ email: savedUser.email })
            .exec())
            .to.be.fulfilled;


        // Make sure the two User objects match
        expect(savedUser.toString()).to.deep.equal(retrievedUser.toString());
    });

    it('user password is hashed before it is stored to the database', async function () {
        // Create a new user in the database
        const user = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-01-17",
            work: "Walt Disney Company",
            education: "Cartoon University",
            residence: "Disneyland",
            birthplace: "Disneyland",
            biography: [ "Mickey Mouse is a cartoon" ],
            profilePic: {
                basename: "mickeymouse.png",
                type: "image/png"
            }
        })).to.be.fulfilled;

        // Use bcryptjs to compare raw password with the password in the
        // user object. The comparison will succeed only if the user
        // password is hashed
        await expect(bcrypt.compare("Mickey1234_", user.password))
            .to.become(true);
    });

    it('checkPassword method correctly compares passwords', async function () {
        // Create a new user in the database
        const user = await expect(User.create({
            email: "mickey.mouse@domain.com",
            password: "Mickey1234_",
            firstName: "Mickey",
            lastName: "Mouse",
            birthDate: "1972-01-17",
            work: "Walt Disney Company",
            education: "Cartoon University",
            residence: "Disneyland",
            birthplace: "Disneyland",
            biography: [ "Mickey Mouse is a cartoon" ],
            profilePic: {
                basename: "mickeymouse.png",
                type: "image/png"
            }
        })).to.be.fulfilled;

        // Assert that User.checkPassword method returns true when used with the
        // actual user password
        await expect(user.checkPassword("Mickey1234_"))
            .to.become(true);

        // Assert that User.checkPassword method returns true when used with
        // un-matching passwords
        for (const passwordGuess of [
            "",
            null,
            undefined,
            "abcdsfds",
            "Mickey1234",
            "Mickey123_",
            "Mickey12345_",
            "Mickey1233_"
        ]) {
            await expect(user.checkPassword(passwordGuess))
                .to.become(false);
        }
    });
});