/**
 * Illustrates various utility features offered by the Express framework.
 */
const express = require("express");
const http = require("http");
const assert = require("assert").strict;
const { once } = require("events");
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

describe("Express Util", function () {
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

    it('illustrates the `Response.redirect` method', async function () {
        const app = express();

        // Define the route that will redirect the client from
        // /doc1 to /doc2 URL at the same server
        app.get("/doc1", (req, res) => {
            // 307 status code is temporary redirect, similar to 302
            // but safer to use on sites that use non-GET HTTP methods
            res.redirect(307, "/doc2");
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Send request to /doc1 URL
        http.request({
                hostname: "localhost",
                port: httpServer.address().port,
                path: "/doc1",
                method: "GET"
            },
            res => {
                // Response should have 307 (temporary redirect) status code
                assert.equal(res.statusCode, 307);

                // The `Location` response header must be set to /doc2
                assert.deepEqual(res.headers["location"], "/doc2");

                // We don't care about the body so resume the stream to make
                // it read and throw away all the data
                res.resume();

                // Attach listener for `end` event
                res.once("end", () => {
                    httpServer.close();
                });
            })
            .end();

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrates the `Response.send` method', async function () {
        const app = express();

        // An object that server sends to the client in response body
        const objToSend = {
            name: "Mickey",
            surname: "Mouse",
            age: 31
        };

        // Define middleware that sends an HTTP response using the
        // Express `send` method
        app.use((req, res) => {
            res.status(200).send(objToSend);
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Send a request
        http.request({
                hostname: "localhost",
                port: httpServer.address().port,
                path: "/",
                method: "GET"
            },
            res => {
                // Response should have 200 status code
                assert.equal(res.statusCode, 200);

                // Convert to object sent by the server to a JSON string
                const sentObjAsString = JSON.stringify(objToSend);

                // Assert that Content-Length header was correctly set by
                // the server
                assert.equal(
                    res.headers["content-length"],
                    Buffer.byteLength(sentObjAsString, "utf8").toString());

                // Assert that the Content-Type header contains application/json
                assert.ok(res.headers["content-type"].includes("application/json"));

                // Assert that ETag header exists
                assert.ok(res.headers["etag"] != null && res.headers["etag"] != "");

                // The `Location` response header must be set to /doc2
                // assert.deepEqual(res.headers["location"], "/doc2");

                // Set encoding used to encode received data to strings
                res.setEncoding("utf8");

                // Attach listener for `data` event
                let receivedJson = "";
                res.on("data", chunk => {
                    receivedJson += chunk;
                });

                // Attach listener for `end` event
                res.once("end", () => {
                    // Compare received with the expected JSON
                    assert.deepEqual(receivedJson, sentObjAsString);

                    // Close the server
                    httpServer.close();
                });
            })
            .end();

        // Wait for the server to close
        await once(httpServer, "close");
    });

    it('illustrates the `Response.sendFile` method', async function () {
        const app = express();

        // Define a route that will serve the files from the server's root
        // directory
        app.get("/:file", (req, res) => {
            res.sendFile(
                req.params.file,
                {
                    root: SERVER_ROOT_PATH,
                    maxAge: 3600000 // Resource will be valid for 1 hour
                },
                (err) => {
                    if (err) {
                        // Fail with 404 error
                        res.sendStatus(404);
                    }
                    else {
                        // End the request
                        res.end();
                    }
                });
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Pick one file to request from the server's root directory
        const urlsToGet = [];
        const serverDir = fs.opendirSync(SERVER_ROOT_PATH);
        for await (const dirEntry of serverDir) {
            if (dirEntry.isFile()) {
                urlsToGet.push("/" + dirEntry.name);
                break;
            }
        }

        // Also request an unknown URL is requested that should result in 404
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
                    if (i === 0) {
                        assert.equal(res.statusCode, 200);
                        assert.deepEqual(res.statusMessage, "OK");
                    }
                    else {
                        // The second request must be rejected
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