/**
 * A script run by a worker thread. The worker communicates
 * with the main thread via the side channel. The side-channel
 * port is passed to the worker using the parentPort
 */
const { parentPort, isMainThread, workerData } = require("worker_threads");

// Prevent mocha from running this script
if (!isMainThread) {
    // Attach a listener for the `message` event on the parent
    // port. The side-channel port is sent through the parent
    // port.
    parentPort.once("message", value => {
        // Get the port
        const port = value.workerPort;

        // Asynchronously send some message to the parent thread.
        // The `workerData` references the array of message that
        // should be sent
        (function sendMessage() {
            setTimeout(() => {
                port.postMessage(workerData.shift());

                if (workerData.length > 0) {
                    sendMessage();
                }
            }, 5);
        })();
    });
}