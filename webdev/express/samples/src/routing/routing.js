/**
 * Illustrates the routing in the Express framework as well as
 * using Express routers to split the application in several
 * smaller components.
 */
const express = require("express");
const http = require("http");
const assert = require("assert").strict;
const { once } = require("events");
const fs = require("fs");
const path = require("path");
const helpers = require("../helpers");
const router1 = require("./router1");

describe("Routing", function () {
    // Temporary web-server root directory
    const SERVER_ROOT_PATH = helpers.generateSeverRootPath();

    // Create a temporary directory used as a web-server root dir by
    // the tests. Additionally, create some HTML, CSS and JS files in
    // that directory
    before(() => {
        helpers.createServerRootDir(SERVER_ROOT_PATH);
    });

    // Remove the temporary web-server root dir
    after(async () => {
        await helpers.removeServerRootDir(SERVER_ROOT_PATH);
    });

    it('illustrates defining multiple routes', async function () {
        const app = express();

        // Use express.static middleware that will serve requested files
        app.use(express.static(SERVER_ROOT_PATH));

        // Define a route for requests to the root (i.e. /)
        app.get("/", (req, res) => {
            res.status(200).end("/");
        });

        // Define a route for requests to /home
        app.get("/home", (req, res) => {
            res.status(200).end("/home");
        });

        // Define a route for requests to /about
        app.get("/about", (req, res) => {
            res.status(200).end("/about");
        });

        // If express.static didn't find a file at the request URL and none of
        // the defined routes were requested, fail with 404 Not Found
        app.use((req, res) => {
            res.writeHead(404, "Not Found").end();
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Pick one file from the server's root directory. This file will be
        // served by express.static middleware
        const urlsToGet = [];
        const serverDir = fs.opendirSync(SERVER_ROOT_PATH);
        for await (const dirEntry of serverDir) {
            if (dirEntry.isFile()) {
                urlsToGet.push("/" + dirEntry.name);
                break;
            }
        }

        // The next three URLs to request will be the server root (i.e. /), /home
        // and /about all of which should be handled by the defined routes
        urlsToGet.push("/");
        urlsToGet.push("/home");
        urlsToGet.push("/about");

        // Finally, an unknown URL is requested that should result in 404
        urlsToGet.push("/" + Date.now());

        // Send requests
        for (let i = 0; i < urlsToGet.length; ++i) {
            http.request({
                    hostname: "localhost",
                    port: httpServer.address().port,
                    path: urlsToGet[i],
                    method: "GET"
                },
                res => {
                    if (i < urlsToGet.length - 1) {
                        // Each of the requests except the last one should be
                        // successful
                        assert.equal(res.statusCode, 200);
                    }
                    else {
                        // The last request should be rejected with 404
                        assert.equal(res.statusCode, 404);
                        assert.deepEqual(res.statusMessage, "Not Found");
                    }

                    // Set encoding used to encode received data to strings
                    res.setEncoding("utf8");

                    // Attach listener for `data` event
                    let receivedData = "";
                    res.on("data", chunk => {
                        receivedData += chunk;
                    });

                    // Attach listener for `end` event
                    res.once("end", () => {
                        if (i === 0) {
                            // Compare the body with the actual data in the file
                            assert.deepEqual(
                                receivedData,
                                fs.readFileSync(path.join(SERVER_ROOT_PATH, urlsToGet[i]), "utf8"));
                        }
                        else if (i < urlsToGet.length - 1) {
                            // For requests handled by the routes, the server sends
                            // the requested URL back to the client
                            assert.deepEqual(receivedData, urlsToGet[i]);
                        }

                        // Close the server if this is the last response
                        if (i === urlsToGet.length - 1) {
                            httpServer.close();
                        }
                    });
                })
                .end();
        }

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrating using route parameters to extract data from routes', async function () {
        const app = express();

        app.get("/users/:userid", (req, res) => {
            // Send the user ID back to the client
            res.writeHead(200, "OK").end(req.params.userid);
        });

        app.use((req, res) => {
            res.writeHead(404, "Not Found").end();
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Send two requests. The first one is to `/users/mickey.mouse` URL
        // and the second is to `/users/abc/mickey.mouse` URL. The second
        // one is rejected with 404
        const urlsToGet = ["/users/mickey.mouse", "/users/abc/mickey.mouse"];
        for (let i = 0; i < urlsToGet.length; ++i) {
            http.request({
                    hostname: "localhost",
                    port: httpServer.address().port,
                    path: urlsToGet[i],
                    method: "GET"
                },
                res => {
                    if (i === 0) {
                        assert.equal(res.statusCode, 200);
                    }
                    else {
                        // The last request should be rejected with 404
                        assert.equal(res.statusCode, 404);
                        assert.deepEqual(res.statusMessage, "Not Found");
                    }

                    // Set encoding used to encode received data to strings
                    res.setEncoding("utf8");

                    // Attach listener for `data` event
                    let receivedData = "";
                    res.on("data", chunk => {
                        receivedData += chunk;
                    });

                    // Attach listener for `end` event
                    res.once("end", () => {
                        if (i === 0) {
                            assert.deepEqual(receivedData, "mickey.mouse");
                        }

                        // Close the server if this is the last response
                        if (i === urlsToGet.length - 1) {
                            httpServer.close();
                        }
                    });
                })
                .end();
        }

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrates using regular expressions to match routes', async function () {
        const app = express();

        // The following regex matches an URL that starts with /users/ followed
        // by a numeric range such as 0-100. Both lower and upper boundary of the
        // range are captured
        app.get(/^\/users\/(\d+)-(\d+)$/, (req, res) => {
            // Send the range back to the client
            res.send(req.params[0] + "-" + req.params[1]);
        });

        // Define a 404 middleware
        app.use((req, res) => {
            res.sendStatus(404);
        });

        const httpServer = await helpers.startHttpServer(app);

        // URLs to get along with the expected response status code and response data
        // (in case status code is 200)
        const testVectors = [
            {
                url: "/users/0-150",
                statusCode: 200,
                responseData: "0-150"
            },
            {
                url: "/users/abc-345",
                statusCode: 404
            },
            {
                url: "/user/0-1",
                statusCode: 404
            },
            {
                url: "/users/100-90",
                statusCode: 200,
                responseData: "100-90"
            }
        ];

        for (let i = 0; i < testVectors.length; ++i) {
            http.request({
                    hostname: "localhost",
                    port: httpServer.address().port,
                    path: testVectors[i].url,
                    method: "GET"
                },
                res => {
                    // Verify the response status code
                    assert.equal(res.statusCode, testVectors[i].statusCode);

                    // Set encoding used to encode received data to strings
                    res.setEncoding("utf8");

                    // Attach listener for `data` event
                    let receivedData = "";
                    res.on("data", chunk => {
                        receivedData += chunk;
                    });

                    // Attach listener for `end` event
                    res.once("end", () => {
                        if (testVectors[i].statusCode === 200) {
                            // Verify the response data
                            assert.deepEqual(receivedData, testVectors[i].responseData);
                        }

                        // Close the server if this is the last response
                        if (i === testVectors.length - 1) {
                            httpServer.close();
                        }
                    });
                })
                .end();
        }

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrates grabbing URL query arguments from routes', async function () {
        const app = express();

        // Define a route for /search URL. Note that this will also match the
        // URLs with queries such as /search?q=value
        app.get("/search", (req, res) => {
            // Send the query `q` argument value back to the client
            res.send(req.query.q);
        });

        const httpServer = await helpers.startHttpServer(app);

        http.request({
                hostname: "localhost",
                port: httpServer.address().port,
                path: "/search?q=abcDEF",
                method: "GET"
            },
            res => {
                // Verify the response status code
                assert.equal(res.statusCode, 200);

                // Set encoding used to encode received data to strings
                res.setEncoding("utf8");

                // Attach listener for `data` event
                let receivedData = "";
                res.on("data", chunk => {
                    receivedData += chunk;
                });

                // Attach listener for `end` event
                res.once("end", () => {
                    assert.deepEqual(receivedData, "abcDEF");

                    // Close the server
                    httpServer.close();
                });
            })
            .end();

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrates using Routers', async function () {
        const app = express();

        // Define a middleware that will reject the request with 404 status
        // code if request URL is /notfound
        app.use((req, res, next) => {
            if (req.url === "/notfound") {
                res.sendStatus(404);
            }
            else {
                // Otherwise proceed to the next middleware or route
                next();
            }
        });

        // Register `router1` as a middleware for the `/router1` route. This
        // means that router1 will be used for any route that starts with
        // `router1` (i.e. /router1, /router1/some-path etc)
        app.use("/router1", router1());

        // Start the HTTP server
        const httpServer = await helpers.startHttpServer(app);

        // URLs to request along with the expected response status code and
        // response data in case the status code is 200
        const testVectors = [
            // Handled by the main app
            {
                url: "/notfound",
                statusCode: 404
            },

            // Handled by router1
            {
                url: "/router1/user/100",
                statusCode: 200,
                responseData: "100"
            },

            // Handled by router1
            {
                url: "/router1/error",
                statusCode: 500
            },

            // Handled by router1
            {
                url: "/router1/user/71",
                statusCode: 200,
                responseData: "71"
            }
        ];

        for (let i = 0; i < testVectors.length; ++i) {
            http.request({
                    hostname: "localhost",
                    port: httpServer.address().port,
                    path: testVectors[i].url,
                    method: "GET"
                },
                res => {
                    // Verify the response status code
                    assert.equal(res.statusCode, testVectors[i].statusCode);

                    // Set encoding used to encode received data to strings
                    res.setEncoding("utf8");

                    // Attach listener for `data` event
                    let receivedData = "";
                    res.on("data", chunk => {
                        receivedData += chunk;
                    });

                    // Attach listener for `end` event
                    res.once("end", () => {
                        if (testVectors[i].statusCode === 200) {
                            // Verify the response data
                            assert.deepEqual(receivedData, testVectors[i].responseData);
                        }

                        // Close the server if this is the last response
                        if (i === testVectors.length - 1) {
                            httpServer.close();
                        }
                    });
                })
                .end();
        }

        // Wait for the server to close
        await once(httpServer, "close");
    });
});