/**
 * Illustrates JavaScript promises introduced in ES6.
 */
describe("Promises", function () {
    it('illustrates creating a simple promise', function () {
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
        // The promise objects is returned to communicate to the Jasmine framework
        // that it needs to wait for the asynchronous work to finish before it can
        // continue running other tests. Only once the promise is resolved (or
        // rejected) will the Jasmine framework continue.
        return new Promise((outer_resolve, outer_reject) => {
            // Tracks the order of executed actions
            let executionOrder = ["start"];

            let delayedPromise = new Promise((resolve, reject) => {
                executionOrder.push("delayed_promise_created");
                setTimeout(() => {
                    // Resolve this promise after 500 ms.
                    resolve("resolve with delay");
                }, 100);
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
        let implicitlyRejectedPromise = new Promise(() => {
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

    /**
     * This test illustrates the rules specified in the 'Return value' section of
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */
    it('illustrates chaining promises', function () {
        // If then's onFulfilled handler returns a value, the new promise returned
        // by 'then' method is fulfilled with the return value as its value.
        //
        // Promise.resolve() returns an already resolved promise object.
        Promise.resolve()
            .then(() => {
                return "ABC";
            })
            .then(
                (arg) => {
                    // The promise returned by the first 'then' call must be resolved
                    // with the value returned by the onFulfilled handler of the first
                    // 'then'.
                    expect(arg).toEqual("ABC");
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onRejected handler returns a value, the promise returned by
        // then method is fulfilled with that value.
        Promise.reject()
            .then(
                undefined,
                () => {
                    return "ABC";
                }
            )
            .then(
                (arg) => {
                    // This promise is fulfilled with the value that the promise
                    // returned by the previous then has been rejected with
                    expect(arg).toEqual("ABC");
                },
                () => {
                    // This promise mustn't be rejected
                    expect(true).toBeFalse();
                }
            );

        // If catch's handler returns a value, the promise returned by the catch
        // is fulfilled with that value.
        //
        // Note that catch(onrejected) simply invokes then(undefined, onrejected)
        // internally, so all rules that apply to then method also apply to catch.
        Promise.reject()
            .catch(
                () => {
                    return "ABC";
                }
            )
            .then(
                (arg) => {
                    // This promise is fulfilled with the value that the promise
                    // returned by the previous then has been rejected with
                    expect(arg).toEqual("ABC");
                },
                () => {
                    // This promise mustn't be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onFulfilled handler doesn't return anything, the new promise
        // returned by 'then' method gets fulfilled with an 'undefined' value.
        Promise.resolve()
            .then(() => {})
            .then(
                (arg) => {
                    // The promise returned by the first 'then' call must be fulfilled
                    // with undefined (as first then's onFulfilled handler doesn't return
                    // a value)
                    expect(arg).toBeUndefined();
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onRejected handler doesn't return anything, the new promise
        // returned by 'then' method gets fulfilled with an 'undefined' value.
        Promise.reject()
            .then(
                undefined,
                () => {}
            )
            .then(
                (arg) => {
                    // The promise returned by the first 'then' call must be fulfilled
                    // with undefined (as first then's onRejected handler doesn't return
                    // a value)
                    expect(arg).toBeUndefined();
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If catch's handler doesn't return anything, the new promise returned
        // catch method gets fulfilled with an 'undefined' value.
        Promise.reject()
            .catch(() => {})
            .then(
                (arg) => {
                    // The promise returned by the first 'then' call must be fulfilled
                    // with undefined (as catch's handler doesn't return a value)
                    expect(arg).toBeUndefined();
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onFulfilled handler throws an error, the new promise returned
        // by 'then' method is rejected with the error as its value.
        Promise.resolve()
            .then(() => {
                throw new Error();
            })
            .then(
                () => {
                    // This promise must not be fulfilled (as the resolve handler
                    // of the first 'then' call throws an error)
                    expect(true).toBeFalse();
                },
                (arg) => {
                    // 'arg' must be instance of Error
                    expect(arg).toBeInstanceOf(Error);
                }
            );

        // If then's onRejected handler throws an error, the new promise returned
        // by 'then' method is rejected with the error as its value.
        Promise.reject()
            .then(
                undefined,
                () => {
                    throw new Error();
                }
            )
            .then(
                () => {
                    // This promise must not be fulfilled (as the onRejected handler of
                    // the first then call throws an error)
                    expect(true).toBeFalse();
                },
                (arg) => {
                    // 'arg' must be instance of Error
                    expect(arg).toBeInstanceOf(Error);
                }
            );

        // If catch's handler throws an error, the new promise returned by the catch
        // calls is rejected with the error as its value.
        Promise.reject()
            .catch(
                () => {
                    throw new Error();
                }
            )
            .then(
                () => {
                    // This promise must not be fulfilled (as the catch's handler throws
                    // an error)
                    expect(true).toBeFalse();
                },
                (arg) => {
                    // 'arg' must be instance of Error
                    expect(arg).toBeInstanceOf(Error);
                }
            );

        // If then's onFulfilled handler returns an already fulfilled promise, the
        // promise returned by 'then' call gets fulfilled with that promise's value
        // as its value.
        Promise.resolve()
            .then(() => {
                // Return an already fulfilled promise
                return Promise.resolve("ABCD");
            })
            .then(
                (arg) => {
                    // This promise must be fulfilled with the value that the promise
                    // returned by the onFulfilled handler of the first 'then' call
                    // was fulfilled with.
                    expect(arg).toEqual("ABCD");
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onRejected handler returns an already fulfilled promise, the
        // promise returned by 'then' call gets fulfilled with that promise's value
        // as its value.
        Promise.reject()
            .then(
                undefined,
                () => {
                    // Return an already fulfilled promise
                    return Promise.resolve("ABCD");
                }
            )
            .then(
                (arg) => {
                    // This promise must be fulfilled with the value that the promise
                    // returned by the onRejected handler of the first 'then' call
                    // was rejected with.
                    expect(arg).toEqual("ABCD");
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If catch's handler returns an already fulfilled promise, the promise returned
        // by the catch call gets fulfilled with that promise's value as its value.
        Promise.reject()
            .catch(
                () => {
                    // Return an already fulfilled promise
                    return Promise.resolve("ABCD");
                }
            )
            .then(
                (arg) => {
                    // This promise must be fulfilled with the value that the promise
                    // returned by the catch's handler was rejected with.
                    expect(arg).toEqual("ABCD");
                },
                () => {
                    // This promise must not be rejected
                    expect(true).toBeFalse();
                }
            );

        // If then's onFulfilled handler returns an already rejected promise, the
        // promise returned by 'then' call gets rejected with that promise's value
        // as its value.
        Promise.resolve()
            .then(() => {
                // Return an already rejected promise
                return Promise.reject("ABCDE");
            })
            .then(
                () => {
                    // This promise must not be fulfilled (as promise returned by the
                    // onFulfilled handler of the previous then call has been rejected).
                    expect(true).toBeFalse();
                },
                (arg) => {
                    expect(arg).toEqual("ABCDE");
                }
            );

        // If then's onRejected handler returns an already rejected promise, the
        // promise returned by 'then' call gets rejected with that promise's value
        // as its value.
        Promise.reject()
            .then(
                undefined,
                () => {
                    // Return an already rejected promise
                    return Promise.reject("ABCDE");
                }
            )
            .then(
                () => {
                    // This promise must not be fulfilled (as promise returned by the
                    // onRejected handler of the previous then call has been rejected).
                    expect(true).toBeFalse();
                },
                (arg) => {
                    expect(arg).toEqual("ABCDE");
                }
            );

        // If catch's handler returns an already rejected promise, the promise
        // returned by  the catch call gets rejected with that promise's value
        // as its value.
        Promise.reject()
            .catch(
                () => {
                    // Return an already rejected promise
                    return Promise.reject("ABCDE");
                }
            )
            .then(
                () => {
                    // This promise must not be fulfilled (as promise returned by the
                    // catch's handler has been rejected).
                    expect(true).toBeFalse();
                },
                (arg) => {
                    expect(arg).toEqual("ABCDE");
                }
            );

        // If then's onFulfilled handler returns a pending premise, the fulfillment/
        // rejection of the promise returned by then call comes after the fulfillment/
        // rejection of the promise returned by the handler. Also, the resolved value
        // of the promise returned by then will be the same as the resolve value of
        // of the promise returned by the handler.
        Promise.resolve()
            .then(() => {
                // Return a promise that will be rejected asynchronously once the
                // timeout expires.
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // Promise is fulfilled after the timeout expires.
                        reject("ABCDEF");
                    }, 100);
                });
            })
            .then(
                () => {
                    // This promise must not be fulfilled as the promise returned by
                    // the previous then's onFulfilled handler has been rejected.
                    expect(true).toBeFalse();
                },
                (arg) => {
                    // It must be rejected with the value that the promise returned
                    // by previous then call was rejected with.
                    expect(arg).toBe("ABCDEF");
                }
            );

        // If then's onRejected handler returns a pending premise, the fulfillment/
        // rejection of the promise returned by then call comes after the fulfillment/
        // rejection of the promise returned by the handler. Also, the resolved value
        // of the promise returned by then will be the same as the resolve value of
        // of the promise returned by the handler.
        Promise.reject()
            .then(
                undefined,
                () => {
                    // Return a promise that will be fulfilled asynchronously once the
                    // timeout expires.
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            // Promise is fulfilled after the timeout expires.
                            resolve("ABCDEF");
                        }, 100);
                    });
                }
            )
            .then(
                (arg) => {
                    // It must be fulfilled with the value that the promise returned
                    // by previous then call was fulfilled with.
                    expect(arg).toBe("ABCDEF");
                },
                () => {
                    // This promise must not be rejected as the promise returned by
                    // the previous then's onRejected handler has been fulfilled.
                    expect(true).toBeFalse();
                }
            );

        // If catch's handler returns a pending premise, the fulfillment/rejection of
        // the promise returned by catch call comes after the fulfillment/rejection
        // of the promise returned by the handler. Also, the resolved value of the
        // promise returned by catch call will be the same as the resolve value of
        // of the promise returned by the handler.
        //
        // Note that the promise returned by the last then call is returned from
        // the test. This notifies the Jasmin framework to wait for the promise to
        // resolve before proceeding.
        return Promise.reject()
            .catch(
                () => {
                    // Return a promise that will be rejected asynchronously once the
                    // timeout expires.
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            // Promise is fulfilled after the timeout expires.
                            reject("ABCDEF");
                        }, 100);
                    });
                }
            )
            .then(
                () => {
                    // This promise must not be fulfilled as the promise returned by
                    // the previous then's onRejected handler has been rejected.
                    expect(true).toBeFalse();
                },
                (arg) => {
                    // It must be rejected with the value that the promise returned
                    // by previous catch call was rejected with.
                    expect(arg).toBe("ABCDEF");
                }
            );
    });

    it('illustrates error handling when chaining promises', function () {
        // A simple case where a single promise fails
        // Start with a fulfilled promise
        Promise.resolve()
            // The promise returned by the onFulfilled handler of this then
            // is rejected. That also means that the promise returned by
            // then call is rejected as well.
            .then(
                () => Promise.reject("ABC")
            )

            // The promise returned by the previous 'then' has been rejected.
            // However, the following 'then' doesn't specify the onRejected
            // handler. If the promise that 'then' is called on gets into
            // the state (fulfilled or rejected) for which 'then' has no
            // handler, a new promise is created (with no additional handlers),
            // simply adopting the final state of the original promise on
            // which 'then' was called. Hence, another rejected promise is
            // created in this case and it replaces the promise object that
            // would otherwise be returned by 'then' call.
            .then(() => {
                // This won't run
                expect(true).toBeFalse();
                return Promise.resolve()
            })

            // The following 'catch' method is called on a rejected promise
            // from the previous step. As the promise is already in rejected
            // state, the catch handler will be executed at the end of the
            // current step of the even loop. The value with which the
            // promise returned by the first then's onFulfilled handler was
            // rejected with is the value provided to the catch handler.
            .catch((arg) => {
                expect(arg).toEqual("ABC");
            });


        // A more complex case where multiple promises fail
        // Start with a fulfilled promise
        Promise.resolve()
            // The promise returned by onFulfilled handler of following
            // 'then' is also fulfilled, which means that the promise
            // returned by the 'then' call will be fulfilled.
            .then(() => Promise.resolve())

            // The promise returned by the onFulfilled handler of the
            // following 'then' is rejected, which means that the promise
            // returned by 'then' is rejected as well.
            .then(() => Promise.reject("ABCD"))

            // The promise returned by the previous 'then' has been rejected,
            // but as next 'then' call doesn't specify the onRejected handler
            // a new rejected promise is created. Note that the fact that
            // onFulfilled handler of this 'then' returns a fulfilled promise
            // has no effect.
            .then(() => {
                // This mustn't run
                expect(true).toBeFalse();
                return Promise.resolve("DCBA");
            })

            // The last 'then' call also has no onRejected handler, which means
            // that a new promise is created that replaces the promise that
            // would otherwise be returned by this 'then'. Note that the fact
            // than onFulfilled handler of this 'then' returns a rejected
            // promise has no effect.
            .then(() => {
                // This mustn't run
                expect(true).toBeFalse();
                return Promise.reject("OPOP")
            })

            // The 'catch' call is called on the rejected promise from the
            // previous 'then'. It's handler is invoked at the end of the
            // current step of the event loop. Note that the value passed
            // to it is the value of the very first rejected promise in
            // the chain.
            .catch((arg) => expect(arg).toEqual("ABCD"));


        // This example is similar to the previous one, the only difference
        // being that timeouts are used here to simulate the real-world
        // scenario where promises will be resolved asynchronously. Note
        // that a promise object is returned from the test to instruct the
        // Jasmine framework to wait on it before completing the test. This
        // makes sure Jasmine framework waits for the asynchronous work to
        // complete.
        //
        // Start with a fulfilled promise
        return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 50);
            })

            // The promise returned by onFulfilled handler of following
            // 'then' will be fulfilled after the timeout, which means that
            // the promise returned by the 'then' call will be fulfilled too.
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 50);
                });
            })

            // The promise returned by the onFulfilled handler of the following
            // 'then' will be rejected after the timeout which means that the
            // promise returned by 'then' will be rejected as well.
            .then(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject("ABCD");
                    }, 50);
                });
            })

            // The promise returned by the previous 'then' will be rejected
            // after the timeout, but as next 'then' call doesn't specify
            // the onRejected handler a new rejected promise is created.
            // Note that the fact that onFulfilled handler of this 'then'
            // returns a promise that will be fulfilled has no effect. This
            // handler won't run at all.
            .then(() => {
                // This mustn't run at all
                expect(true).toBeFalse();

                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("DCBA");
                    }, 50);
                });
            })

            // The next 'then' call also has no onRejected handler, which means
            // that a new promise is created that replaces the promise that
            // would otherwise be returned by this 'then'. Note that the fact
            // than onFulfilled handler of this 'then' returns a promise that
            // will be rejected has no effect. This handler won't run at all.
            .then(() => {
                // This musn't run at all
                expect(true).toBeFalse();

                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject("OPOP");
                    }, 50);
                });
            })

            // The 'catch' is called on the promise from the previous 'then'
            // call. It's handler will be invoked after the promise gets
            // rejected. This will happen as soon as the very first promise
            // to be rejected gets resolved. As the two first promises will
            // both fulfill after the timeout of 100 ms (2 times 50 ms) and
            // the third will fail after the timeout of 50 ms, the catch
            // handler will be invoked in about 150 ms. Note that the value
            // passed to it is the value of the very first rejected promise
            // in the chain.
            .catch((arg) => expect(arg).toEqual("ABCD"));
    });

    it('illustrates waiting for all promises with Promise.all', function () {
        // Wait for multiple promises all of which are fulfilled
        Promise
            .all([
                Promise.resolve(0),
                Promise.resolve(1),
                Promise.resolve(2)
            ])
            .then(results => expect(results).toEqual([0, 1, 2]));

        // Wait for multiple promises where a single promise gets rejected
        Promise
            .all([
                Promise.resolve(0),
                Promise.reject(new Error()),
                Promise.resolve(2)
            ])
            .then(() => expect(true).toBeFalse())
            .catch(error => expect(error).toBeInstanceOf(Error));

        // Wait for multiple promises where more than one promise gets rejected
        Promise
            .all([
                Promise.resolve(0),
                Promise.reject("ABCD"),
                Promise.resolve(2),
                Promise.reject("DCBA")
            ])
            .then(() => expect(true).toBeFalse())
            .catch(error => {
                // The error passed to catch's handler is the error with
                // which the first rejected promise in the array was
                // resolved with.
                expect(error).toEqual("ABCD");
            });
    });

    it('illustrates waiting for any promise with Promise.race', function () {
        // Return the aggregated promise back to Jasmine to instruct it
        // to wait for all the promises before it can complete the test.
        return Promise.all([
            // TEST 1: The second promise resolves (is fulfilled) first
            Promise
                .race([
                    // The first promise is rejected after 100 ms
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject("ABCD");
                        }, 100);
                    }),

                    // The second promise is fulfilled after 50 ms
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("DCBA");
                        }, 50);
                    }),

                    // The third promise is fulfilled after 100 ms
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("FAFA");
                        }, 100);
                    })
                ])
                .then(result => {
                    // Must be the value that the second promise was fulfilled with
                    expect(result).toEqual("DCBA");
                })
                .catch(() => expect(true).toBeFalse()),

            // TEST 2: The third promise resolves (is rejected) first
            Promise
                .race([
                    // The first promise is fulfilled after 100 ms
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve("ABCD");
                        }, 100);
                    }),

                    // The second promise is rejected after 150 ms
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject("BBBB");
                        }, 150);
                    }),

                    // The third promise is rejected after 50 ms
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject("CCCC");
                        }, 50);
                    }),

                    // The fourth promise is fulfilled after 200 ms
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve("DBDB");
                        }, 200);
                    })
                ])
                .then(() => expect(true).toBeFalse())
                .catch(result => {
                    // The value must correspond to the value that the third
                    // promise was rejected with
                    expect(result).toEqual("CCCC");
                })
        ]);
    });
});