/**
 * Illustrates the NodeJS specific event-loop and event details.
 * For samples that delve into general JavaScript events and
 * event-loop functionality check
 * prog-languages/javascript/samples/events.js.
 */
const assert = require("assert").strict;
const { on, once, EventEmitter } = require("events");

describe("NodeJS Events", function () {
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

    it('illustrates creating event emitter', function () {
        const actionLog = [];

        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Create an instance of the CustomEmitter and attach two
        // callbacks to the same event
        const emitter = new CustomEmitter();
        emitter.on("customEvent", () => {
            actionLog.push("callback 1")
        });

        emitter.on("customEvent", () => {
            actionLog.push("callback 2");
        });

        // Fire the `customEvent` event. All the registered callbacks
        // are executed synchronously, in order they were registered
        emitter.emit("customEvent");

        assert.deepEqual(actionLog, ["callback 1", "callback 2"]);
    });

    it('illustrates passing arguments to callbacks', function () {
        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Create an emitter and attach an event to it
        const emitter = new CustomEmitter();
        emitter.on("customEvent", (name, surname, age) => {
            assert.deepEqual([name, surname, age], ["Mickey", "Mouse", 38]);
        });

        // Fire the event
        emitter.emit("customEvent", "Mickey", "Mouse", 38);
    });

    it('illustrates event callbacks and `this`', function () {
        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Allocate an emitter instance
        const emitter = new CustomEmitter();

        // Attach a callback. Note that callback is a function
        // expression, hence function context can be forced using
        // Function.prototype.call/apply
        emitter.on("event", function() {
            // `this` references the object on which the callback
            // was registered i.e. the emitter object
            assert.equal(this, emitter);
        });

        // Attach another callback for the same event. Note, however,
        // that this callback is an arrow function hence it doesn't
        // have an implicit `this` parameter. `this` is therefore
        // captured in its closure and will reference the same object
        // reference by the `this` parameter of the test function
        const testFunThisArg = this;
        emitter.on("event", () => {
            // `this` is captured in this callback's closure and
            // references the same object as the test function's
            // `this` parameter
            assert.equal(this, testFunThisArg);
        });

        // Fire events
        emitter.emit("event");
    });

    it('illustrates one-time event callbacks', function () {
        let counter = 0;

        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Allocate an emitter instance
        const emitter = new CustomEmitter();

        // Register a callback that should be fired only once
        // and then unregistered
        emitter.once("event", () => {
            ++counter;
        });

        // Fire the event twice
        emitter.emit("event");
        emitter.emit("event");

        // The event callback has been executed only once
        assert.equal(counter, 1);
    });

    it('illustrates error events', function () {
        const actionLog = [];

        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Allocate an emitter instance
        const emitter = new CustomEmitter();

        // Emitter has no error callback registered. Firing
        // error event hence cause an exception to be thrown
        assert.throws(() => {
            emitter.emit("error");
        },
        {
            name: "Error"
        });

        // Register the callback for the errorMonitor event. The error callback
        // will now be executed however the emitted error is not consumed and
        // will still cause the error to be thrown
        emitter.on(EventEmitter.errorMonitor, err => {
            actionLog.push(err);
        });

        // Exception is thrown
        assert.throws(() => {
            emitter.emit("error", "An Error");
        },
        {
            name: "Error"
        });

        // Clear the emitter listeners
        emitter.removeAllListeners(EventEmitter.errorMonitor);

        // Register a callback for the "error" event. The exception will
        // no longer be thrown when "error" event is fired
        emitter.on("error", err => {
            actionLog.push(err);
        });

        // No exception is thrown
        assert.doesNotThrow(() => {
            emitter.emit("error", "Another Error");
        });

        // Assert that all operations were executed in expected order
        assert.deepEqual(actionLog, ["An Error", "Another Error"]);
    });

    it('illustrates registering callbacks for both errorMonitor and `error', function () {
        const actionLog = [];

        // Create a custom event emitter
        class CustomEmitter extends EventEmitter {}

        // Allocate an emitter instance
        const emitter = new CustomEmitter();

        // Register the callback for the `error` event
        emitter.on("error", () => {
            actionLog.push("error");
        });

        // Register the callback for the EventEmitter.errorMonitor event
        emitter.on(EventEmitter.errorMonitor, () => {
            actionLog.push("errorMonitor");
        });

        // Fire the `error` event. Note that even though listener for
        // the `error` event has been registered before the listener
        // for the `errorMonitor`, the `errorMonitor` listener will
        // be executed first.
        emitter.emit("error");
        assert.deepEqual(actionLog, ["errorMonitor", "error"]);
    });

    it('illustrates the newListener event', function () {
        const actionLog = [];

        // Create an emitter
        const emitter = new EventEmitter();

        // Register the callback for emitter's `newListener` callback.
        // This callback is invoked when a new callback is registered
        // on this emitter, but BEFORE the callback that is currently
        // being registered is added to the callback list. Because of
        // this, any callbacks registered within the `newListener`
        // callback will appear before the callback that is currently
        // being added.
        // Note that `newListener` callback will be run only once
        // when the very first listener is registered. This is to
        // prevent an infinite loop that would otherwise occur because
        // the`newListener` callback itself registers a listener.
        emitter.once("newListener", () => {
            // Register a listener for `event`
            emitter.on("event", () => {
                actionLog.push("callback B");
            });
        });

        // Register a callback for the `event`
        emitter.on("event", () => {
            actionLog.push("callback A");
        });

        // Fire the event
        emitter.emit("event");

        // Callback B must've executed first followed by the callback A as
        // explained
        assert.deepEqual(actionLog, ["callback B", "callback A"]);
    });

    it('illustrates the removeListener event', function () {
        const actionLog = [];

        function eventListener() {
            actionLog.push("eventListener");
        }

        // Create an emitter
        const emitter = new EventEmitter();

        // Register a `removeListener` event listener
        emitter.on("removeListener", () => {
            actionLog.push("removeListener");

            // Fire the event whose listener was just removed. As
            // the listener has been remove prior to the execution
            // of the `removeListener` callback, this firing should
            // not execute event callback
            emitter.emit("event");
        });

        // Register a listener for the `event`
        emitter.on("event", eventListener);

        // Fire the `event`
        emitter.emit("event");

        // Remove the listener
        emitter.removeListener("event", eventListener);

        // Fire the `event` again
        emitter.emit("event");

        // The event listener should've been executed once followed
        // by the remove listener
        assert.deepEqual(actionLog, ["eventListener", "removeListener"]);
    });

    it('illustrates obtaining names of events with registered listeners', function () {
        const emitter = new EventEmitter();

        // Register listeners for couple of events
        emitter.on("event2", () => {});
        emitter.on("event0", () => {});
        emitter.on("event1", () => {});

        // `EventEmitter.eventNames` returns event names in the order
        // listeners were registered for them, i.e. the event for which
        // a listener was registered first will be first in the array
        // and so on
        assert.deepEqual(emitter.eventNames(), ["event2", "event0", "event1"]);
    });

    it('illustrates pre-pending event listener', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        // Register several listeners for the `event`
        emitter.on("event", () => {
            actionLog.push("listener 1");
        });
        emitter.prependListener("event", () => {
            actionLog.push("listener 2");
        });
        emitter.on("event", () => {
            actionLog.push("listener 3");
        });

        // The listeners must be executed in: listener 2 -> 1 -> 3
        // order
        emitter.emit("event");
        assert.deepEqual(actionLog, ["listener 2", "listener 1", "listener 3"]);
    });

    it('illustrates pre-pending one-time event listener', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        // Register two listeners for the `event`
        emitter
            .on("event", () => {
                actionLog.push("A");
            })
            .prependOnceListener("event", () => {
                actionLog.push("B");
            });

        // Emit the `event` twice
        emitter.emit("event");
        emitter.emit("event");

        // The pre-pended listener executed first (but once only),
        // followed by two executions of the other listener
        assert.deepEqual(actionLog, ["B", "A", "A"]);
    });

    it('illustrates registering multiple listeners via chaining', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        // Register listeners
        emitter
            .on("event0", () => {
                actionLog.push("event0 listener");
            })
            .on("event1", () => {
                actionLog.push("event1 listener");
            })
            .on("event2", () => {
                actionLog.push("event2 listener");
            });

        // Fire events
        emitter.emit("event2");
        emitter.emit("event0");
        emitter.emit("event1");

        assert.deepEqual(actionLog, ["event2 listener", "event0 listener", "event1 listener"]);
    });

    it('illustrates that removeListener does not affect running emit', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        function listenerA() {
            actionLog.push("A");

            // Remove the listenerB from within listenerA. Note that
            // removing a listener does not remove it from the list
            // of listeners currently being executed by the `emit`
            // call. This is because `emit` creates an internal copy
            // of the listeners to be executed and it executes all
            // of them regardless of updates on the actual listeners
            // list
            emitter.removeListener("event", listenerB);
        }
        function listenerB() {
            actionLog.push("B");
        }

        // Register listeners
        emitter.on("event", listenerA);
        emitter.on("event", listenerB);

        // Fire the `event` twice
        emitter.emit("event");
        emitter.emit("event");

        // The listenerB has been removed only after the first emit
        // has completed. Hence, both callbacks have been executed
        // by the first emit call.
        assert.deepEqual(actionLog, ["A", "B", "A"]);
    });

    it('illustrates that removeListener removes most recently added listener instance', function () {
        let counter = 0;
        const emitter = new EventEmitter();

        function listener() {
            ++counter;
        }

        // Register the same listener twice. Note that the second registration
        // makes the listener a `once listener`
        emitter.on("event", listener);
        emitter.once("event", listener);

        // Remove the listener. Note that in case the same listener has
        // been registered for an event (twice in this case), the method
        // removes the instance that was registered most recently. In this
        // case that will be the `once listener` instance.
        emitter.removeListener("event", listener);

        // Fire the event twice. Note that the listener will be executed
        // twice because it was the `once` listener that was removed while
        // the regular listener is still registered
        emitter.emit("event");
        emitter.emit("event");

        assert.deepEqual(counter, 2);
    });

    it('illustrates `listeners` method', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        // Register two listeners for the `event`. Note that both are
        // `one-time` listeners
        emitter
            .once("event", () => {
                actionLog.push("listener 1");
            })
            .once("event", () => {
                actionLog.push("listener 2");
            });

        // Retrieve the listeners registered for the `event` and invoke
        // them directly. Note that invoking the listeners like this isn't
        // equivalent to firing the `event`. The listeners won't be removed
        // from the listeners list event though they are `one-time` listeners
        const listeners = emitter.listeners("event");
        assert.equal(listeners.length, 2);
        listeners.forEach(listener => {
            listener();
        });

        // Fire the `event` twice. The first firing will cause listeners to
        // be removed (as they're one-time only) so the second firing won't
        // execute any listeners
        emitter.emit("event");
        emitter.emit("event");

        assert.deepEqual(actionLog, ["listener 1", "listener 2", "listener 1", "listener 2"]);
    });

    it('illustrates `rawListeners` method', function () {
        const actionLog = [];
        const emitter = new EventEmitter();

        // Add two listeners for the `event`, the first is a `one-time`
        // and the second a regular listener.
        emitter
            .once("event", () => {
                actionLog.push("listener 1");
            })
            .on("event", () => {
                actionLog.push("listener 2");
            });

        // Get the raw listeners for the `event`
        const listenerWrappers = emitter.rawListeners("event");
        assert.equal(listenerWrappers.length, 2);

        // For `one-time` listeners registered with the `once` method,
        // rawListeners returns a wrapper function that has a listener
        // property that references the actual listener function.
        // Invoking the listener via this property won't remove the
        // `one-time` listener from the listeners list. Invoking it via
        // the wrapper function is equivalent for firing the event and
        // will cause the listener to be removed.
        listenerWrappers[0].listener();

        // Invoking the `one-time` listener via the wrapper unregisters
        // the listener
        listenerWrappers[0]();

        // Wrappers returned for the regular listeners (register with
        // `on` or `addListener`) have no `listener` property
        assert.deepEqual(listenerWrappers[1].listener, undefined);

        // Invoke the regular listeners via the wrapper
        listenerWrappers[1]();

        // Emit the `event`. Only the regular listeners is executed as
        // the `one-time` listeners has already been unregistered.
        emitter.emit("event");

        assert.deepEqual(actionLog, [
            "listener 1",
            "listener 1",
            "listener 2",
            "listener 2"
        ]);
    });

    /**
     * `events.once` method returns a promise that is fulfilled when the
     * given emitter emits the specified event or rejected when the emitter
     * emits an `error` event.
     */
    it('illustrates `events.once` method', async function () {
        const emitter = new EventEmitter();

        // Schedule the `event` to be fired before the next tick
        // starts - this will be once this function executes the
        // first `await` statement and suspends itself
        process.nextTick(() => {
            emitter.emit("event", "ABCD");
        });

        // Use `events.once` to create a promise that is resolved once
        // `event` is fired. Assert that the value the promise has been
        // resolved with matches the arguments that event was fired with.
        // Note that array is returned even though emit was called with
        // a single listener argument so the following uses destructing
        // to extract the argument
        const [arg] = await once(emitter, "event");
        assert.deepEqual(arg, "ABCD");

        // Schedule the `error` event to be fired before the next
        // tick starts, which will be once this function reaches
        // the next `await` statement and suspends itself
        process.nextTick(() => {
            emitter.emit("error", new Error("ERROR"));
        });

        // Use `events.once` to create a promise that will be rejected
        // because the `error` event is fired before the next tick. The
        // await statement will throw an exception with exception value
        // set to the error passed via the emit method
        try {
            await once(emitter, "event");
            assert.fail("Exception should've been thrown");
        }
        catch(err) {
            assert.deepEqual(err, new Error("ERROR"));
        }
    });

    /**
     * `events.on` method returns an AsyncIterator that can be used together
     * with the `for await...of` loop to iterate over the `eventName` events.
     * Note that such a loop i.e. for await(const o of on(emitter, "event"))
     * will never terminate on its own. If there's no more events to process
     * the await keyword will suspend the execution of the function executing
     * the loop. The loop can be exited from within its body though, using
     * the break statement for example. That way the loop exits before the
     * next iteration's await statement is executed.
     */
    it('illustrates using `for await...of` with `events.on` method', async function () {
        const emitter = new EventEmitter();
        const eventData = ["DATA1", "DATA2", "DATA3"];
        const actionLog = [];

        // Delay firing of few `event` events
        process.nextTick(() => {
            for (let data of eventData) {
                emitter.emit("event", data);
            }
        });

        // Once the execution reaches this loop and its await statement
        // the test function will be suspended because there's not events
        // waiting to be processed yet. Once suspended, the `nextTick`
        // callback is executed firing several `event` events. This will
        // awake the for loop which will process the fired events
        let counter = 0;
        for await(let value of on(emitter, "event")) {
            actionLog.push(...value);

            // If we processed all the fired events break the loop before
            // the next iteration's await statement is executed. This
            // prevents the loop from suspending forever and block the
            // test indefinitely
            if (++counter == eventData.length) {
                break;
            }
        }

        assert.deepEqual(actionLog, ["DATA1", "DATA2", "DATA3"]);
    });
});