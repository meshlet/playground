/**
 * Illustrates the HTTP client and server NodeJS functionality provided
 * by the http module. This module implements the HTTP/1.1 protocol.
 */
const http = require("http");
const assert = require("assert").strict;
const { once } = require("events");

describe("HTTP", function () {
    it('illustrates HTTP communication sequence using GET method', async function () {
        // Create a HTTP server instance and pass it function that is
        // attached to the `request` event which is emitted for each
        // request received by the server
        const httpServer = http.createServer(((req, res) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");

            // Several chunks that will be sent in the body of the response
            const chunks = [
                "ABC",
                "0923",
                "1ODF",
                "TREF"
            ];

            // Send a chunk every 10 milliseconds
            (function writeResponseChunks() {
                setTimeout(() => {
                    res.write(chunks.shift(), "utf8");

                    if (chunks.length > 0) {
                        writeResponseChunks();
                    }
                    else {
                        res.end();
                    }
                }, 10);
            })();
        }));

        // Wait for the HTTP server to start listening on an arbitrary port
        const port = await new Promise(resolve => {
            httpServer.listen(0, "localhost", () => {
                resolve(httpServer.address().port);
            });
        });

        const options = {
            hostname: "localhost",
            port: port,
            path: "/",
            method: "GET"
        };

        // Create a HTTP request that is sent to previously started server
        const req = http.request(options, res => {
            // We expect the response to have 200 OK status
            assert.equal(res.statusCode, 200);

            // Set encoding used to decode binary data read from the response
            // into strings
            res.setEncoding("utf8");

            // Attach a listener for the `data` event that is emitted for each
            // chunk of data sent for this response
            const responseData = [];
            res.on("data", chunk => {
                responseData.push(chunk);
            });

            // Attach a listener for the `end` event that is emitted once response
            // has no data left be read
            res.once("end", () => {
                // Make sure that the response has been fully received. This might not
                // be the case if connection terminates before entire response is
                // delivered
                assert.ok(res.complete);

                // Verify the received data
                assert.deepEqual(responseData, ["ABC", "0923", "1ODF", "TREF"]);

                // Close the server to allow process to terminate
                httpServer.close();
            });
        });

        // End the request which flushes the internal socket buffer and
        // sends the remaining data to server
        req.end();

        // Wait for the server to be closed
        await once(httpServer, "close");
    });

    it('illustrates HTTP communication sequence using POST method', async function () {
        // Create a HTTP server instance
        const httpServer = http.createServer(((req, res) => {
            // Set the status code and content-type for the response
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");

            // Set encoding that is used to encode Buffers to strings when
            // body data is read from the request
            req.setEncoding("utf8");

            // Collects chunks of data received in the request's body
            let reqData = "";
            req.on("data", chunk => {
                reqData += chunk;
            });

            req.once("end", () => {
                // Verify data sent by the client
                assert.doesNotThrow(() => {
                    assert.deepEqual(
                        JSON.parse(reqData),
                        {
                            name: "Mickey",
                            surname: "Mouse",
                            age: 31
                        }
                    );
                });

                // Write response data
                res.write(Buffer.from(JSON.stringify({
                    status: "ok"
                }), "utf8"));

                // End the response which flushes any data in the socket's
                // internal buffer which is then sent to the client
                res.end();
            });
        }));

        // Wait for the HTTP server to start listening on an arbitrary port
        const port = await new Promise(resolve => {
            httpServer.listen(0, "localhost", () => {
                resolve(httpServer.address().port);
            });
        });

        // JSON string that represents an object sent as part of the
        // HTTP POST request
        const personJson = JSON.stringify({
            name: "Mickey",
            surname: "Mouse",
            age: 31
        });

        // Setup options used to create a HTTP request
        const options = {
            hostname: "localhost",
            port: port,
            path: "/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(personJson)
            }
        };

        // Create the HTTP request
        const req = http.request(options, res => {
            // We expect the response to have 200 OK status
            assert.equal(res.statusCode, 200);

            // Set encoding to be used when reading the response
            // data
            res.setEncoding("utf8");

            // Attach a listener for the `data` event
            let resData = "";
            res.on("data", chunk => {
                resData += chunk;
            });

            // Attach a listener for the `end` event that is emitted
            // when there's no more data left to read from the response
            res.once("end", () => {
                assert.doesNotThrow(() => {
                    assert.deepEqual(
                        JSON.parse(resData),
                        {
                            status: "ok"
                        }
                    );
                });

                // Close the server to allow process to exit
                httpServer.close();
            });
        });

        // Write data to be sent to the server in the body of the
        // POST request and end the request (causes all data in the
        // socket's internal buffer to be flushed to the server)
        req.write(personJson, "utf8");
        req.end();

        // Wait for the server to emit the `close` event
        await once(httpServer, "close");
    });
});