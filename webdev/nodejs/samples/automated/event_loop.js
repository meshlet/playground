/**
 * Illustrates the NodeJS specific details of the event-loop.
 * For samples that provide overall event-loop illustration
 * check prog-languages/javascript/samples/events.js.
 */
const assert = require("assert").strict;

describe("NodeJS Event Loop", function () {
    it('illustrates the process.nextTick method', function () {
        let actionLog = [];

        // The code is wrapped in a promise that will be returned
        // to Mocha framework to make it wait for asynchronous
        // work to complete
        let promise = new Promise(resolve => {
            // Create a timeout that fires in 50 ms
            setTimeout(() => {
                actionLog.push("timeout");

                // The order of executed operations is as follows:
                // 1. Synchronous code is executed first
                // 2. Once sync code is completed the current tick ends,
                //    at which point the nextTick callback is executed
                // 3. After that, all the resolved promises (microtasks)
                //    are handled (that is, their onFulfilled or onRejected
                //    callbacks are executed). They are handled in the order
                //    they were resolved.
                //    Note that executing callback promises for all resolved
                //    promises is considered to be a single event-loop tick.
                // 4. All the callbacks in the next tick queue are executed
                // 5. The timeout callback is executed which marks the start
                //    of the next event-loop iteration
                assert.deepEqual(actionLog, [
                    "sync code",
                    "next tick 0",
                    "resolved promise 1",
                    "resolved promise 2",
                    "resolved promise 3",
                    "next tick 1",
                    "next tick 2",
                    "next tick 3",
                    "timeout"
                ]);

                // Resolve the promise returned to Mocha framework
                resolve();
            }, 50);
        });

        // Adds a callback to the next tick queue. Will be executed right
        // after the sync part of this function is completed
        process.nextTick(() => {
            actionLog.push("next tick 0");
        });

        // Create 3 immediately resolved promises
        for (let i = 0; i < 3; ++i) {
            Promise.resolve()
                .then(() => {
                    actionLog.push(`resolved promise ${i + 1}`);

                    // Adds a callback to the next tick queue
                    process.nextTick(() => {
                        actionLog.push(`next tick ${i + 1}`);
                    });
                });
        }

        // Some code that executes synchronously
        (() => {
            actionLog.push("sync code");
        })();

        // Return the promise back to Mocha framework to make it wait
        // for the async work to complete
        return promise;
    });

    /**
     * It is undefined whether setTimeout(0ms) or setImmediate() will
     * execute first. The tests show that sometimes setImmediate runs
     * first while sometimes setTimeout(0ms) runs first
     */
    it('illustrates the setImmediate timer', function () {
        let actionLog = [];

        // An array of promises that is merged with Promise.all and returned
        // to Mocha to make it wait for the async work to complete
        let promises = [];

        promises.push(new Promise(resolve => {
            // Create 3 immediate timers. All 3 callbacks are executed in the
            // event-loop iteration right after the one in which the test function
            // sync code executes
            let counter = 0;

            for (let i = 0; i < 3; ++i) {
                setImmediate(() => {
                    actionLog.push(`immediate ${i}`);

                    // Create an immediately resolved promise. The promise callback
                    // is executed right after the matching immediate callback
                    Promise.resolve()
                        .then(() => {
                            actionLog.push(`immediate ${i} promise`);

                            // Resolve the promise returned to the Mocha framework
                            // once all 3 immediate callbacks have been executed
                            if (++counter === 3) {
                                resolve();
                            }
                        });
                });
            }
        }));

        // Create a resolved promise. Its callback will be executed right after
        // the sync code of the test function completes
        promises.push(Promise.resolve().then(() => {
            actionLog.push("resolved promise");
        }));

        // Execute some synchronous code
        (() => {
            actionLog.push("sync code");
        })();

        // Create a timeout used to monitor the execution order of various
        // actions in this test
        promises.push(new Promise(resolve => {
            setTimeout(() => {
                // The execution order will be:
                // 1. Sync code in the test function is executed first
                // 2. All the promises in the queue of resolved promises
                //    are handled next (in this case a single promise)
                // 3. The first immediate callback is executed
                // 4. All the resolve promises (one in this case) are
                //    executed
                // 5. The second immediate callback is executed
                // 6. All the resolve promises (one in this case) are
                //    executed
                // 7. The third immediate callback is executed
                // 8. All the resolve promises (one in this case) are
                //    executed
                assert.deepEqual(actionLog, [
                    "sync code",
                    "resolved promise",
                    "immediate 0",
                    "immediate 0 promise",
                    "immediate 1",
                    "immediate 1 promise",
                    "immediate 2",
                    "immediate 2 promise"
                ]);

                resolve();
            }, 10);
        }));

        // Return an aggregated promise to the Mocha framework
        return Promise.all(promises);
    });
});