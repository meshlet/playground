/**
 * Helpers used by various samples.
 */

/**
 * Module exports.
 */
module.exports = {
    generateSeverRootPath: generateSeverRootPath,
    createServerRootDir: createServerRootDir,
    removeServerRootDir: removeServerRootDir,
    startHttpServer: startHttpServer
};

/**
 * Module dependencies.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

/**
 * Generate temporary web-server root directory pathname.
 */
function generateSeverRootPath() {
    return path.resolve(__dirname, performance.now() + "_public");
}

/**
 * Creates a temporary web-server root directory and writes a
 * HTML, CSS and JS file to it.
 */
function createServerRootDir(serverDirPath) {
    fs.mkdirSync(serverDirPath);

    // Create an HTML file
    fs.writeFileSync(
        path.resolve(serverDirPath, "test.html"),
        "<html><head></head><body></body></html>");

    // Create a CSS file
    fs.writeFileSync(
        path.resolve(serverDirPath, "test.css"),
        "body { background-color: aqua; }");

    // Create a JS file
    fs.writeFileSync(
        path.resolve(serverDirPath, "test.js"),
        "function fn(a, b) { return a + b; }");
}

async function removeServerRootDir(serverDirPath) {
    // Open the temporary web-server directory
    const dir = fs.opendirSync(serverDirPath);

    // Remove each file in the temporary directory
    for await (const dirEntry of dir) {
        fs.unlinkSync(path.resolve(serverDirPath, dirEntry.name));
    }

    // Remote the temporary web-server dir
    fs.rmdirSync(serverDirPath);
}

/**
 * Helper that creates an HTTP server and makes it listen on a given port at
 * localhost and returns promise that is resolved with the server once the
 * "listening" event is emitted
 */
function startHttpServer(expressApp, port = 0) {
    return new Promise(resolve => {
        const server = http.createServer(expressApp)
            .listen(port, "localhost", () => {
                resolve(server);
            });
    });
}