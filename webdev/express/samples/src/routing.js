/**
 * Illustrates the routing feature of the Express framework.
 */
const express = require("express");
const http = require("http");
const assert = require("assert").strict;
const { once } = require("events");
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

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
});