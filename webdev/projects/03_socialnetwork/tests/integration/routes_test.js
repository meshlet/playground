/**
 * Integration tests for the middleware and routes defined in
 * routes.js.
 */
const mongoose = require("mongoose");
const User = require("@models/user");
const { getHttpServer } = require("./integration.bootstrap");
const supertest = require("supertest");
const querystring = require("querystring");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const chaiExpect = chai.expect;

describe("routes", function () {
    // Defaults to use with the signUp function
    const EMAIL = "mickey.mouse@cartoon.com";
    const PASSWORD = "Mickey1234_";
    const FIRST_NAME = "Mickey";
    const LAST_NAME = "Mouse";
    const BIRTH_DATE = "1972-09-21";

    // Sign-up helper. It is up to the caller to setup expectations for the
    // response
    function signUp(user = {}) {
        return superAgent
            .post("/signup")
            .send(querystring.encode({
                email: user.hasOwnProperty("email") ? user.email : EMAIL,
                password: user.hasOwnProperty("password") ? user.password : PASSWORD,
                first_name: user.hasOwnProperty("firstName") ? user.firstName : FIRST_NAME,
                last_name: user.hasOwnProperty("lastName") ? user.lastName : LAST_NAME,
                birth_date: user.hasOwnProperty("birthDate") ? user.birthDate : BIRTH_DATE
            }));
    }

    // Login helper. The caller should setup the expectations for the response
    function logIn(user = {}) {
        return superAgent
            .post("/login")
            .send(querystring.encode({
                email: user.hasOwnProperty("email") ? user.email : EMAIL,
                password: user.hasOwnProperty("password") ? user.password : PASSWORD
            }));
    }

    // Update profile helper. The caller should setup the expectations for the
    // response
    function updateProfile(user = {}) {
        // This is a multipart request
        const request = superAgent.post("/update");

        if (user.firstName != null) {
            request.field("first_name", user.firstName);
        }
        if (user.lastName != null) {
            request.field("last_name", user.lastName);
        }
        if (user.birthDate != null) {
            request.field("birth_date", user.birthDate);
        }
        if (user.work != null) {
            request.field("work", user.work);
        }
        if (user.education != null) {
            request.field("education", user.education);
        }
        if (user.residence != null) {
            request.field("residence", user.residence);
        }
        if (user.birthplace != null) {
            request.field("birth_place", user.birthplace);
        }
        if (user.biography != null) {
            request.field("biography", user.biography);
        }
        return request;
    }

    // Gets a user from the database
    function getUser(email) {
        return User
            .findOne({ email: email })
            .exec();
    }

    // HTTP server instance
    let httpServer = undefined;

    before(function () {
        // Retrieve the HTTP server instance before the tests are run
        httpServer = getHttpServer();
    });

    // Create an instance of a super agent for each test using the
    // `agent()` method. Such agent will persist cookies and include
    // them in following requests
    let superAgent = undefined;
    beforeEach(function () {
        superAgent = supertest.agent(httpServer);
    });

    it('GET / returns 200 OK', async function () {
        await supertest(httpServer)
            .get("/")
            .expect("Content-Type", /text\/html/)
            .expect(200);
    });

    it('GET /signup returns 200 OK if user is logged out', async function () {
        await supertest(httpServer)
            .get("/signup")
            .expect("Content-Type", /text\/html/)
            .expect(200);
    });

    it('GET /login returns 200 OK if user is logged out', async function () {
        await supertest(httpServer)
            .get("/login")
            .expect("Content-Type", /text\/html/)
            .expect(200);
    });

    it('GET /users/unknown-user-id redirects to /', async function () {
        await supertest(httpServer)
            .get("/users/" + (new mongoose.Types.ObjectId).toString())
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/")
            .expect(302);
    });

    it('GET /update redirects to /login is user is logged out', async function () {
        await supertest(httpServer)
            .get("/update")
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(302);
    });

    it('GET /logout redirects to / if user is logged out', async function () {
        await supertest(httpServer)
            .get("/logout")
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/")
            .expect(302);
    });

    it('user redirected to login page after successful POST /signup', async function () {
        await signUp()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(303);
    });

    it('database contains new user after successful POST /signup', async function () {
        await signUp()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(303);

        // Assert that user exists in the database
        await chaiExpect(User
            .findOne({ email: EMAIL })
            .exec()).to.eventually.not.be.null;
    });

    it('POST /signup fails with 403 if email address already exists', async function () {
        // First sign-up should be successful
        await signUp()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(303);

        // The second sign-up with the same email fails with 403 with content type
        // set to HTML (sign-up page re-rendered)
        await signUp()
            .expect("Content-Type", /text\/html/)
            .expect(403);
    });

    it('POST /signup fails with 400 if email is invalid', async function () {
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

        for (const email of invalidEmailAddresses) {
            await signUp({ email: email })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /signup fails with 400 if password is invalid', async function () {
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
            await signUp({ password: password })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /signup fails with 400 if first name is invalid', async function () {
        const invalidNames = [
            "",
            null,
            undefined
        ];

        for (const firstName of invalidNames) {
            await signUp({ firstName: firstName })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /signup fails with 400 if last name is invalid', async function () {
        const invalidSurnames = [
            "",
            null,
            undefined
        ];

        for (const lastName of invalidSurnames) {
            await signUp({ lastName: lastName })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /signup fails with 400 if birth date is invalid', async function () {
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
            await signUp({ birthDate: date })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('successful POST /login redirects to user profile page', async function () {
        // Sign-up
        await signUp().expect(303);

        // Login
        await logIn()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(302);
    });

    it('POST /login fails with 401 if email does not match', async function () {
        // Sign-up
        await signUp().expect(303);

        // Login with an email that doesn't match
        await logIn({ email: "unknown.email@domain.com" })
            .expect("Content-Type", /text\/html/)
            .expect(401);
    });

    it('POST /login fails with 401 if password does not match', async function () {
        // Sign-up
        await signUp().expect(303);

        // Login with a password that doesn't match
        await logIn({ password: "wrongpassword" })
            .expect("Content-Type", /text\/html/)
            .expect(401);
    });

    it('POST /update redirects to /login if user is logged out', async function () {
        await updateProfile()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(302);
    });

    it('POST /update fails with 400 if first name is empty or missing', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        const invalidNames = [
            "",
            null,
            undefined
        ];

        for (const firstName of invalidNames) {
            await updateProfile({
                firstName: firstName,
                lastName: LAST_NAME,
                birthDate: BIRTH_DATE
            })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /update fails with 400 if last name is empty or missing', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        const invalidSurnames = [
            "",
            null,
            undefined
        ];

        for (const surname of invalidSurnames) {
            await updateProfile({
                firstName: FIRST_NAME,
                lastName: surname,
                birthDate: BIRTH_DATE
            })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('POST /update fails with 400 if birth date is invalid', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

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
            await updateProfile({
                firstName: FIRST_NAME,
                lastName: LAST_NAME,
                birthDate: date
            })
                .expect("Content-Type", /text\/html/)
                .expect(400);
        }
    });

    it('user can successfully update their profile', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        // Update user profile
        const user = {
            firstName: "Bruce",
            lastName: "Wayne",
            birthDate: "1969-09-21",
            work: "Wayne Enterprises",
            education: "Gotham University",
            residence: "Gotham",
            birthplace: "Gotham",
            biography: "Superhero"
        };

        // User is redirected to their profile page after successful update
        await updateProfile(user)
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(303);

        // Read the user from the database and make sure their data has
        // been updated
        const modifiedUser = await getUser(EMAIL);
        user.biography = [ user.biography ];
        Object.getOwnPropertyNames(user).forEach(prop => {
            chaiExpect(modifiedUser[prop]).to.deep.equal(user[prop]);
        });
    });

    it.skip('user can successfully update their profile picture', function () {

    });

    it('GET /signup redirects to profile page if user is logged in', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await signUp()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(302);
    });

    it("GET /login redirects to profile page if user is logged in", async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await logIn()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(302);
    });

    it('GET /update returns 200 if user is logged in', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await superAgent
            .get("/update")
            .expect("Content-Type", /text\/html/)
            .expect(200);
    });

    it('GET /users/existing-user-id returns 200', async function () {
        // Sign up
        await signUp().expect(303);

        await superAgent
            .get("/users/" + (await getUser(EMAIL)).id.toString())
            .expect("Content-Type", /text\/html/)
            .expect(200);
    });

    it('GET /logout redirects to / if user is logged in', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await superAgent
            .get("/logout")
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/")
            .expect(302);
    });

    it('GET /update redirects to /login if requested after user logs out', async function () {
        // Sign-up & login & logout
        await signUp().expect(303);
        await logIn().expect(302);
        await superAgent.get("/logout").expect(302);

        // GET /update now redirects to /login
        await superAgent
            .get("/update")
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/login")
            .expect(302);
    });

    it('POST /signup redirects to profile page if user is logged in', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await signUp()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(302);
    });

    it('POST /login redirects to profile page if user is logged in', async function () {
        // Sign-up & login
        await signUp().expect(303);
        await logIn().expect(302);

        await logIn()
            .expect("Content-Type", /text\/plain/)
            .expect("Location", "/users/" + (await getUser(EMAIL)).id.toString())
            .expect(302);
    });
});