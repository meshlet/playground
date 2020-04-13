/**
 * Illustrates different template engines (e.g. EJS, Pug/Jade) used
 * to dynamically build HTML on server side.
 */
const express = require("express");
const http = require("http");
const assert = require("assert").strict;
const { once } = require("events");
const path = require("path");
const helpers = require("../helpers");

describe("Template Engines", function () {
    it('illustrates basic EJS usage', async function () {
        const app = express();

        // Inform Express that views are contained in the current directory
        // and that it should use EJS as the templating engine
        app.set("views", path.join(__dirname, "ejs_views"));
        app.set("view engine", "ejs");

        // Define a route that will handle /view URLs
        const injectedString = "ABCDEFGHI";
        app.get("/:view", (req, res) => {
            // NOTE: a real-world application should not pass unvalidated user
            // input as the name of the view like this. This could be a security
            // issue as the user input might contain malicious data that could
            // in theory make server send a secret data file back to the client
            res.render(
                req.params.view,
                {
                    message: injectedString
                },
                (err, html) => {
                    // When callback is provided to the `render` method, the method
                    // won't automatically send the HTML string. The user has to do
                    // this manually from the callback
                    if (err) {
                        // Report an error
                        res.sendStatus(404);
                    }
                    else {
                        // Send the generated HTML string
                        res.status(200).send(html);
                    }
                });
        });

        // Start the server
        const httpServer = await helpers.startHttpServer(app);

        // Views to request. The first one exists on the server, the second
        // one doesn't
        const urlsToGet = [
            "/simple",
            "/" + Date.now()
        ];

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
                            // The generated HTML string must contain the string injected
                            // by the server
                            assert.ok(receivedData.includes(injectedString));
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