/**
 * Illustrates the NodeJS util module which contains many classes
 * and functions useful for application developers.
 */
const util = require("util");
const assert = require("assert").strict;

describe("Util", function () {
    it('illustrates util.callbackify method', function () {
        // Return an aggregated promise back to Mocha framework to
        // make it wait for all promises to be processed
        return Promise.all([
            new Promise(resolve => {
                // Use callbackify to create a function following the
                // error-first callback style from a function returning
                // a promise
                const callbackWrapper = util.callbackify(() => {
                    // Return a resolved promise
                    return Promise.resolve("ABCD");
                });

                // Register the callback by invoking the callback wrapper and passing
                // it the callback function.
                callbackWrapper((err, value) => {
                    // The promise has been fulfilled so the error must be null
                    assert.equal(err, null);

                    // Assert that the value is expected
                    assert.deepEqual(value, "ABCD");

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            }),

            new Promise(resolve => {
                // Use callbackify to create a function following the
                // error-first callback style from a function returning
                // a promise. Note that promise is rejected in this case
                const callbackWrapper = util.callbackify(() => {
                    // Return a rejected promise
                    return Promise.reject("aaaa");
                });

                // Register the callback function that will be invoked when the
                // promise gets rejected
                callbackWrapper((err) => {
                    // The error must match the value that promise was rejected with
                    assert.deepEqual(err, "aaaa");

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            }),

            new Promise(resolve => {
                // Use callbackify to create a function following the error-first
                // callback style from a function returning a promise. The promise
                // is rejected with a falsy value in this case
                util.callbackify(() => {
                    // Return a rejected promise. Note that promise is reject with
                    // a null which is a falsy value. Error being null would be
                    // interpreted as NO ERROR by the callback, hence this error
                    // value is wrapped in an Error object with `reason` property
                    // set to the `null` error value
                    return Promise.reject(null);
                })(err => {
                    assert.ok(err instanceof Error);
                    assert.equal(err.reason, null);

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            }),

            new Promise(resolve => {
                // Use callbackify to create a function following the error-first
                // callback style from an async function that throws an error.
                // That means that the promise returned by the async function is
                // rejected
                util.callbackify(async () => {
                    // Throw an error. This causes the promise returned by this async
                    // function to be rejected
                    throw 100;
                })(err => {
                    assert.equal(err, 100);

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            })
        ]);
    });

    /**
     * util.promisify assumes that the function passed to it takes a
     * error-first style callback as its last argument. In other words,
     * the expected usage is:
     *
     * const promisifiedFn = util.promisify((arg1,...,argn, callback) => {
     *     ...
     *     callback(error, value);
     * });
     *
     * The promisifiedFn returns a promise that is resolved according to
     * the way that callback is invoked. If callback is invoked with null
     * the promise is fulfilled, otherwise the promise is rejected.
     */
    it('illustrates util.promisify method', async function () {
        // A function that takes error-first callback as its last argument.
        // This function is used to demonstrate the util.promisify usage
        function testFn(failWithError, result, errorFistCallback) {
            if (failWithError) {
                // Invoke the callback with this value as the error value
                // (simulates failure)
                errorFistCallback(failWithError);
            }

            // Otherwise, invoke callback with null for error and result as
            // the value (simulates success)
            errorFistCallback(null, result);
        }

        // Use util.promisify to create a function that returns a promise
        // out of a function which accepts an error-first callback as its
        // last argument
        const promisifiedFn = util.promisify(testFn);

        // Use Promise.then and Promise.catch to wait for promise to resolve.
        // Note that we don't have to pass the error-first callback to the
        // promisified function. The function itself will handle that
        promisifiedFn(null, "ABCD")
            .then(value => {
                assert.deepEqual(value, "ABCD");
            })
            .catch(() => {
                assert.fail("The promise should've been fulfilled");
            });

        // The promise returned by the following promisifiedFn invocation will
        // be rejected. Note that even though the second argument of the `testFn`
        // isn't used in this, we still have to pass it to the promisified
        // function. This is because promisified functions take all arguments
        // passed to it, invoke the original `testFn` with those arguments and
        // pass the error-first callback as the last argument. Hence, if we
        // don't specify the value for the `result` parameter of `testFn`, the
        // promisified function will pass the callback as the function second
        // instead passing it as the third argument
        promisifiedFn(new Error("ABCD"), undefined)
            .then(() => {
                assert.fail("The promise should've been rejected");
            })
            .catch(err => {
                assert.ok(err instanceof Error);
                assert.deepEqual(err.message, "ABCD");
            });

        // Use await to suspend the test execution until the promise returned
        // by promisifiedFn is processed
        assert.deepEqual(await promisifiedFn(null, 1000), 1000);
    });

    it('illustrates custom promisified functions', async function () {
        // A function that has onSuccess and onFailure callbacks.
        // Such function can't be promisified using the default
        // util.promisify because it's last parameters is not an
        // error-first callback
        function testFn(successValue, error, onSuccess, onFailure) {
            if (successValue) {
                // Invoke success callback
                onSuccess(successValue);
            }

            // Otherwise invoke failure callback
            onFailure(error);
        }

        // Such a function can be promisified by implementing the
        // method with the util.promisify.custom key. The purpose
        // of this method is to return a promise that resolves
        // depending on the outcome of the original function
        testFn[util.promisify.custom] = (successValue, error) => {
            // Return a promise
            return new Promise((resolve, reject) => {
                // Invoke the original function, but for the callback
                // arguments pass the resolve (for onSuccess) and reject
                // (onFailure) callbacks.
                testFn(successValue, error, resolve, reject);
            });
        };

        // Promisify the function
        const promisifiedFn = util.promisify(testFn);

        // The following uses the custom promisified function that
        // results in fulfilled promise
        assert.deepEqual(await promisifiedFn("ABCD"), "ABCD");

        // The following uses the custom promisified function that
        // results in rejected promise
        await assert.rejects(
            promisifiedFn(null, new Error("error")),
            {
                name: "Error",
                message: "error"
            });
    });
});