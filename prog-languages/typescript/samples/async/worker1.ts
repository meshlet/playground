/**
 * A worker thread used by asynchronous_ts.ts.
 */

import { parentPort, isMainThread } from "worker_threads";
import { TypeSafeEmitter } from "./type_safe_emitter";

// This is only to prevent Mocha from executing this file. As this
// is supposed to be run as a worker thread, runtime errors will
// occur if run as a normal script
if (!isMainThread && parentPort) {
    // TODO: these type definitions are the exactly same as ones used in
    //       the main file so should be put into one place.
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

    // The following TypeSafeEmitter is used to provide type-safety when
    // sending events to the main thread
    const eventEmitter = new TypeSafeEmitter<Events>();

    // The following TypeSafeEmitter is used to re-emit the events received
    // from the main thread. It's only purpose is to provide type-safety
    const commandEmitter = new TypeSafeEmitter<Commands>();

    // Listen for commands sent by the main thread and re-emit them using the
    // commandEmitter type-safe emitter. This only adds a layer of type-
    // safety
    parentPort.on(
        "message",
        <K extends keyof Commands>(value: { type: K, data: Commands[K] }) => {
            commandEmitter.emit(value.type, ...value.data);
        });

    // Register listeners for commands sent by the main thread
    commandEmitter.on("createThread", participants => {
        // Send an event back to the main thread confirming that thread
        // has been created
        eventEmitter.emit("createdThread", 100, participants);
    });

    commandEmitter.on("sendMessageToThread", (threadId, message) => {
        // Send a response message
        eventEmitter.emit("receivedMessage", threadId, 342, "response message");
    });

    // Register listeners for some events sent by the worker thread. These
    // listeners simply forward the data to the main thread
    eventEmitter.on("createdThread", (...data) => {
        parentPort!.postMessage({ type: "createdThread", data });
    });

    eventEmitter.on("receivedMessage", (...data) => {
        parentPort!.postMessage({ type: "receivedMessage", data });
    });
}


