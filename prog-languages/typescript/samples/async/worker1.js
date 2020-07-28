/**
 * This is just a JS wrapper for the worker1.ts script. It's needed
 * because NodeJS doesn't allow workers with .ts extension.
 */

const path = require('path');
const { isMainThread } = require("worker_threads");

if (!isMainThread) {
    require('ts-node').register();
    require(path.resolve(__dirname, './worker1.ts'));
}