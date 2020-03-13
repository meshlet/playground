/**
 * Illustrates JavaScript timeouts and intervals. For samples that
 * illustrate JavaScript event-loop and events look at events.js.
 */
describe("Timers", function () {
    // Helper function that will block the event-loop for at least
    // specified number of milliseconds. This is used to simulate
    // long running tasks running synchronously in the event-loop
    function blockFor(period) {
        const startTimestamp = Date.now();
        while (Date.now() - startTimestamp < period) {}
    }

    it('illustrates that timeouts fire only once', function () {
        let counter = 0;

        // Create the timeout that fires once after 10 ms.
        setTimeout(() => {
            ++counter;
        }, 10);

        // Create the promise to return from the test function to
        // make sure Jasmine frameworks waits for async work to
        // complete.
        return new Promise((resolve) => {
            // Create another timeout that fires after 40 ms. The purpose
            // of this timeout is to verify that the first timeout handler
            // was executed only once
            setTimeout(() => {
                expect(counter).toBe(1);
                resolve();
            }, 40);
        });
    });

    it('illustrates clearing timeouts', function () {
        let counter = 0;

        // Create the timeout that fires after 30 ms
        let timeout = setTimeout(() => {
            ++counter;
        }, 30);

        // Clear the timeout
        clearTimeout(timeout);

        // Create the promise to return from the test function to
        // make sure Jasmine frameworks waits for async work to
        // complete.
        return new Promise((resolve) => {
            // Create another timeout that fires after 40 ms. The purpose
            // of this timeout is to verify that the first timeout didn't
            // fire
            setTimeout(() => {
                expect(counter).toBe(0);
                resolve();
            }, 40);
        });
    });

    it('illustrates the timeout firing delay', function () {
        // Create the promise to return from the test function to
        // make sure Jasmine frameworks waits for async work to
        // complete.
        let promise = new Promise((resolve) => {
            // Create the timeout that fires after 20 ms. Record the
            // timestamp when the timeout was created
            const startTimestamp = Date.now();
            setTimeout(() => {
                // Because the test function took at least 40 ms to complete,
                // the timeout handler didn't executed at 20 ms mark but was
                // instead pushed to 40 ms mark or later
                expect(Date.now() - startTimestamp).toBeGreaterThanOrEqual(40);
                resolve();
            }, 20);
        });

        // Simulate time consuming work that takes at least 40 ms
        blockFor(40);

        // Return the promise to Jasmine framework
        return promise;
    });

    it('illustrates the order of timeout handlers execution', function () {
        let lastFiredTimer = "";

        // Return the aggregated promise to Jasmine framework to make it
        // wait for all timeouts to fire
        return Promise.all([
            new Promise((resolve) => {
                // Create a timeout that fires after 20 ms
                setTimeout(() => {
                    // Timeout 3 fired at 10 ms mark, which means it must have
                    // fired before this timeout
                    expect(lastFiredTimer).toEqual("timeout 3");
                    lastFiredTimer = "timeout 1";

                    // Resolve the promise for this timeout
                    resolve();
                }, 20);
            }),

            new Promise((resolve) => {
                // Create a timeout that fires after 20 ms (the same as timeout 1)
                setTimeout(() => {
                    // Timeout 1 fired at 20 ms mark just like this timeout. However,
                    // because timeout 1 was started first it's macrotask should've
                    // been processed before that of timeout 2
                    expect(lastFiredTimer).toEqual("timeout 1");

                    // Resolve the promise for this timeout
                    resolve();
                }, 20);
            }),

            new Promise((resolve) => {
                // Create a timeout that fires after 10 ms
                setTimeout(() => {
                    // This timeout (timeout 3) fires at 10 ms mark, while the other two
                    // timeouts fire at 20 ms mark. Hence, this timeout must be processed
                    // first
                    expect(lastFiredTimer).toEqual("");
                    lastFiredTimer = "timeout 3";

                    // Resolve the promise for this timeout
                    resolve();
                }, 10);
            })
        ]);
    });

    it('illustrates that intervals fire repeatedly until cleared', function () {
        let counter = 0;

        // Create an interval that fires every 10 ms
        let interval;
        interval = setInterval(() => {
            ++counter;

            // Clear the interval after it's handler was processed 3 times
            if (counter === 3) {
                clearInterval(interval);
            }
        }, 10);

        // Return the promise to Jasmine framework that makes sure it waits
        // for async work to complete
        return new Promise((resolve) => {
            // Create a timeout used to monitor the interval. The timeout fires
            // after 60 ms and asserts that interval has been fired exactly 3
            // times
            setTimeout(() => {
                expect(counter).toBe(3);
                resolve();
            }, 60);
        });
    });

    it('illustrates the interval firing delay', function () {
        let counter = 0;

        // The promise is returned to Jasmine framework to make it wait for
        // the interval to finish firing
        let promise = new Promise((resolve) => {
            // Create interval that fires every 10 ms. However, note that its
            // handler won't be executed regularly every 10 ms. Record the
            // timestamp when the interval was created
            let startTimestamp = Date.now();

            let interval;
            interval = setInterval(() => {
                let fireTimestamp = Date.now();

                if (counter === 0) {
                    // The interval handler is first run after at least 30 ms. This
                    // is because the test function takes at least 30 ms to complete
                    expect(fireTimestamp - startTimestamp).toBeGreaterThanOrEqual(30);
                }
                else {
                    // Each next interval handler execution happens immediately after
                    // the previous handler execution was completed. This is because
                    // interval handlers are scheduled to execute at fixed points in
                    // time, regardless of how long the handler execution takes. Hence,
                    // it can happen that two or more handlers are executed back to
                    // back
                    expect(fireTimestamp - startTimestamp).toBeGreaterThanOrEqual(15);
                }

                startTimestamp = fireTimestamp;

                // Simulate long-running work
                blockFor(15);

                // Clear the interval after it fired 3 times
                if (++counter === 3) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });

        // Simulate long-running work
        blockFor(30);

        // Return promise to Jasmine framework
        return promise;
    });

    /**
     * JavaScript engine won't add another interval task to the queue if that
     * interval already has a handler task waiting in the queue to be processed.
     * However, if the given interval's task is being executed while the interval
     * fires again, the new task is pushed to the macrotask queue.
     *
     * The following sketch illustrates what the test does:
     *
     *                          --- 0 ms => setInterval(10ms) - interval fires after every 10ms
     *                           |          setTimeout(15ms) - timeout 1 fires after 35 ms. Its handler is processed after
     *                           |                             60ms after two interval handlers complete their execution
     *                           |
     *                           |
     *                           |
     *      ------------------  --- 10 ms => interval fires
     *     |                     |
     *     |                     |
     *     |                     |
     *     |                     |
     *     |                     |
     *     |    interval task   --- 20 ms => interval fires (added to macrotask queue)
     *     |    fired at 10ms    |
     *     |    mark executes    |
     *     |      for 25ms       |
     *     |                     |
     *     |                     |
     *     |                    --- 30 ms => interval fires but is ignored as there's already a
     *     |                     |           handler task for this interval waiting in the queue
     *     |                     |
     *      ------------------  --- 35 ms => timeout 1 fires (and is added to the macrotask queue)
     *     |                     |
     *     |                     |
     *     |                    --- 40 ms => interval fires (and is added to macrotask queue)
     *     |                     |
     *     |                     |
     *     |    interval task    |
     *     |    fired at 20ms    |
     *     |    mark executes    |
     *     |       for 25ms     --- 50 ms => interval fires but is ignored as there's already a
     *     |                     |           handler task for this interval waiting in the queue
     *     |                     |
     *     |                     |
     *     |                     |
     *     |                     |
     *      ------------------  --- 60 ms => Timeout 1 handler executes and  clears the interval. This removes the waiting
     *                           |           interval task (added at 40 ms mark) from the queue and halts the interval.
     *                           |           The means that interval isn't fired at 60 ms.
     *                           |           Additionally, timeout 2 is created that will fire at 120 ms mark.
     *                           |
     *                           |
     *                          --- 70 ms
     *                           .
     *                           .
     *                           .
     *                           .
     *                           .
     *                           .
     *                          --- 110 ms
     *                           |
     *                           |
     *                           |
     *                           |
     *                           |
     *                          --- 120 ms => Timeout 2 fires and its handler is immediately executed. It asserts
     *                                        that the interval handler has run only twice. The interval firing at
     *                                        30 ms mark should have been ignored (as there was already a task
     *                                        waiting on the queue). The interval added to the queue at 40 ms mark
     *                                        should've been removed from the queue by timeout 1 handler. Similar
     *                                        reasoning applies for interval firings at 50ms and 60ms
     */
    it('illustrates that only one interval task can wait in queue', function () {
        let counter = 0;

        // Create interval that fires every 10 ms. It's handler won't be
        // processed that regularly because interval handler runs for 25 ms
        let interval = setInterval(() => {
            ++counter;

            // Simulate long-running work
            blockFor(25);
        }, 10);

        // Return a promise to Jasmine to make it wait for the async work
        // to complete
        return new Promise((resolve) => {
            // Create timeout that will fire after 35 ms. Note that its handler task
            // is processed only after 60 ms because two interval handlers will be
            // processed before it (check the sketch)
            let startTimestamp = Date.now();

            setTimeout(() => {
                expect(Date.now() - startTimestamp).toBeGreaterThanOrEqual(60);

                // Clear the interval. This removes any interval tasks waiting on the
                // queue and prevents further interval tasks from firing
                clearInterval(interval);

                // Create another timeout that will fire at 120 ms mark (or 60 ms
                // after now)
                setTimeout(() => {
                    // Assert that interval handler has been run only twice. Check the
                    // sketch for explanation
                    expect(counter).toBe(2);

                    // Resolve the promise returned to Jasmine
                    resolve();

                }, 60);
            }, 35);
        });
    });

    it('illustrates the order of interval handler execution', function () {
        let actionLog = [];

        (() => {
            let counter = 0;

            // Create interval that fires every 20 ms
            let interval1;
            interval1 = setInterval(() => {
                actionLog.push("interval 1");

                // Clear the timer after its handler is executed the second time
                if (++counter === 2) {
                    clearInterval(interval1);
                }
            }, 20);
        })();

        (() => {
            let counter = 0;

            // Create interval that fires every 20 ms
            let interval2;
            interval2 = setInterval(() => {
                actionLog.push("interval 2");

                // Clear the timer after its handler is executed the second time
                if (++counter === 2) {
                    clearInterval(interval2);
                }
            }, 20);
        })();

        (() => {
            let counter = 0;

            // Create interval that fires every 10 ms
            let interval3;
            interval3 = setInterval(() => {
                actionLog.push("interval 3");

                // Clear the timer after its handler is executed the second time
                if (++counter === 2) {
                    clearInterval(interval3);
                }
            }, 10);
        })();

        // Return a promise to Jasmine framework to make it wait for the
        // async work to complete
        return new Promise((resolve) => {
            // Create a timeout that fires after all the intervals have
            // been cleared which that should happen at 40 ms mark. Hence,
            // fire this timeout at 50 ms mark to be sure all intervals
            // have been cleared.
            setTimeout(() => {
                // The interval 3 was fired at 10 ms mark and was processed first.
                // At 20 ms mark all 3 intervals fire, and handlers are processed
                // in order of interval creation: interval 1, interval 2, interval 3.
                // At 40 ms interval 1 and 2 fire and their handlers are processed
                // in order of interval creation: interval 1, interval 2.
                expect(actionLog).toEqual([
                    "interval 3", "interval 1", "interval 2", "interval 3", "interval 1", "interval 2"
                ]);

                // Resolve the promise returned to Jasmine framework
                resolve();
            }, 50);
        })
    });

    /**
     * Intervals are fired every 'delay' milliseconds regardless of how
     * long the handler processing takes. Hence, for an interval that
     * fires every 10 ms but whose handler takes 15 ms the following
     * happens:
     *
     * - Interval that fires with 10ms delay created at 0ms
     * - Interval fires at 10ms
     * - Interval handler executed from 10ms to 25ms
     * - Interval fires at 20ms, while the handler is being run
     * - Interval handler executed again from 25ms to 40ms
     *
     * Hence, the interval firing happens every 10ms but the handler
     * execution itself happens back-to-back. This sample shows how to
     * use timeouts to make sure the delay between successive handler
     * executions never gets smaller than the specified delay. Assuming
     * the timeout delay is 10ms and the handler takes 15ms to execute
     * the following happens:
     *
     * - Timeout that fires with 10ms delay created at 0ms
     * - Timeout fires at 10ms
     * - Handler runs from 10ms to 25ms
     * - Timeout that fires with 10ms delay created at 25ms
     * - Handler runs from 35ms to 50ms
     */
    it('illustrates using timeouts to stabilize delay between handler executions', function () {
        let counter = 0;

        // Return a promise to Jasmine framework that makes it wait
        // for async work to finish
        return new Promise((resolve) => {
            // Create a timeout that fires after 10ms and record the
            // timestamp when it was created
            let startTimestamp = Date.now();
            setTimeout(function handler() {
                // It must've take at least 10 ms between this and the
                // previous handler execution
                expect(startTimestamp).toBeGreaterThanOrEqual(10);

                // Simulate long-running work
                blockFor(15);

                // Stop creating new timeouts once the handler is executed
                // the third time
                if (++counter < 3) {
                    // Record the creation timestamp for the new timeout
                    startTimestamp = Date.now();

                    // Create a new timeout with the same handler
                    setTimeout(handler, 10);
                }
                else {
                    // Resolve the promise returned to Jasmine framework
                    resolve();
                }
            }, 10);
        });
    });

    it('illustrates using timer to break up long-running task', function () {
        // The following immediate function will create 120 000 DOM elements
        // (10000 rows * 12 elements/row (6 table cells + 6 text nodes). This
        // will take several hundred milliseconds even on the fastest of
        // browsers. Browser won't be able to render the page while this code
        // is running, hence page might seem unresponsive. See the next code
        // segment for how timer can be used to break up this long-running
        // task into several smaller ones.
        (() => {
            // Create a table element
            let table = document.createElement("table");

            // Create 10k table rows
            for (let i = 0; i < 10000; ++i) {
                let row = document.createElement("tr");

                // Create 6 cells for each row
                for (let j = 0; j < 6; ++j) {
                    let cell = document.createElement("td");

                    // Create a text node and append it to the cell
                    cell.appendChild(document.createTextNode("row: " + i + ", cell: " + j));

                    // Append the cell to the row
                    row.appendChild(cell);
                }

                // Append row to the table
                table.appendChild(row);
            }
        })();

        // The following code is functionality equivalent to the previous segment,
        // but instead of creating 120k nodes in bulk it breaks up this task into
        // several smaller ones. Each of the smaller task is scheduled asynchronously
        // via the timeout, so browser has the opportunity to re-render the page
        // after each of the sub-tasks has completed which makes the page responsive.
        // Note that timeouts use the delay of 0. That clearly doesn't mean that
        // sub-tasks are executed after 0 ms. It is only an indication to the
        // browser to execute the timeout handler as soon as possible while also
        // giving it change to render the page before running the handler.
        return new Promise((resolve) => {
            // The total number of rows that need to be created
            let rowCount = 10000;

            // The number of batches that work is split into
            let batchCount = 4;

            // The number of rows created per batch of work
            let rowCountPerBatch = rowCount / batchCount;

            // Tracks the index of the current batch
            let batchIndex = 0;

            // Create a table element
            let table = document.createElement("table");

            setTimeout(function generateRows() {
                // The index of the first row to be created in this batch.
                let baseRowIndex = batchIndex * rowCountPerBatch;

                // Create rows for this batch
                for (let i = 0; i < rowCountPerBatch; ++i) {
                    let row = document.createElement("tr");

                    // Create 6 cells for this row
                    for (let j = 0; j < 6; ++j) {
                        let cell = document.createElement("td");

                        // Create and append the text node to this cell. Note that the
                        // current row index is calculated as:
                        // batchIndex * rowCountPerBatch + i
                        cell.appendChild(
                            document.createTextNode("row: " + (baseRowIndex + i) + ", cell: " + j));

                        // Append cell to the row
                        row.appendChild(cell);
                    }

                    // Append row to the table
                    table.appendChild(row);
                }

                // Create the new timeout to process the next batch if there are any
                // left
                if (++batchIndex < batchCount) {
                    setTimeout(generateRows, 0);
                }
                else {
                    // We're done so resolve the promise returned to Jasmine framework
                    resolve();
                }
            }, 0);
        });
    });
});