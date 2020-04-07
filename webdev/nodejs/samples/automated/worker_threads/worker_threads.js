/**
 * Illustrates the NodeJS worker_threads module that enables using
 * threads to execute JavaScript in parallel.
 */
const assert = require("assert");
const { Worker, isMainThread, MessageChannel } = require("worker_threads");
const { once } = require("events");

describe("Worker Threads", function () {
    it('illustrates using `isMainThread` in main thread', function () {
        // This is run in the main NodeJS thread
        assert.ok(isMainThread);
    });

    it('illustrates using `isMainThread` in worker thread', async function () {
        // Create a worker thread and pass the code that will execute to
        // the constructor
        const worker = new Worker(
            `
            const { parentPort, isMainThread } = require("worker_threads");
            const assert = require("assert").strict;
            
            assert.ok(!isMainThread);
            process.exit();`,

            {
                eval: true
            });

        // Wait for the worker to exit
        await once(worker, "exit");
    });

    it('illustrates parent/child worker communication via global channel', async function () {
        // Messages that worker thread will post to the parent thread
        const messagesSentByWorker = [
            "ABCD",
            "0981",
            "mnds",
            "UIDFD"
        ];

        // Responses sent by the server
        const responsesSentByServer = [
            "9343",
            "try",
            "_looi",
            "nvfd"
        ];

        assert.equal(messagesSentByWorker.length, responsesSentByServer.length);

        // Create a new worker thread. Note that `workerData` is used to pass
        // some data to the worker. Also note that both of the arrays passed
        // to the worker are cloned, so worker will get its own copies
        const worker = new Worker("./samples/automated/worker_threads/worker1.js", {
            workerData: {
                messagesSentByWorker: messagesSentByWorker,
                responsesSentByServer: responsesSentByServer
            }
        });

        // Attach a listener for the `message` event on the worker. This
        // event is emitted each time a worker posts a message to the
        // parent
        const receivedData = [];
        worker.on("message", value => {
            receivedData.push(value);

            // Post response to the worker
            assert.ok(responsesSentByServer.length > 0);
            worker.postMessage(responsesSentByServer.shift());
        });

        // Suspend execution until `exit` event is emitted on the
        // worker. This will happen when the worker closes the port
        // which terminates the communication
        await once(worker, "exit");

        // Verify data received by the worker
        assert.deepEqual(receivedData, messagesSentByWorker);
    });

    it('illustrates `MessageChannel` class', async function () {
        // Create a message channel. Note that the two created ports are
        // automatically connected to each other, hence sending message
        // on one port delivers it to the other
        const { port1, port2 } = new MessageChannel();

        // Attach a listener for `message` event to port1
        const msgReceivedPromise = new Promise(resolve => {
            port1.on("message", value => {
                // Resolve the promise with the received value
                resolve(value);
            });
        });

        // Post a new message using port2
        port2.postMessage("ABCDEFG");

        // Wait for the message to be received by port1 and verify it
        assert.deepEqual(await msgReceivedPromise, "ABCDEFG");

        // Terminate the communication channel
        port1.close();
    });

    it('illustrates parent/child worker communication via side channel', async function () {
        // Array of messages that worker will send back to the parent thread
        const dataSentByWorker = [
            "UUUD",
            "hdfda",
            "vndfd",
            "11235"
        ];

        // Create the worker thread
        const worker = new Worker("./samples/automated/worker_threads/worker2.js", {
            workerData: dataSentByWorker
        });

        // Create a message channel
        const { port1, port2 } = new MessageChannel();

        // Pass the side-channel port to the worker. Note that port is also
        // specified in the `transferList`. This means that port is moved to
        // the worker instead of cloning it. This is important - if port was
        // cloned instead, the port received by the worker would no longer
        // be connected to the port on the parent's side (`port1`) and messages
        // that worker writes to `port2` would be lost
        worker.postMessage({ workerPort: port2 }, [port2]);

        // Attach a listener for the `message` event on `port1`
        const receivedMessages = [];
        port1.on("message", value => {
            receivedMessages.push(value);

            if (receivedMessages.length === dataSentByWorker.length) {
                // Close the connection as worker will send no more messages
                port1.close();
            }
        });

        // Wait for the close event on `port1`
        await once(port1, "close");

        // Verify data sent by the worker
        assert.deepEqual(receivedMessages, dataSentByWorker);
    });

    /**
     * The `postMessage` `transferList` parameter can be used to move certain
     * types of objects between threads, instead of cloning them. Only two types
     * of objects can be moved: MessagePort and ArrayBuffer which is the underlying
     * memory for TypedArray arrays. Note that after moving an object to a different
     * thread, it is no longer usable in the sending thread.
     */
    it('illustrates moving `ArrayBuffer` instances using `transferList`', async function () {
        // Create a worker thread and pass the code to be run by it to
        // the Worker constructor
        const worker = new Worker(
            `
            const { parentPort } = require("worker_threads");
            const assert = require("assert").strict;
            
            // Parent thread moves Uint8Array instance to the worker thread
            parentPort.once("message", uint8Array => {
                assert.ok(uint8Array.length < 256);
                
                // Set each byte of the array to a value starting with 0
                for (let i = 0; i < uint8Array.length; ++i) {
                    uint8Array[i] = i;
                }
                
                // Move the array back to the parent thread
                parentPort.postMessage(uint8Array, [uint8Array.buffer]);
            });
            `,
            {
                eval: true
            });

        // Create an Uint8Array of 5 bytes
        const uint8Array = new Uint8Array([5, 5, 5, 5, 5]);

        // Move the array to the worker thread. Note that the underlying
        // ArrayBuffer is included in the `transferList` array. This makes
        // sure that array is moved instead of cloned, making it unusable
        // in this thread
        worker.postMessage(uint8Array, [uint8Array.buffer]);

        // Wait for the message from the worker
        const [movedUint8Array] = await once(worker, "message");
        assert.deepEqual(movedUint8Array, new Uint8Array([0, 1, 2, 3, 4]));

        // Terminate the worker thread
        await worker.terminate();
    });

    /**
     * Uses MessageChannel to establish direct communication channel between
     * worker threads.
     */
    it('illustrates communication between worker threads', async function () {
        // The array of messages that worker1 sends to the worker2
        const messagesWorker1SendsToWorker2 = [
            "abcd",
            "0342",
            "tyure",
            "123444"
        ];

        // Create the first worker thread. This threads sends several messages
        // to the second worker via the side-channel.
        const worker1 = new Worker(
            `
            const { parentPort, workerData } = require("worker_threads");
            
            // Side-channel port is sent by the parent via parentPort
            parentPort.on("message", port1 => {
                // Asynchronously send message from the array referenced by
                // workerData using port1. This delivers the messages to
                // the worker2
                (function sendMessage() {
                    setTimeout(() => {
                        port1.postMessage(workerData.shift());
                        
                        if (workerData.length > 0) {
                            sendMessage();
                        }
                    }, 5);
                })();
                
                // Attach a listener for the 'close' event of port1
                port1.once("close", () => {
                    // Close the communication channel between worker2 and parent
                    parentPort.close();
                });
            });
            `,
            {
                eval: true,
                workerData: messagesWorker1SendsToWorker2
            });

        // Create the second worker thread. This thread collects the messages
        // sent by the first worker, sends them to the parent thread and closes
        // the side communication channel
        const worker2 = new Worker(
            `
            const { parentPort, workerData } = require("worker_threads");
            
            // Side-channel port is sent by the parent via parentPort
            let port2 = undefined;
            parentPort.on("message", value => {
                port2 = port2 === undefined ? value : port2;

                if (value === "TERMINATE") {
                    // Terminate the side communication channel as well as the
                    // main communication channel between parent and worker2
                    port2.close();
                    parentPort.close();
                }
                else {
                    // Collect the message sent by worker1
                    const messages = [];
                    port2.on("message", value => {
                        messages.push(value);
                        
                        // Once all messages from worker1 have been received, pass
                        // them to the parent thread. 'workerData' references the
                        // array of messages sent by worker1
                        if (messages.length === workerData.length) {
                            parentPort.postMessage(messages);
                        }
                    });
                }
            });
            `,
            {
                eval: true,
                workerData: messagesWorker1SendsToWorker2
            });

        // Create the message channel used to establish direct communication
        // between the worker threads
        const { port1, port2 } = new MessageChannel();

        // Move port1 to worker 1 and port2 to worker2
        worker1.postMessage(port1, [port1]);
        worker2.postMessage(port2, [port2]);

        // Wait for the message from worker2
        const [messages] = await once(worker2, "message");

        // Verify the messages sent by worker1 to worker2
        assert.deepEqual(messages, messagesWorker1SendsToWorker2);

        // Post message to worker2 letting it know it should exit.
        // worker2 will close the side communication channel between
        // the workers and the main communication channel between
        // the parent and worker2 threads. worker1 will close the
        // channel between the parent thread and itself
        worker2.postMessage("TERMINATE");

        // Wait for `exit` events of both workers in parallel
        await Promise.all([
            (async () => { await once(worker1, "exit"); })(),
            (async () => { await once(worker2, "exit"); })()
        ]);
    });

    /**
     * Passing objects using the `postMessage` method commonly results in
     * their cloning using the Structured Cloning algorithm. Some object
     * types (MessagePort and ArrayBuffer) can be moved from one thread
     * to another, but that renders them unusable in the sending thread.
     *
     * SharedArrayBuffer can be used to make the same block of memory
     * accessible to multiple threads. Note that each thread will gets
     * its own SharedArrayBuffer object, but they will all be mapped to
     * the same memory block.
     *
     * To make writes to the SharedArrayBuffer in one thread visible in
     * other threads, atomic operations must be used. The Atomics class
     * serves this purpose.
     */
    it('illustrates sharing memory with `SharedArrayBuffer` and `Atomics`', async function () {
        // Create the worker thread that atomically writes the first
        // half ot the SharedArrayBuffer and atomically reads the
        // second part to verify that the writes done in the parent
        // thread are visible
        const worker = new Worker(
            `
            const { parentPort } = require("worker_threads");
            const assert = require("assert").strict;
            
            // Attach a listener for the 'message' event. Shared array buffer
            // is passed via this event
            let sharedBuf = undefined;
            parentPort.on("message", value => {
                // The first message contains the shared buffer instance. The
                // second message instructs the worker thread to validate the
                // second part of the buffer written by the parent thread
                sharedBuf = sharedBuf === undefined ? value : sharedBuf;
                
                // Wrap the shared buffer in a Uint8Array
                assert.ok(sharedBuf.byteLength < 256);
                const uint8Array = new Uint8Array(sharedBuf);
                
                if (value === "PARENT_DONE_WRITING") {
                    // Parent thread has finished writing the second part of the
                    // array. Verify the data written
                    for (let i = uint8Array.length / 2; i < uint8Array.length; ++i) {
                        assert.equal(Atomics.load(uint8Array, i), i);
                    }
                    
                    // Close the parent port
                    parentPort.close();
                }
                else {
                    // Atomically write the first half of the bytes in the array
                    for (let i = 0; i < uint8Array.length / 2; ++i) {
                        Atomics.store(uint8Array, i, i);
                    }
                    
                    // Inform the parent thread that worker is done writing
                    parentPort.postMessage("WORKER_DONE_WRITING");
                }
            });
            `,
            {
                eval: true
            });

        // Allocate shared array buffer with length of 20 bytes
        const sharedBuf = new SharedArrayBuffer(20);

        // Pass the shared array buffer to the worker. Note that while parent's
        // and worker's shared array buffer are different objects, they are
        // both mapped to the same memory block
        worker.postMessage(sharedBuf);

        // Attach a listener for the `message` event
        worker.once("message", value => {
            assert.deepEqual(value, "WORKER_DONE_WRITING");

            // Wrap the shared buffer in a Uint8Array object
            const uint8Array = new Uint8Array(sharedBuf);

            // Verify that the writes performed by the worker thread are
            // visible in the parent thread
            for (let i = 0; i < uint8Array.length / 2; ++i) {
                assert.equal(Atomics.load(uint8Array, i), i);
            }

            // Atomically write the second part of the array
            for (let i = uint8Array.length / 2; i < uint8Array.length; ++i) {
                Atomics.store(uint8Array, i, i);
            }

            // Inform the worker thread that parent has finished writing
            worker.postMessage("PARENT_DONE_WRITING");
        });

        // Wait for worker to exit
        await once(worker, "exit");
    });

    it.skip('illustrates running worker from another worker thread', function () {
        // Implement this test
    });
});