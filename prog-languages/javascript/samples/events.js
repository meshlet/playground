/**
 * Illustrates the inner workings of JavaScript event-loop and
 * different techniques for dealing with JavaScript events. Note
 * that timers, while also events, are illustrates in timers.js.
 */
describe("Events", function () {
    /**
     * JavaScript engine processes one macrotask per event loop iteration.
     * Majority of work is processed as macrotasks (i.e. global code, event
     * handlers, timers etc). JavaScript engine should have at least one
     * dedicated queue for macrotasks.
     */
    it('illustrates event loop with macrotasks', function () {
        // Create two buttons and add them to DOM
        let button1 = document.createElement("button");
        let button2 = document.createElement("button");
        document.getElementsByTagName("body")[0].appendChild(button1);
        document.getElementsByTagName("body")[0].appendChild(button2);

        // Keeps the log of actions so that we can check their order after
        // the tests completes
        let actionLog = ["test_begin"];

        // The promise is used to communicate to Jasmine framework that asynchronous
        // work is pending and to instruct it to wait for promise to be resolved
        let button1Promise = new Promise((resolve) => {
            // Register click handler for the first button. Note that code is
            // executed synchronously as part of the test method
            button1.addEventListener("click", () => {
                actionLog.push("button1_click_handler_executed");

                // First button click handler must be executed first as button1 was
                // clicked (and hence added to the macrotask queue) before button2
                expect(actionLog).toEqual([
                    "test_begin",
                    "button1_click_handler_registered",
                    "button2_click_handler_registered",
                    "test_end",
                    "button1_click_handler_executed"]);

                // This promise is returned to the Jasmine framework, so resolve
                // it to let the framework know that asynchronous work is done
                resolve();
            });
        });

        actionLog.push("button1_click_handler_registered");

        // The promise is used to communicate to Jasmine framework that asynchronous
        // work is pending and to instruct it to wait for promise to be resolved
        let button2Promise = new Promise((resolve) => {
            // Register click handler for the second button. Note that code is
            // executed synchronously as part of the test method
            button2.addEventListener("click", () => {
                actionLog.push("button2_click_handler_executed");

                // Second button click handler must be executed second as button2 was
                // clicked (and hence added to the macrotask queue) after the button1
                expect(actionLog).toEqual([
                    "test_begin",
                    "button1_click_handler_registered",
                    "button2_click_handler_registered",
                    "test_end",
                    "button1_click_handler_executed",
                    "button2_click_handler_executed"]);

                // This promise is returned to the Jasmine framework, so resolve
                // it to let the framework know that asynchronous work is done
                resolve();
            });
        });

        actionLog.push("button2_click_handler_registered");

        // Simulate the clicks on button1 and button2. The timer is used for
        // this purpose to simulate the asynchronous nature of events. If
        // we simply invoked button1.click() in the test, the click handler
        // would run right away which is not how events are added to the
        // queue and processed. Note that even though the timeout is set to
        // 0 ms, the timer callback is added to the macrotask queue and
        // will process it in a separate event-loop iteration.
        //
        // Note, however, that button click handlers are still invoked
        // synchronously with calling the click() method. Hence, this doesn't
        // simulate the situation where two click events are placed in the
        // queue before they are processed.
        setTimeout(() => {
            // Simulate the click on button1
            button1.click();

            // Simulate the click on button2
            button2.click();
        }, 0);

        actionLog.push("test_end");

        // Buttons mustn't have been clicked yet (timer handler is processed in
        // the next event-loop iteration) and their click handlers mustn't have
        // been executed yet (those handlers will be processed in the separate
        // event-loop iterations)
        expect(actionLog).toEqual([
            "test_begin",
            "button1_click_handler_registered",
            "button2_click_handler_registered",
            "test_end"]);

        // Make sure that Jasmine waits for both promises to get resolved
        // by returning a merged promise with Promise.all
        return Promise.all([button1Promise, button2Promise]);
    });

    /**
     * Microtasks are units of work that are considered to have higher priority compared
     * to macrotasks. While browser processes a single macrotask per event-loop iteration,
     * it will process as many microtasks as there is including the new microtasks that
     * are being added by the microtasks already executed. Only when the microtask queue
     * becomes empty will the browser re-render the page if needed and start the next
     * event-loop iteration. Examples of microtasks are resolving a promise and DOM
     * mutations. The JavaScript engine should have at least one queue dedicated to
     * microtasks.
     */
    it('illustrates event-loop with both macrotasks and microtasks', function () {
        // Create a button and add it to DOM
        let button = document.createElement("button");
        document.getElementsByTagName("body")[0].appendChild(button);

        // Keeps the log of actions so that we can check their order after
        // the tests completes
        let actionLog = ["test_begin"];

        // The promise is used to communicate to Jasmine framework that asynchronous
        // work is pending and to instruct it to wait for promise to be resolved
        let buttonPromise = new Promise((resolve) => {
            // Register click handler for the first button. Note that code is
            // executed synchronously as part of the test method
            button.addEventListener("click", () => {
                expect(actionLog).toEqual([
                    "test_begin",
                    "button_click_handler_registered",
                    "test_end"]);

                // Create a resolve Promise and register onFulfilled handler for
                // it. Note that even though the Promise is resolved, this handler
                // is not executed right away. It is placed on the microtask queue
                // instead, and will execute after the current macrotask (the click
                // handler) completes.
                Promise.resolve().then(() => {
                    expect(actionLog).toEqual([
                        "test_begin",
                        "button_click_handler_registered",
                        "test_end",
                        "button_click_handler_executed"]);

                    // This buttonPromise is returned to the Jasmine framework, so resolve
                    // it to let the framework know that asynchronous work is done
                    resolve();
                });

                actionLog.push("button_click_handler_executed");
            });
        });

        actionLog.push("button_click_handler_registered");


        // Simulate the button click. The timer is used for this purpose
        // to simulate the asynchronous nature of events. If we simply
        // invoked button.click() in the test, the click handler would
        // run right away which is not how events are added to the queue
        // and processed. Note that even though the timeout is set to
        // 0 ms, the timer callback is added to the macrotask queue and
        // will process it in a separate event-loop iteration.
        //
        // Note, however, that button click handlers are still invoked
        // synchronously with calling the click() method. Hence, this doesn't
        // simulate the situation where two click events are placed in the
        // queue before they are processed.
        setTimeout(() => {
            // Simulate the click on the button
            button.click();
        }, 0);

        actionLog.push("test_end");

        // Buttons mustn't have been clicked yet (timer handler is processed in
        // the next event-loop iteration) and their click handlers mustn't have
        // been executed yet (those handlers will be processed in the separate
        // event-loop iterations)
        expect(actionLog).toEqual([
            "test_begin",
            "button_click_handler_registered",
            "test_end"]);

        // Return the promise to Jasmine framework to make it wait for
        // async work to finish
        return buttonPromise;
    });

    /**
     * JavaScript engine processes events in two phases: event capturing
     * and event bubbling. Assume the following DOM structure:
     * <html>
     *     <body>
     *         <div id="div1">
     *             <div id="div2>
     *             </div>
     *         </div>
     *     </body>
     * </html>
     *
     * Document, div1 and div2 all have mouse click handlers registered. When
     * user clicks on div2 element the click event is captured at the top-level
     * element which is window and it then trickled down to the target element
     * (div2). This is EVENT CAPTURING. Any event handler in capturing mode is
     * executed during this trickling. Note that the target element's click
     * handler would be executed last of all the event handlers in capturing
     * mode.
     *
     * Once the target element (div2) has been reached in the capturing phase,
     * event handling switches to BUBBLING The event is bubbled from the target
     * element all the way up to the top-level window element and any event
     * handlers in the bubbling mode are executed. Note that target element's
     * event handler would be executed first of all the event handlers in
     * bubbling mode.
     *
     * Whether the handler is in capturing or bubbling mode is determined by
     * the third argument to addEventListener() method: true creates a capturing
     * event handler and false (or omitting the value) makes it bubbling.
     */
    it('illustrates event capturing and event bubbling', function () {
        let actionLog = [];

        // Create outer, middle and inner divs
        let outerDiv = document.createElement("div");
        let middleDiv = document.createElement("div");
        let innerDiv = document.createElement("div");

        // Add elements to DOM
        middleDiv.appendChild(innerDiv);
        outerDiv.appendChild(middleDiv);
        document.getElementsByTagName("body")[0].appendChild(outerDiv);

        // Register click handler on the document. We don't specify the
        // third argument so the handler will be in bubbling mode
        document.addEventListener("click", () => {
            actionLog.push("document");
        });

        // Register click handler on the outer div. We pass true as the
        // third argument so the handler will be in capturing mode
        outerDiv.addEventListener("click", () => {
            actionLog.push("outer")
        }, true);

        // Register click handler on the middle div. We pass false as the
        // third argument so the handler will be in bubbling mode
        middleDiv.addEventListener("click", () => {
            actionLog.push("middle")
        }, false);

        // Register click handler on the inner div. We pass true as the
        // third argument so the handler will be in capturing mode
        innerDiv.addEventListener("click", () => {
            actionLog.push("inner");
        }, true);

        // Simulate click action on the inner div
        innerDiv.click();

        // The outer and inner div click handlers are in capturing mode,
        // hence they are executed in the event capturing phase. The
        // outer div handler is executed first followed by the inner
        // div's handler.
        // The document and middle div click handlers are in bubbling
        // mode hence they are executed in the event bubbling phase.
        // The middle div's handler is executed first followed by
        // document't event handler
        expect(actionLog).toEqual([
            "outer", "inner", "middle", "document"
        ]);
    });

    /**
     * Inside event handlers, 'this' always points to the element on which the
     * event handler was registered. On the other hand, event.target points to
     * the element on which the event has occurred.
     */
    it('illustrates difference between `this` and event.target in handlers', function () {
        // Create outer and inner divs
        let outerDiv = document.createElement("div");
        let innerDiv = document.createElement("div");

        // Add them to the DOM
        outerDiv.appendChild(innerDiv);
        document.getElementsByTagName("body")[0].appendChild(outerDiv);

        // Register the click handler for the inner div
        innerDiv.addEventListener("click", function (event) {
            // `this` points to the element on which the handler was registered
            // which is the innerDiv
            expect(this).toBe(innerDiv);

            // event.target points to element on which the click event has
            // occurred, which is also innerDiv
            expect(event.target).toBe(innerDiv);
        });

        // Register the click handler for the outer div
        outerDiv.addEventListener("click", function (event) {
            // `this` points to the element on which the handler was registered
            // which is the outerDiv
            expect(this).toBe(outerDiv);

            // event.target points to element on which the click event has
            // occurred, which is innerDiv
            expect(event.target).toBe(innerDiv);
        });

        // Simulate the click on the inner div
        innerDiv.click();
    });

    it('illustrates delegating events to ancestor element', function () {
        const rowCount = 4;
        const cellCount = 7;

        // Create a table with `rowCount` rows and `cellCount` cells in each row
        let table = document.createElement("table");
        for (let i = 0; i < rowCount; ++i) {
            let row = document.createElement("tr");

            for (let j = 0; j < cellCount; ++j) {
                row.appendChild(document.createElement("td"));
            }

            table.appendChild(row);
        }
        document.body.appendChild(table);

        let cellClickCount = 0;

        // Register an click handler on the table element. Note, however,
        // that we want to react clicks on individual table cells. Hence
        // we rely on event bubbling to reach the table element at which
        // point the event handler is executed. This is much more efficient
        // than registering an event handler for each table cell.
        table.addEventListener("click", (event) => {
            // We only want to handle table cell clicks
            if (event.target.tagName.toLowerCase() === "td") {
                ++cellClickCount;
            }
        });

        // Simulate click event on each table cell
        for (let i = 0; i < rowCount; ++i) {
            let row = table.children[i];
            for (let j = 0; j < cellCount; ++j) {
                row.children[j].click();
            }
        }

        // Assert that the number of clicked cells is `rowCount * cellCount`
        expect(cellClickCount).toBe(rowCount * cellCount);
    });

    it('illustrates custom events', function () {
        // Function used to dispatch custom event to the event target
        function dispatchCustomEvent(target, eventType, eventData) {
            let event = new CustomEvent(eventType, {
                detail: eventData
            });

            // Dispatch the event to the the event target. Note that the dispatch
            // is done synchronously - that is, all event handlers will be executed
            // as part of this call before the execution continues
            target.dispatchEvent(event);
        }

        let actionLog = [];

        // Create a div element
        let div = document.createElement("div");

        // Register custom `on-timeout-created` event on the div
        div.addEventListener("on-timeout-created", event => {
            expect(event.target).toBe(div);
            expect(event.detail).toEqual("timeout created");

            actionLog.push("on-timeout-created");
        });

        // Register custom `on-timeout-handler-executed` event on the div
        div.addEventListener("on-timeout-handler-executed", event => {
            expect(event.target).toBe(div);
            expect(event.detail).toEqual("timeout handler executed");

            actionLog.push("on-timeout-handler-executed");
        });

        // Return a promise to Jasmine framework to make it wait for the
        // async work to complete
        return new Promise((resolve) => {
            // Create a timeout that fires after 10ms
            setTimeout(() => {
                // Dispatch custom `on-timeout-handler-executed` event to the div
                dispatchCustomEvent(
                    div, "on-timeout-handler-executed", "timeout handler executed");

                expect(actionLog).toEqual([
                    "on-timeout-created", "on-timeout-handler-executed"
                ]);

                // Resolve the promise returned to the Jasmine framework
                resolve();
            }, 10);

            // Dispatch custom `on-timeout-created` event to the div
            dispatchCustomEvent(div, "on-timeout-created", "timeout created");
        })
    });

    /**
     * Capturing and bubbling semantics hold for custom events as well. There's
     * one notable difference to built-in events though, custom events don't
     * bubble by default unlike the built-in ones. This behavior can be overridden
     * by specified `bubbles:true` in the object passed as the second argument
     * to CustomEvent constructor.
     */
    it('illustrates capturing/bubbling with custom events', function () {
        let actionLog = [];

        // Create outer, middle and inner divs
        let outerDiv = document.createElement("div");
        let middleDiv = document.createElement("div");
        let innerDiv = document.createElement("div");

        // Add elements to DOM
        middleDiv.appendChild(innerDiv);
        outerDiv.appendChild(middleDiv);
        document.getElementsByTagName("body")[0].appendChild(outerDiv);

        // Register handler for the `custom-click' event on the document. We don't
        // specify the third argument so the handler will be in bubbling mode
        document.addEventListener("custom-click", () => {
            actionLog.push("document");
        });

        // Register handler for the `custom-click` event on the outer div. We pass
        // true as the third argument so the handler will be in capturing mode
        outerDiv.addEventListener("custom-click", () => {
            actionLog.push("outer")
        }, true);

        // Register handler for the `custom-click` event on the middle div. We pass
        // false as the third argument so the handler will be in bubbling mode
        middleDiv.addEventListener("custom-click", () => {
            actionLog.push("middle")
        }, false);

        // Register handler for the `custom-click` event on the inner div. We pass
        // true as the third argument so the handler will be in capturing mode
        innerDiv.addEventListener("custom-click", () => {
            actionLog.push("inner");
        }, true);

        // Dispatch the `custom-click` event on the inner div. Note that
        // `bubbles:true` is set to make sure the custom event both
        // captures and bubbles
        innerDiv.dispatchEvent(
            new CustomEvent("custom-click", { bubbles: true }));

        // The outer and inner div click handlers are in capturing mode,
        // hence they are executed in the event capturing phase. The
        // outer div handler is executed first followed by the inner
        // div's handler.
        // The document and middle div handlers are in bubbling mode
        // hence they are executed in the event bubbling phase. The
        // middle div's handler is executed first followed by document's
        // event handler
        expect(actionLog).toEqual([
            "outer", "inner", "middle", "document"
        ]);
    });
});