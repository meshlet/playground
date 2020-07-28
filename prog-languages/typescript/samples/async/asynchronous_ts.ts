/**
 * Illustrates asynchronous and concurrent programing with TypeScript.
 */

import "mocha";
import { expect } from "chai";
import { EventEmitter, once } from "events";
import { Worker } from "worker_threads";
import { TypeSafeEmitter } from "./type_safe_emitter";

describe("Asynchronous TypeScript", function () {
    it('illustrates implementing simple Promise class', function () {
        // The type of the function that is invoked by the Promise
        // constructor. Constructor passes `resolve` and `reject`
        // functions to this executor
        type Executor<T> = (
            resolve: (value?: T) => void,
            reject: (error?: unknown) => void
        ) => void;

        // A simplified promise class
        // TODO: this Promise implementation loads the JavaScript VM quite a lot
        //       by repeatedly scheduling timeouts to check the status of promises.
        //       Find a way to do this more efficiently
        // TODO: type safety needs to be improved. In the current implementation,
        //       parameter types in onFulfilled and onRejected callbacks (probably
        //       in other places too) are resolved as any or unknown in many cases
        //       providing no type safety.
        class SimplePromise<T> {
            // Whether the promise has been resolved or rejected
            private resolved: boolean = false;
            private rejected: boolean = false;

            // The value set by the resolve callback
            private value?: T = undefined;

            // The error set by the reject callback
            private error: unknown = null;

            constructor(f: Executor<T>) {
                // Invoke the executor callback straight away and pass it
                // resolve and reject callbacks
                f(
                    (successValue?: T) => {
                        this.value = successValue;
                        this.resolved = true;
                    },
                    (error: unknown) => {
                        this.error = error;
                        this.rejected = true;
                    }
                );
            }

            // `then` method registers the callback to be executed once the Promise
            // is resolved. The method returns a new Promise which will be resolved or
            // rejected depending on the outcome of this Promise as well as the promise
            // returned from the onFulfilled handler (if any).
            // TODO: Note that onFulfilled handler can either return a Promise or not
            //       return a value at all. This should be extended to allow handler
            //       to return a non-promise value which would behave the same as returning
            //       an already resolved Promise with that value.
            // TODO: `then` method should also accept the onRejected callback so that
            //       user may avoid calling the `catch` method.
            then<U>(onFulfilled: (value?: T) => SimplePromise<U> | void): SimplePromise<U> {
                // Store reference to `this` Promise
                const thisArg = this;

                // Return a new Promise used for chaining calls. The new Promise will be
                // resolved/rejected depending on the outcome of `this` promise as well
                // as the promise returned (if any) by the onFulfilled callback
                return new SimplePromise<U>((resolve, reject) => {
                    // Promise processing is deferred to the next iteration of the event
                    // loop. It might take arbitrary long time until `this` promise is
                    // resolved/rejected
                    setTimeout(function handler() {
                        if (thisArg.resolved) {
                            // `this` promise is now resolved. Invoke the onFulfilled
                            // callback
                            const result = onFulfilled(thisArg.value);
                            if (typeof result !== "undefined") {
                                // onFulfilled callback returned another promise. Register
                                // onFulfilled and onRejected callbacks on it. The outcome
                                // of the promise returned by `this` promise's then method
                                // now depends on the outcome of promise returned by the
                                // onFulfilled callback.
                                result
                                    .then(value => resolve(value))
                                    .catch(error => reject(error));
                            }
                            else {
                                // onFulfilled callback didn't return a value. Resolve the
                                // returned promise without arguments
                                resolve();
                            }
                        }
                        else if (thisArg.rejected) {
                            // `this` promise has been rejected so reject the promise
                            // returned by `then` method
                            // TODO: once `then` is modified to accept onRejected callback
                            //       this will look similar to the previous IF block
                            reject(thisArg.error);
                        }
                        else {
                            // The promise hasn't be resolved or rejected yet. Schedule
                            // another check later
                            setTimeout(handler);
                        }
                    });
                });
            }

            // `catch` method registers the onRejected callback which is executed
            // if/when the Promise gets rejected. The method returns a new Promise
            // which will be resolved or rejected depending on the outcome of this
            // Promise as well as the promise returned from the onRejected handler
            // (if any).
            // TODO: Note that onRejected handler can either return a Promise or not
            //       return a value at all. This should be extended to allow handler
            //       to return a non-promise value which would behave the same as
            //       returning an already resolved Promise with that value.
            catch<U>(onRejected: (error: unknown) => SimplePromise<T | U> | void)
                : SimplePromise<T | U> {

                // Save reference to `this` promise
                const thisArg = this;

                // Return a new Promise that will be resolved or rejected depending
                // on the outcome of `this` promise and a promise returned by the
                // onRejected callback (if any)
                return new SimplePromise<T | U>((resolve, reject) => {
                    // Promise processing is deferred to the next iteration of the event
                    // loop. It might take arbitrary long time until `this` promise is
                    // resolved/rejected
                    setTimeout(function handler() {
                        if (thisArg.resolved) {
                            // `this` promise has been resolved so resolve the promise
                            // returned by `catch` method too.
                            resolve(thisArg.value);
                        }
                        else if (thisArg.rejected) {
                            // `this` promise has been rejected so invoke the onRejected
                            // callback with the error
                            const result = onRejected(thisArg.error);
                            if (typeof result !== "undefined") {
                                // onRejected callback returned another promise. The outcome
                                // of the promise returned by `catch` method now depends on
                                // the outcome of this new promise
                                result
                                    .then(value => resolve(value))
                                    .catch(error => reject(error));
                            }
                            else {
                                // onRejected callback didn't return a value. Resolve the
                                // callback returned by `catch` without argument
                                resolve();
                            }
                        }
                        else {
                            // The promise hasn't be resolved or rejected yet. Schedule
                            // another check
                            setTimeout(handler);
                        }
                    });
                });
            }

            // Returns an already resolved promise
            static resolved<T>(value: T): SimplePromise<T> {
                return new SimplePromise<T>(resolve => resolve(value));
            }

            // Returns an already rejected promise
            static rejected(error: unknown): SimplePromise<unknown> {
                return new SimplePromise<unknown>((resolve, reject) => reject(error));
            }
        }

        // Return a promise that informs Mocha framework to wait until asynchronous
        // works is completed (that is, promise gets resolved or rejected) before
        // executing the rest of the tests.
        return new Promise((outerResolve) => {
            const log: any[] = [];

            // The first promise resolves after at least 50 ms
            new SimplePromise<number>(resolve => {
                setTimeout(() => {
                    resolve(342);
                }, 50);
            })
                .catch(() => {
                    log.push("catch 1");
                })
                .then(value => {
                    log.push(value);

                    // This promise rejects after at least 35 ms
                    return new SimplePromise<string>((resolve, reject) => {
                        setTimeout(() => {
                            reject("error");
                        }, 35);
                    });
                })
                .catch(error => {
                    log.push(error);

                    // Return an already resolved promise
                    return SimplePromise.resolved("abcd");
                })
                .then(value => {
                    log.push(value);
                    expect(log).to.deep.equal([342, "error", "abcd"]);

                    // Let Mocha know that all async work is done
                    outerResolve();
                });
        });
    });

    it('illustrates implementing safe event emitters with mapped types', function () {
        // Assume we have a database client that can be used to listen on
        // a number of events. The type of the value passed to the event
        // handler depends on the event
        type NaiveDbClient = {
            on(event: "ready", cb: () => void): void
            on(event: "error", cb: (error: Error) => void): void
            on(event: "reconnecting", cb: (params: { attempt: number, delay: number}) => void): void
        };

        // While this gives the type safety, it's quite cumbersome to write. Mapped
        // types can be used to simplify the code significantly.
        // We first define a shape that lists all the supported events along with
        // the types of values that will be passed to event handlers for those events
        type Events = {
            ready: void
            error: Error
            reconnecting: { attempt: number, delay: number }
        };

        // We then map these Events to generate an `on` overload for each possible
        // event type
        interface ImprovedDbClient {
            on<E extends keyof Events>(
                event: E,
                cb: (arg: Events[E]) => void
            ): void;
        }

        class ImprovedDbClientImpl implements ImprovedDbClient {
            on<E extends keyof Events>(
                event: E,
                cb: (arg: Events[E]) => void
            ): void {

            }
        }

        const v: ImprovedDbClient = new ImprovedDbClientImpl();
        v.on("error", (error: Error) => {});
        // v.on("ready", (arg: number) => {}); // number not assignable to void
    });

    /**
     * The workers communication is by default type-unsafe. Data passed between
     * threads is treated as any/unknown by TypeScript. This sample illustrates
     * how to make this type-unsafe API type-safe.
     *
     * The sample implements a simple messaging layer for a chat client, which
     * will be run by a worker thread.
     */
    it('illustrates type-safe multithreading with worker threads', async function () {
        // Define some helper types
        type Message = string;
        type ThreadId =number;
        type UserId = number;
        type Participants = UserId[];

        // Define all the command types that main thread can send to worker threads
        type Commands = {
            sendMessageToThread: [ThreadId, Message]
            createThread: [Participants]
            addUserToThread: [ThreadId, UserId]
            removeUserFromThread: [ThreadId, UserId]
        };

        // Define all the event typs that worker threads send back to the main thread
        type Events = {
            receivedMessage: [ThreadId, UserId, Message]
            createdThread: [ThreadId, Participants]
            addedUserToThread: [ThreadId, UserId]
            removedUserFromThread: [ThreadId, UserId]
        };

        const log: string[] = [];

        // The following TypeSafeEmitter is used to re-emit the events received
        // from the worker. It's only purpose is to provide type-safety
        const eventEmitter = new TypeSafeEmitter<Events>();

        // The following TypeSafeEmitter is used to provide type-safety when
        // sending commands to the worker
        const commandEmitter = new TypeSafeEmitter<Commands>();

        // Create the worker thread
        const worker = new Worker("./samples/async/worker1.js");

        // Listen for events sent by the worker and re-emit them using the
        // eventEmitter type-safe emitter. This only adds a layer of type-
        // safety
        worker.on(
            "message",
            <K extends keyof Events>(value: { type: K, data: Events[K] }) => {

            eventEmitter.emit(value.type, ...value.data);
        });

        // Register listeners for events sent by the worker thread
        eventEmitter.on("createdThread", (threadId, participants) => {
            log.push(threadId.toString() + "," + participants.join(","));

            // Now that thread has been created send a message to it
            commandEmitter.emit("sendMessageToThread", threadId, "very important message");
        });

        eventEmitter.on("receivedMessage", (threadId, userId, message) => {
            log.push(threadId.toString() + "," + userId.toString() + "," + message);

            // Terminate the worker
            worker.terminate();
        });

        // Register listeners for commands sent by the main thread. These
        // listeners simply forward the commands to the worker thread
        commandEmitter.on("createThread", (...data) => {
            worker.postMessage({ type: "createThread", data });
        });

        commandEmitter.on("sendMessageToThread", (...data) => {
            worker.postMessage({ type: "sendMessageToThread", data });
        });

        // Send `createThread` command to the worker
        commandEmitter.emit("createThread", [34, 234]);

        // Wait for the worker to exit
        await once(worker, "exit");

        // Assert that log contains expected entries
        expect(log).to.deep.equal([
            "100,34,234",
            "100,342,response message"
        ]);
    });
});