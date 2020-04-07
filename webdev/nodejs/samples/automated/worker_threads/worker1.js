/**
 * A script run by a worker thread. The worker communicates
 * with the main thread via the global channel.
 */
const { parentPort, workerData, isMainThread } = require("worker_threads");
const assert = require("assert").strict;

// This is needed only because Mocha runs this as a regular script. That
// will fail because the script is expected to run by a worker thread.
// It would be better to exclude the worker scripts from Mocha testing
if (!isMainThread)
{
    // Save the number of messages to be sent by the worker. Once
    // a response is received for each of these messages the
    // communication is terminated
    const messageCount = workerData.messagesSentByWorker.length;

    // Attach a listener for the `message` event on the parentPort.
    // This event is emitted whenever the parent posts a message to
    // the worker thread
    const receivedData = [];
    parentPort.on("message", value => {
        receivedData.push(value);

        if (receivedData.length === messageCount) {
            // If a response has been received for every message sent
            // by the worker close the port
            parentPort.close();
        }
    });

    // Attach a listener for the `close` event on the parentPort.
    // Emitted once either side of the communication channel has
    // been closed (and emitted on both ports)
    parentPort.once("close", () => {
        assert.deepEqual(receivedData, workerData.responsesSentByServer);
    });

    // Asynchronously post data to the parent thread. The array of
    // message to be sent has been passed to the worker thread via
    // `workerData.dataSentByParent`
    (function sendData() {
        setTimeout(() => {
            // Post message to the parent thread
            parentPort.postMessage(workerData.messagesSentByWorker.shift());

            if (workerData.messagesSentByWorker.length > 0) {
                // Schedule the next post operation
                sendData();
            }
        }, 10);
    })();
}