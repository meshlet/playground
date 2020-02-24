/**
 * Illustrates JavaScript promises introduced in ES6.
 */
describe("Promises", function () {
    it('creating a simple promise', function () {
        // This promise will pass as we unconditionally call the function
        // passed as the first argument to the executor function. Note
        // that executor function is invoked as part of the Promise
        // constructor call.
        let promisePass = new Promise((resolve, reject) => {
            resolve("pass");
        });

        // This promise will fail as we unconditionally call the function
        // passed as the second argument to the executor.
        let promiseFail = new Promise((resolve, reject) => {
            reject("fail");
        });

        promisePass.then(
            (arg) => {
                expect(arg).toEqual("pass");
            },
            () => {
                // We mustn't end up here
                expect(true).toBe(false);
            }
        );

        promiseFail.then(
            () => {
                // We mustn't end up here
                expect(true).toBe(false);
            },
            (arg) => {
                expect(arg).toEqual("fail");
            }
        );
    });

    it('illustrates the order of promise resolve callback invocation', function () {
        return new Promise((outer_resolve, outer_reject) => {
            // Tracks the order of executed actions
            let executionOrder = ["start"];

            let delayedPromise = new Promise((resolve, reject) => {
                executionOrder.push("delayed_promise_created");
                setTimeout(() => {
                    // Resolve this promise after 500 ms.
                    resolve("resolve with delay");
                }, 500);
            });

            executionOrder.push("between_promise_creation");

            let immediatePromise = new Promise((resolve, reject) => {
                executionOrder.push("immediate_promise_created");
                // Resolve immediately
                resolve("resolve immediately");
            });

            delayedPromise.then((arg) => {
                executionOrder.push("delayed_promise_resolved");
                expect(arg).toEqual("resolve with delay");

                // Notify Jasmine framework what this asynchronous test has finished
                outer_resolve();
            });

            // Even though immediatePromise has already been resolved, the resolve
            // callback is invoked after all the other code in the current step of
            // the event loop has been executed. This is why the "end" string is
            // appended to the executionOrder before this callback runs.
            immediatePromise.then((arg) => {
                executionOrder.push("immediate_promise_resolved");
                expect(arg).toEqual("resolve immediately");
            });

            executionOrder.push("end");

            // Resolve callbacks for neither of the promises have been called yet
            // (not even for the immediately resolved promise, that will happen
            // after the rest of the code in this function has executed). The
            // content of executionOrder confirms this:
            expect(executionOrder).toEqual([
                "start",
                "delayed_promise_created",
                "between_promise_creation",
                "immediate_promise_created",
                "end"
            ]);
        });
    });

    it('illustrates rejecting promises', function () {
        // The promise is rejected by calling the second argument of the executor
        // function
        let explicitlyRejectedPromise = new Promise((resolve, reject) => {
            reject("rejected");
        });

        explicitlyRejectedPromise.then(
            () => {
                // We mustn't end up here
                expect(true).toBe(false);
            },
            (arg) => {
                expect(arg).toBe("rejected");
            }
        );

        // The following promise is rejected because an exception is thrown
        // (using an undeclared variable)
        let implicitlyRejectedPromise = new Promise((resolve, reject) => {
            undeclaredVariable++;
        });

        // Here we use the built-in 'catch' method to provide register the failure
        // callback, instead of passing the second argument to 'then' method.
        implicitlyRejectedPromise.then(() => {
            // We mustn't end up here.
            expect(true).toBe(false);
        }).catch((err) => {
            // We expect ReferenceError
            expect(err).toBeInstanceOf(ReferenceError);
        });
    });
});