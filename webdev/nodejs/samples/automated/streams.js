/**
 * Illustrates the NodeJS stream module and implementing custom
 * streams using the stream API. Built-in NodeJS streams are
 * illustrated as part of their own samples. For example, file
 * streams are illustrated in webdev/samples/automated/file_system.js.
 * Stream API is also implemented by http/https, TCP socket, zlib,
 * crypto and process (stdin, stdout, stderr) classes.
 */
const { Writable, Readable, Duplex, Transform, pipeline } = require("stream");
const { once } = require("events");
const util = require("util");
const finished = util.promisify(require("stream").finished);
const assert = require("assert").strict;

describe("Streams", function () {
    // Simple writable stream that allows user to specify whether strings
    // are automatically decoded to Buffers by the `write` method before
    // passing them to the internal `_write` method.
    // If user attempts to write the string `ERROR` to the stream,
    // an error will be raised.
    class SimpleWritable extends Writable {
        constructor(decodeStrings) {
            super({
                decodeStrings: decodeStrings
            });

            // Serves as a destination for this stream. In real-world
            // writable stream, this could be a file or a network socket.
            this._data = [];
        }

        // Implement the `_write` method that is used to send a chunk of data
        // to the underlying resource. This method is called by the public
        // `write` method.
        _write(chunk, encoding, callback) {
            if (chunk === "ERROR") {
                // Report an error by invoking callback with the error
                // argument
                callback(new Error("error"));
            }
            else {
                // Otherwise, write chunk to the underlying resource and
                // invoke callback with null argument (indicates success)
                if (Buffer.isBuffer(chunk) && !this.writableObjectMode) {
                    this._data.push(...chunk);
                }
                else {
                    this._data.push(chunk);
                }

                callback();
            }
        }
    }

    // Writable implementation that delays writes to the underlying resource.
    // This class simulates the real-world scenario where a call to `write`
    // doesn't immediately result in chunk being written to the underlying
    // resource. Instead, the data is written and the the write completed
    // callback invoked at later point in time - in the case of this stram
    // implementation, once `flush` method is called. Thus, the internal
    // buffer will keep growing with each `write` call until `flush` is
    // called
    class DelayedWritable extends Writable {
        constructor(options = {}) {
            super(options);

            // Each call to `_write` will add a new entry to this
            // array - an object with `chunk` and `writeCallback`
            // property. Invoking the write callback is what lets
            // the base class know that write has been fully
            // processed, hence not invoking it essentially simulates
            // the postponed writes. These writes are completed
            // once the `flush` method is invoked
            this._delayedWrites = [];

            // The array of bytes write via this stream. This acts
            // as a underlying resource to which the data is written
            // to
            this._data = [];
        }

        _write(chunk, encoding, callback) {
            // The chunk write is postponed. As the write callback is
            // not invoked the internal buffer in the base class will
            // grow with call to `write`
            this._delayedWrites.push({
                chunk: chunk,
                chunkWrittenCallback: callback
            });
        }

        // In real-world scenario, the completion of writes would
        // depend on the underlying resource (for example, a network
        // socket or a file). The purpose of this method is to mock
        // this behavior by flushing all the outstanding write
        // operations, which will in turn invoke the write callbacks
        // and free the base class' internal buffer
        flush() {
            for (const delayedWrite of this._delayedWrites) {
                // Write data to the underlying resource (or in this case
                // the `data` array). Spread the Buffer when writing it
                // only if the stream is not in object-mode
                if (Buffer.isBuffer(delayedWrite.chunk) && !this.writableObjectMode) {
                    this._data.push(...delayedWrite.chunk);
                }
                else {
                    this._data.push(delayedWrite.chunk);
                }

                // Invoke the write callback without arguments indicating
                // success
                delayedWrite.chunkWrittenCallback();
            }

            // Clear the _delayedWrites array
            this._delayedWrites = [];
        }
    }

    // An asynchronous writable stream where each write is completed
    // asynchronously with the specified delay. Only after at least
    // the `writeDelay` time has passed will the data be written to
    // the underlying resource.
    class AsynchronousWritable extends Writable {
        constructor(writeDelay, options = {}) {
            super(options);

            // Represents the underlying resource to which the data is
            // written to. In a real-world scenario, this could be a file
            // descriptor or a network socket
            this._data = [];

            // The delay in milliseconds between invoking the `write` (or
            // more precisely the internal `_write`) method and the data
            // getting written to the underlying resource
            this._writeDelay = writeDelay;
        }

        _write(chunk, encoding, callback) {
            // The write is completed with at least `this._writeDelay` delay
            setTimeout(() => {
                if (chunk === "WRITE_ERROR") {
                    // Simulates a write error. The error is reported by
                    // invoking callback with the error argument
                    callback(new Error("error"));
                }
                else {
                    // Otherwise, write chunk to the underlying resource and
                    // invoke callback with null argument (indicates success)
                    if (Buffer.isBuffer(chunk) && !this.writableObjectMode) {
                        this._data.push(...chunk);
                    }
                    else {
                        this._data.push(chunk);
                    }

                    callback();
                }
            }, this._writeDelay);
        }
    }

    // Simple readable stream that allows user to specify whether Buffers
    // should be encoded to strings before passed on to the user. If encoding
    // is not null, it is used to encode Buffer to the string which is then
    // returned to the user.
    // If `_read` method reads string `ERROR` from the underlying resource,
    // it will raise an error.
    class SimpleReadable extends Readable {
        constructor(encoding) {
            super({
                encoding: encoding
            });

            // Represents the underlying resource from which the data
            // read. In real-world scenario this could be a file descriptor
            // or a network socket
            this._data = [];
        }

        // `_read` method is invoked by the public `read` to read data from
        // the underlying resource and push it into the internal read buffer
        // which is then read by the consumers. The `size` argument represents
        // the number of bytes to read and is only advisory - the implementation
        // is free to ignore it.
        _read(size) {
            // Push all the available data to the internal read buffer using
            // the `push` method
            for (const chunk of this._data) {
                if (chunk === "ERROR") {
                    // Raise an error by invoking the `destroy` method with
                    // an error argument. Note that the loop will continue
                    // running even in case of error. However, `push` method
                    // will ignore all the chunks passed it after `destroy`
                    // is called on the stream
                    this.destroy(new Error("error"));
                }
                else {
                    // Push the chunk to the stream's internal buffer. The encoding argument
                    // is used to decode string into the Buffer before writing it to the
                    // internal buffer. Note that that the Buffer data may then be encoded
                    // back to string before returning data to the user if `encoding` option
                    // passed to the constructor is not null.
                    // Assumption is made here that strings pushed with `push` method should
                    // always be decoded using the UTF-8 encoding.
                    this.push(chunk, "utf8");
                }
            }

            // Clear the data that's been pushed into the internal read
            // buffer
            this._data = [];
        }

        // A helper method that simulates more data appearing in the underlying
        // resource. In real-world application, this could be additional data
        // arriving via the network.
        //
        // Note that this method also invokes `_read` method to push more data
        // to the internal buffer. This is required to inform the base class
        // that new data is available at which point the the base class will
        // pass the data to the consumers (e.g. via the `readable` event).
        generateData(chunks) {
            // Must be an array of chunks
            assert.ok(Array.isArray(chunks));

            // Add chunks to the underlying resource buffer
            for (const chunk of chunks) {
                this._data.push(chunk);
            }

            // Push the new chunks to the internal buffer which will inform
            // the base class that new data is available
            this._read();
        }
    }

    // An asynchronous readable stream that reads data from the underlying
    // resource and asynchronously pushes it to the internal read buffer.
    // The process of reading data from the underlying resource is started
    // by when the base class invokes the internal `_read` method. Note that
    // each chunk is read from the underlying resource and then pushed to
    // the internal buffer after the specified delay has elapsed. This
    // simulates a real-world scenario where reading from the underlying
    // resources might take some time. The reading will automatically stop if:
    //
    // - the readable stream is ended (which happens when null
    //   is read from the underlying resource and pushed to the
    //   internal buffer)
    // - the error is encountered when reading from the underlying
    //   resource (or in this case, a string `READ_ERROR` is read)
    // - the error is destroyed by calling the `destroy` method
    // - the `push` method returns false (back pressure) which
    //   indicates that the internal buffer has exceeded the set
    //   highWaterMark. Note that reading from the underlying
    //   resource will be continued at later time once the internal
    //   buffer frees up.
    class AsynchronousReadable extends Readable {
        constructor(readDelay, options) {
            super(options);

            // The delay in milliseconds between pushing chunks of
            // data to the internal read buffer.
            this._readDelay = readDelay;

            // Simulates the underlying resource from which the data is
            // read and pushed into the stream's internal buffer. In a
            // real-world scenario this could be a file descriptor or
            // a network socket.
            this._data = [];
        }

        _read(size) {
            assert.ok(Array.isArray(this._data));
            const thisArg = this;

            // Schedule a timeout that reads next chunk from the underlying resource
            (function readNextChunk() {
                // Every underlying resource read is delayed by `_readDelay`
                setTimeout(() => {
                    if (thisArg.readableEnded || thisArg.destroyed) {
                        // If the stream has ended or has been destroyed stop scheduling
                        // read chunk timeouts
                        return;
                    }

                    if (thisArg._data.length === 0) {
                        // If underlying resource has no data simply schedule another
                        // timeout that will attempt to read the next chunk later
                        readNextChunk();
                    }
                    else {
                        // Read the next chunk of data from the underlying resource.
                        // Make sure to remove the chunk so that we don't end up in
                        // an endless loop reading the same chunk forever
                        const chunk = thisArg._data.shift();

                        // If chunk is equal to the string `READ_ERROR` pass an error
                        // to the `destroy` method and stop reading from the underlying
                        // resource
                        if (chunk === "READ_ERROR") {
                            thisArg.destroy(new Error("read error"));
                            return;
                        }

                        // Push chunk to the internal buffer. An assumption is made
                        // that UTF-8 should always be used to decode strings into
                        // Buffers when they are written to the internal buffer.
                        // If the internal buffer has become bigger that the highWaterMark
                        // don't schedule the next read timeout. Otherwise, schedule the
                        // timeout that will read next chunk from the underlying resource
                        if (thisArg.push(chunk, "utf8")) {
                            readNextChunk();
                        }
                    }
                }, thisArg._readDelay);
            })();
        }
    }

    // Implements a simple Duplex stream that will write each incoming
    // chunk of data to the underlying write resource right away, and
    // will push all the available chunks from the underlying read
    // resource to the internal read buffer in one call to `_read`.
    // The stream can report errors both on write and read side
    class SimpleDuplex extends Duplex {
        constructor(options) {
            super(options);

            // Represents readable stream's underlying resource. In real-world
            // scenario this could for instance be a network socket
            this._readResource = [];

            // Represents writable stream's underlying resource. In real-world
            // scenario this could for instance be a network socket
            this._writeResource = [];
        }

        // The `_write` method implements the Writable interface of this
        // duplex stream
        _write(chunk, encoding, callback) {
            if (chunk === "WRITE_ERROR") {
                // Simulate the write error if `WRITE_ERROR` string is written
                // to the stream
                callback(new Error("write error"));
            } else {
                // Otherwise, write the chunk to the underlying write resource
                // and invoke the callback without arguments to indicate success
                if (Buffer.isBuffer(chunk) && !this.writableObjectMode) {
                    this._writeResource.push(...chunk);
                } else {
                    this._writeResource.push(chunk);
                }

                callback();
            }
        }

        // The `_read` method implements the Readable interface of this duplex
        // stream
        _read(size) {
            // Push each chunk from the read resource to the internal read
            // buffer
            for (const chunk of this._readResource) {
                if (chunk === "READ_ERROR") {
                    // Raise an error by invoking the `destroy` method with
                    // an error argument. Note that the loop will continue
                    // running even in case of error. However, `push` method
                    // will ignore all the chunks passed it after `destroy`
                    // is called on the stream
                    this.destroy(new Error("read error"));
                } else {
                    // Push the chunk to the stream's internal buffer. The encoding argument
                    // is used to decode string into the Buffer before writing it to the
                    // internal buffer. Note that that the Buffer data may then be encoded
                    // back to string before returning data to the user if `encoding` property
                    // of the options objects passed to the constructor is not null.
                    // Assumption is made here that strings pushed with `push` method should
                    // always be decoded using the UTF-8 encoding.
                    this.push(chunk, "utf8");
                }
            }
        }
    }

    // A simple transform stream that will transform each chunk it receives
    // by pushing it twice to the internal read buffer. The stream also
    // implements the `_flush` method and allows the user to specify what
    // data to append as the last chunk written to the internal buffer.
    class SimpleTransform extends Transform {
        constructor(options, tailData) {
            super(options);

            // The last chunk of data to be pushed to the internal read
            // buffer `end` event is emitted for the readable side of the
            // stream
            this._tailData = tailData;
        }

        // `_transform` method is invoked for each chunk of data read from
        // the underlying read resource. The `push` method should be used
        // to transform the given chunk into 1 or more chunks that are then
        // pushed to the internal read buffer. Note that it's legal to skip
        // calling `push` for some of the chunks. Such chunks will be ignored
        // and won't be passed on to the writable stream.
        _transform(chunk, encoding, callback) {
            if (chunk === "TRANSFORM_ERROR") {
                // Report an error
                callback(new Error("transform error"));
            }
            else {
                // The chunks is transformed by pushing the same chunk to the
                // internal twice. An assumption is made that if chunk is a
                // string, it should be decoded using UTF-8 encoding when
                // it is written to the internal read buffer
                this.push(chunk, "utf8");
                this.push(chunk, "utf8");

                // Inform the base class that the current chunk has been transformed
                callback();
            }
        }

        // `_flush` method is invoked once there's no more data to read from
        // the underlying read resource (e.g. null has been pushed to the
        // readable side of the stream) but before the `end` event is emitted.
        // Thus, this method can be used to push the last piece of data to the
        // internal read buffer before the stream ends
        _flush(callback) {
            if (this._tailData === "FLUSH_ERROR") {
                // Report an error that occurs during the `_flush` operation
                callback(new Error("flush error"));
                return;
            }

            if (this._tailData != null) {
                // If last chunk is a string make sure its decoded to a Buffer using
                // UTF-8 encoding
                this.push(this._tailData, "utf8");
            }

            callback();
        }
    }

    it('illustrates custom Writable stream with auto string -> Buffer conversion', function () {
        const writable = new SimpleWritable(true);

        // Encoding informs the `write` method how to decode the string
        // to Buffer. For instance, ½ character decodes to a single byte
        // with latin1 and two bytes with UTF-8 encoding.
        writable.write("½", "latin1");
        writable.write("Æ", "utf8");
        writable.write("Ð", "latin1");

        // End the stream and pass it one last chunk of data to be written
        // out before the stream is ended
        writable.end("½", "utf8");

        // Verify data written to the underlying resource
        assert.deepEqual(writable._data, [
            ...Buffer.from("½", "latin1"),
            ...Buffer.from("Æ", "utf8"),
            ...Buffer.from("Ð", "latin1"),
            ...Buffer.from("½", "utf8")
        ]);
    });

    it('illustrates error handling in custom Writable stream', function () {
        // Don't decode strings to Buffers before passing them to `_write`
        const writable = new SimpleWritable(false);
        let isErrorListenerInvoked = false;

        // Register the `error` event listener
        writable.on("error", err => {
            assert.deepEqual(err, new Error("error"));
            isErrorListenerInvoked = true;
        });

        // Write a string `ERROR` to the stream for which an error will
        // be raised. Note, however, that no error will be thrown by
        // the `write` method because the `error` event has the registered
        // listener
        assert.doesNotThrow(() => {
            writable.write("ERROR", "utf8");
        });

        // `error` event should've been emitted and its listener executed
        assert.ok(isErrorListenerInvoked);
        writable.end();
        assert.deepEqual(writable._data, []);
    });

    it('illustrates custom Writable stream with `_writev` method', async function () {
        // The custom string that implements the `_writev` method, used
        // to write multiple chunks to the underlying resource
        class CustomWritable extends Writable {
            constructor() {
                super({
                    // Dont decode strings
                    decodeStrings: false
                });

                // Serves as a destination for this stream. In real-world
                // writable stream, this could be a file or a network socket.
                this._data = [];
            }

            // Implement the `_write` method that is used to send a chunk of data
            // to the underlying resource. This method is called by the public
            // `write` method.
            _write(chunk, encoding, callback) {
                // Write chunk to the underlying resource and invoke callback
                // with null argument (indicates success)
                this._data.push(chunk);
                callback();
            }

            // Implement the `_writev` that is invoked by the base Writable class
            // if there are multiple buffered chunks waiting to be written. This
            // happens if application invokes writable.cork() followed by several
            // writes followed by writable.uncork(). At that moment, the `_writev`
            // is invoked to handle all available chunks ((if `writev` isn't
            // implemented`_write` is invoked for each chunk)
            _writev(chunks, callback) {
                for (const {chunk} of chunks) {
                    // Write chunk to the underlying resource
                    this._data.push(chunk);
                }

                // All chunks have been written so invoke the callback without
                // arguments to signal success
                callback();
            }
        }

        const actionLog = [];
        const writable = new CustomWritable();

        // Cork the stream so that the writes are buffer in base class internal
        // buffer
        writable.cork();

        // Write several chunks of data. Note that each of the callbacks
        // passed to the write calls will be invoked once the stream is
        // uncorked. Note that these callbacks are invoked asynchronously
        // and not as part of the stream.uncork() call. Hence we wrap the
        // writes in a promise that is resolved once the last write's
        // callback is executed - the callbacks will be executed in the
        // order their respective writes have been invoked.
        const writeCallbackPromise = new Promise(resolve => {
            writable.write("A", "utf8", () => {
                actionLog.push("chunk A");
            });
            writable.write("B", "utf8", () => {
                actionLog.push("chunk B");
            });
            writable.write("C", "utf8", () => {
                actionLog.push("chunk C");
                resolve();
            });
        });

        // Uncork the stream causing it to write out the buffer data
        actionLog.push("before uncork");
        writable.uncork();
        actionLog.push("after uncork");

        // End the stream and verify the written data
        writable.end();
        assert.deepEqual(writable._data, ["A", "B", "C"]);

        // Write callbacks have not executed yet
        assert.deepEqual(actionLog, [
            "before uncork",
            "after uncork"
        ]);

        // Wait for write callbacks to execute
        await writeCallbackPromise;
        assert.deepEqual(actionLog, [
            "before uncork",
            "after uncork",
            "chunk A",
            "chunk B",
            "chunk C"
        ]);
    });

    it('illustrates error handling in custom Writable stream with `_writev` method', function () {
        // The custom string that implements the `_writev` method, used
        // to write multiple chunks to the underlying resource
        class CustomWritable extends Writable {
            constructor() {
                super({
                    // Dont decode strings
                    decodeStrings: false
                });

                // Serves as a destination for this stream. In real-world
                // writable stream, this could be a file or a network socket.
                this._data = [];
            }

            // Implement the `_write` method that is used to send a chunk of data
            // to the underlying resource. This method is called by the public
            // `write` method.
            _write(chunk, encoding, callback) {
                if (chunk === "ERROR") {
                    // Raise error if user writes `ERROR` string to the stream
                    callback(new Error("error"));
                }
                else {
                    // Otherwise, write chunk to the underlying resource and
                    // invoke callback with null argument (indicates success)
                    this._data.push(chunk);
                    callback();
                }
            }

            // Implement the `_writev` that is invoked by the base Writable class
            // if there are multiple buffered chunks waiting to be written. This
            // happens if application invokes writable.cork() followed by several
            // writes followed by writable.uncork(). At that moment, the `_writev`
            // is invoked to handle all available chunks ((if `writev` isn't
            // implemented`_write` is invoked for each chunk)
            _writev(chunks, callback) {
                for (const {chunk, encoding} of chunks) {
                    if (chunk === "ERROR") {
                        // Report an error if user writes `ERROR` string
                        callback(new Error("error"));

                        // The method must be terminate on the first failure
                        return;
                    }
                    else {
                        // Write chunk to the underlying resource
                        this._data.push(chunk);
                    }
                }

                // All chunks have been written so invoke the callback without
                // arguments to signal success
                callback();
            }
        }

        const actionLog = [];
        const writable = new CustomWritable();

        // Register the `error` event listener
        writable.on("error", err => {
            assert.deepEqual(err, new Error("error"));
            actionLog.push("error");
        });

        // Cork the stream so that the following writes are buffered
        writable.cork();

        // Write several chunks of data. Note that one of these chunks is a
        // string `ERROR` that will make the stream raise an error. However,
        // that write should not cause the `error` event listener to be invoked
        // right away. The writes are buffered hence the internal `_write`
        // method is not immediately invoked.
        writable.write("A", "utf8");
        writable.write("B", "utf8");
        writable.write("ERROR", "utf8");
        writable.write("D", "utf8");
        writable.write("E", "utf8");

        // Uncork the stream. The `error` listener is invoked synchronously
        // from the `uncork` method
        actionLog.push("before uncork");
        writable.uncork();
        actionLog.push("after uncork");

        // End the stream
        writable.end();

        // The first two chunks were written out. The third chunk caused
        // the error, hence fourth and fifth chunks were simply discarded
        // from the internal buffer
        assert.deepEqual(writable._data, ["A", "B"]);

        // Failure listener was invoked once for the first chuck that
        // caused the failure. Note that the failure listener is invoked
        // synchronously from the stream.uncork() call.
        assert.deepEqual(actionLog, [
            "before uncork",
            "error",
            "after uncork"
        ]);
    });

    /**
     * The highWaterMark defines the acceptable amount of data buffered
     * in stream's internal buffer, waiting to be written out to the
     * underlying resource. Once the length of the internal buffer
     * becomes greater or equal to highWaterMark, the stream's write
     * method will return false indicating that user should stop
     * writing data until `drain` event is emitted which will happen
     * once all outstanding data chunks from the internal buffer have
     * been written out. Note that `write` method will buffer chunks
     * even if the stream is not draining (i.e. the length of the
     * internal buffers is >= highWaterMark), but doing so may hurt
     * the performance of the application by increasing the in-memory
     * footprint of the application.
     *
     * The default highWaterMark is 16kB or 16 objects for streams in
     * object mode.
     */
    it('illustrates Writable stream highWaterMark', function () {
        // Create a DelayedWritable stream whose highWaterMark is set
        // to 8 bytes. That means that the stream's `write` method will
        // return false if the length of buffered data is greater or
        // equal than 8 bytes.
        const writable = new DelayedWritable({
            highWaterMark: 8
        });

        // Register the listener for the `drain` event. Once the stream's
        // internal buffer becomes bigger than the highWaterMark, the
        // `write` method will return false. The application should not
        // use the `write` method again until it received the `drain`
        // event which will happen once the stream's internal buffer is
        // emptied entirely
        writable.on("drain", () => {
            // Confirm that the stream's internal buffer is empty
            assert.equal(writable.writableLength, 0);

            // Assert that `write` returns true if a chunk smaller than
            // highWaterMark is written at this point. The new chuck size
            // is 7 bytes (less than highWaterMark which is 8 bytes).
            //
            // Note that these writes will be immediately flushed by the
            // custom stream implementation. The `drain` event is emitted
            // once the `chunkWrittenCallback` for the last chunk in the
            // internal buffer is called within the `for..of` loop of
            // the `flush` method. The `write` call in this listener will
            // invoke the `_write` method which appends more delayed writes
            // to `_delayedWrites` array. Once this listener returns and
            // the `for..of` loop in `flush` continues executing, it will
            // pick up the new chunks written by this listener
            assert.ok(
                writable.write(
                    Buffer.from([0x41, 0x01, 0x9a, 0x39, 0x14, 0x84, 0xcf])));
        });

        // Write 3 chunks of data. The first is 1 byte long, second 3 bytes
        // and third 2 bytes. Note that each of the `write` calls must return
        // true as the internal buffer length is less than highWaterMark which
        // is 8 bytes for this stream
        assert.ok(writable.write(Buffer.from([0xa0])));
        assert.ok(writable.write(Buffer.from([0x11, 0xb5, 0x09])));
        assert.ok(writable.write(Buffer.from([0x9f, 0x39])));

        // Writable length must be 6 bytes at this point
        assert.equal(writable.writableLength, 6);

        // Write 3 more chunks of data. The first one is 1 byte long which
        // extends the internal buffer to 7 bytes which is still under 8
        // bytes highWaterMark. The next to chucks are 1 and 4 bytes long
        // so those `write` calls must return false
        assert.ok(writable.write(Buffer.from([0x55])));
        assert.equal(writable.write(Buffer.from([0x73])), false);
        assert.equal(writable.write(Buffer.from([0x00, 0x19, 0xf1, 0xce])), false);

        // The internal buffer is now 12 bytes long
        assert.equal(writable.writableLength, 12);

        // Flush the stream (simulates the process of data getting written
        // to the underlying resource which frees the stream's internal
        // buffer)
        writable.flush();

        // Confirm that the stream's internal buffer is empty and verify
        // that the data written to the underlying resource is as expected
        assert.equal(writable.writableLength, 0);

        // The additional 7 bytes at the end come from the write within the
        // `drain` listener. Check the comment in the listener function that
        // explain why the previous call to `flush` also flushes the 7-byte
        // chunk written by the listener
        assert.deepEqual(writable._data, [
            0xa0, 0x11, 0xb5, 0x09, 0x9f, 0x39, 0x55, 0x73, 0x00, 0x19, 0xf1, 0xce,
            0x41, 0x01, 0x9a, 0x39, 0x14, 0x84, 0xcf
        ]);

        // End the stream
        writable.end();
    });

    /**
     * Given a sequence of write operations: write1, write2, write3 if
     * the implementation's `_write` method doesn't invoke the write
     * completed callback for write1, the base `write` method won't
     * invoke the `_write` for write2 and write3. It will do so only
     * after it receives the callback for write1. In the meantime,
     * write2 and write3 are kept in the internal buffer. This ensures
     * that writes are always completed in order they were issued.
     * Allowing out-of-order completion of writes wouldn't make much
     * sense in most scenarios - for example, if we were writing data
     * to a file we expect the chunks of data to be written in order
     * they were passed to `write` calls.
     */
    it('illustrates that writes can never complete out-of-order', function () {
        // The following custom stream implementation simulates the delay of
        // writing data to underlying resource by buffering writes and flushing
        // them out when `flush` method is invoked
        // class CustomWritable extends Writable {
        class CustomDelayedWritable extends DelayedWritable {
            constructor() {
                super({
                    decodeStrings: false
                });

                // Keeps track of order of action through the test
                this._actionLog = [];
            }

            _write(chunk, encoding, callback) {
                super._write(chunk, encoding, callback);
                this._actionLog.push("_write " + chunk);
            }
        }

        const writable = new CustomDelayedWritable();

        // Issue several writes
        writable._actionLog.push("start");
        writable.write("A", "utf8");
        writable.write("B", "utf8");
        writable.write("C", "utf8");
        writable._actionLog.push("end");

        // Flush and end the stream
        writable.flush();
        writable.end();

        // As the `chunk A` wasn't immediately written, the `chunk B` and
        // `chunk C` `write` calls didn't invoke the internal `_write` method
        // immediately. Hence, the `end` string appears in the action log
        // before the logs for those chunks that are added in the `_write`
        // method
        assert.deepEqual(writable._actionLog, [
            "start", "_write A", "end", "_write B", "_write C"
        ]);

        // Assert that the written data is as expected
        assert.deepEqual(writable._data, ["A", "B", "C"])
    });

    /**
     * The `end` method allows the pending writes to complete before ending the
     * stream. For instance, assume that user called `write` 3 times but the
     * first write still hasn't completed. The stream keeps second and third
     * write in its internal buffer and will pass them to the `_write` method
     * only once it receives the write completed callback for the first write.
     * If, however, the end is invoked before this happens it will allow those
     * outstanding writes to complete before ending the stream. But, the stream
     * won't allow new writes and will report an error if `write` is called
     * afterwards.
     *
     * The `destroy` method is a destructive and more immediate way to end the
     * stream. Assuming the same scenario as above where the second and third
     * writes are pending, calling `destroy` at that point will basically drop
     * those writes from the internal buffer without giving them a chance to
     * complete. However, the first write that is currently in flight will
     * be allowed to complete. Write is in-flight `_write` method has been
     * invoked for it. Similar to `end`, it is invalid to invoke `write` after
     * `destroy` has been called on the stream.
     */
    it('illustrates the difference between `end` and `destroy` Writable methods', function () {
        const writable1 = new DelayedWritable();

        // Write several chunks of data. As the first write won't complete
        // right away, the `write` method will buffer other chunks without
        // invoking the implementation's `_write` method for them
        writable1.write(Buffer.from([0x44, 0x01, 0xab]));
        writable1.write(Buffer.from([0x8d]));
        writable1.write(Buffer.from([0x90, 0xf1]));

        assert.equal(writable1.writableLength, 6);

        // End the stream. The `end` won't remove the pending writes from
        // the internal buffer. Hence the call to flush will end up writing
        // all 3 chunks to the underlying resource
        writable1.end();

        // Writing new chunks is not allowed. Note that once `end` has been
        // called, all the following `write` calls will raise an error even
        // those that happen before the `finish` event is emitted.
        assert.throws(() => {
            writable1.write(Buffer.from([0x99]));
        });

        // Flush outstanding writes
        writable1.flush();
        assert.deepEqual(
            writable1._data,
            [0x44, 0x01, 0xab, 0x8d, 0x90, 0xf1]);

        const writable2 = new DelayedWritable();

        // Write several chunks of data. As the first write won't complete
        // right away, the `write` method will buffer other chunks without
        // invoking the implementation's `_write` method for them
        writable2.write(Buffer.from([0x33, 0xaf, 0x81, 0x00]));
        writable2.write(Buffer.from([0x3c, 0x66]));
        writable2.write(Buffer.from([0x8a, 0xaa]));

        assert.equal(writable2.writableLength, 8);

        // Register the the listener for the `close` event that is emitted
        // when stream is destroyed. After this event is emitted, any attempt
        // to write new chunks results in an error.
        // `close` event is emitted asynchronously to the `destroy` call
        // so we need a promise to return to Mocha to make it wait for the
        // async work
        const destroyPromise = new Promise(resolve => {
            writable2.once("close", () => {
                // Writing new chunks is not allowed
                assert.throws(() => {
                    writable2.write(Buffer.from([0x66]));
                },
                {
                    code: "ERR_STREAM_DESTROYED"
                });
                resolve();
            });
        });

        // Destroy the stream. The `destroy` will remove all the pending writes
        // (second and third chunk) from the internal buffer. The flush will only
        // write the first chunk which is in-flight (its `_write` method has been
        // executed) at the moment when `destroy` is executed. `destroyed` flag
        // is set after calling `destroy`
        writable2.destroy();
        assert.ok(writable2.destroyed);

        // Once `destroy` is called, writing data is no longer possible. However,
        // `write` won't throw an exception until `close` event is emitted (which
        // happens asynchronously to the `destroy` call). Hence, the following
        // `write` won't raise an error but the write will simply be ignored
        assert.doesNotThrow(() => {
            writable2.write(Buffer.from([0x5f]));
        });

        // The following flush will only write the in-flight chunk
        writable2.flush();
        assert.deepEqual(
            writable2._data,
            [0x33, 0xaf, 0x81, 0x00]);

        return destroyPromise;
    });

    /**
     * Base stream class won't invoke `_final` method until there is at
     * least one pending write i.e. the write whose write completed
     * callback wasn't executed. The `end` will wait until all writes
     * are completed (that is, their write completed callbacks are
     * executed) before it invoked `_final` method.
     */
    it('illustrates custom Writable stream `_final` method', function () {
        // The following class implements a writable stream that overrides
        // the `_final` method. Note that this stream buffers the chunks of
        // data it receives via the `_write` method. The writes are completed
        // only the `flush` method is invoked
        class CustomDelayedWritable extends DelayedWritable {
            constructor() {
                // Don't decode strings
                super({
                    decodeStrings: false
                });

                // Set to true once `_final` method is executed
                this._final_executed = false;
            }

            // The `_final` method is invoked just before the `finish` event
            // is emitted for the stream. Note that `finish` event listener
            // won't be executed until the callback passed to `_final` is
            // ran. The `_final` method is useful for cleaning up actions
            // such as closing resources or writing any remaining data before
            // stream ends.
            // Note, however, that `_final` won't be invoked if there is at
            // least one pending write (i.e. write whose write completed
            // callback hasn't been executed yet).
            _final(callback) {
                this._final_executed = true;
                callback();
            }
        }

        const writable = new CustomDelayedWritable();

        // Write several chunks of data. Note that the implementation's
        // `_write` method is called only for the first chunk while the
        // other chunks are buffered in the internal buffer. They will
        // be passed to the `_write` once the first chunk is fully
        // processed, which in this case will happen as part of ending
        // the stream (specifically in the `_final` method)
        writable.write("A", "utf8");
        writable.write("B", "utf8");
        writable.write("C", "utf8");
        writable.write("D", "utf8");

        // Register the listener for the `finish` event which will be
        // executed after the callback passed to the `_final` method
        // is invoked
        const finishedPromise = new Promise(resolve => {
            writable.once("finish", () => {
                // `_final` method should've been executed before this listener
                assert.ok(writable._final_executed);

                // All writes have completed by the time this event is fired
                assert.deepEqual(
                    writable._data, ["A", "B", "C", "D"]);

                resolve();
            });
        });

        // End the stream. This will cause all the pending writes to
        // complete
        writable.end();

        // Flush the stream - all the pending writes will now complete and
        // `_final` will be invoked
        writable.flush();

        // Return promise to Mocha to make it wait for the asynchronous work
        // (in this case the processing of `finish` event) to complete
        return finishedPromise;
    });

    /**
     * `finish` event is emitted after `end` is called on stream and pending
     * writes have been completed (and implementation's `_final` method has
     * been executed and the callback passed it invoked).
     *
     * `close` event is emitted after the stream or any of its underlying
     * resources (such as a file descriptor) is closed. One of the common
     * actions that lead to this event is calling the `destroy` method on
     * the stream (with emitClose option set to true which is the default).
     */
    it('illustrates Writable stream `finish` and `close` events', function () {
        // Promises to return to Mocha to make it wait for async work to
        // complete
        const promises = [];
        const actionLog = [];

        const writable1 = new SimpleWritable(true);
        writable1.write(Buffer.from([0x90, 0x64]));

        // Register the listener for the `finish` event
        promises.push(new Promise(resolve => {
            writable1.on("finish", () => {
                actionLog.push("writable1:finish");

                // All writes have been completed
                assert.deepEqual(writable1._data, [0x90, 0x64]);

                resolve();
            })
        }));

        // End the writable1 stream
        writable1.end();

        const writable2 = new SimpleWritable(true);
        writable2.write(Buffer.from([0x64, 0xab]));

        // Register listeners for `finish` and `close` events
        promises.push(new Promise(resolve => {
            writable2.on("finish", () => {
                // `finish` event must not be emitted for this stream as
                // `destroy` is called on it instead of `end`
                assert.fail("Unexpected `finish` event emitted");
            });

            writable2.on("close", () => {
                actionLog.push("writable2:close");

                // All writes have been completed
                assert.deepEqual(writable2._data, [0x64, 0xab]);

                resolve();
            });
        }));

        // Destroy writable2 stream
        writable2.destroy();

        // Wait for both promises to complete and return a new promise
        // to Mocha which will be resolved after these two promises
        return Promise.all(promises)
            .then(() => {
                assert.deepEqual(actionLog, ["writable1:finish", "writable2:close"]);
            })
    });

    it('illustrates custom Writable stream that supports writing objects', function () {
        // Create the DelayedWritable stream that allows writing objects
        // by passing true for the `objectMode` property of the base
        // constructor configs
        const writable = new DelayedWritable({
            objectMode: true
        });

        // Write several chunks of data to the stream. Note that some chunks are
        // objects, some are strings and some are binary buffers
        assert.ok(writable.write({
            name: "Mickey",
            surname: "Mouse"
        }));
        assert.ok(writable.write("ABC"));
        assert.ok(writable.write(Buffer.from([0x74, 0x0c])));
        assert.ok(writable.write({
            name: "Tony",
            surname: "Parker"
        }));

        // The `writeLength` must be 4 at this point. For streams in object mode
        // the highWaterMark represents the max number of objects that can be
        // written into the stream before `write` starts returning false.
        // Consecutively, `writeLength` counts the number of objects buffered
        // in the internal buffer waiting to be written to the underlying
        // resource
        assert.equal(writable.writableLength, 4);

        // Flush the outstanding writes using `flush` method. This should empty
        // the internal buffer
        writable.flush();
        assert.equal(writable.writableLength, 0);

        // Verify data that stream wrote to the underlying resource. Note that
        // strings won't be decoded to Buffers even though `decodeStrings` is
        // set to true. This is because the stream is in object mode, hence
        // every chunks is treated as an object
        assert.deepEqual(writable._data, [
            {
                name: "Mickey",
                surname: "Mouse"
            },
            "ABC",
            Buffer.from([0x74, 0x0c]),
            {
                name: "Tony",
                surname: "Parker"
            }
        ]);
    });

    it('illustrates simple Readable stream', async function () {
        // Create a SimpleReadable stream
        const readable = new SimpleReadable();

        // Promises that will be resolved with each emitted `readable`
        // event. Note that resolve callback is saved so that it can
        // be invoked outside the Promise constructor
        const resolveCallbacks = [];
        const promises = [];
        for (let i = 0; i < 2; ++i) {
            promises.push(new Promise(resolve => {
                resolveCallbacks.push(resolve);
            }));
        }

        // Used to verify chunks read from the stream in the `readable` event
        // listener
        let expectedChunks = undefined;

        // Register the listener for the `readable` event. This event will
        // be emitted once there is data available in the internal read
        // buffer. This commonly happens once implementation pushes data
        // the internal buffer using the `push` method
        readable.on("readable", () => {
            const readChunks = [];
            let chunk;

            // Note that the read chunk size is unrelated to the size
            // of chunks that were pushed to the internal read buffer.
            // For example, 10 bytes of data could be pushed to the
            // internal buffer in chunks of sizes 3, 3 and 4 but if
            // `read` is invoked without the size argument the data
            // will be read as a single 10 byte chunk
            //
            // It is important to use the while loop while reading
            // the data this way. This is because the next `readable`
            // event will be emitted only once `read` method returns
            // null
            while ((chunk = readable.read()) !== null) {
                readChunks.push(chunk);
            }

            // Compare the chunks read with the expected chunks
            assert.deepEqual(readChunks, expectedChunks);

            // Invoke the resolve callback for the related promise
            resolveCallbacks.splice(0, 1)[0]();
        });

        // Generate some data in the underlying resource so that there's some data
        // to be read out
        readable.generateData([
            Buffer.from([0x90, 0xa4, 0x72]),
            Buffer.from([0x22, 0xf2]),
            Buffer.from([0x10]),
            Buffer.from([0x7e, 0xda])
        ]);

        // Even though data is pushed into the stream's internal buffer as multiple
        // chunks, the data is read from the stream as a single chunk
        expectedChunks = [
            Buffer.from([0x90, 0xa4, 0x72, 0x22, 0xf2, 0x10, 0x7e, 0xda])
        ];

        // Wait for the data to be read from the stream
        await promises.splice(0, 1)[0];

        // Generate some more data
        readable.generateData([
            Buffer.from([0x80, 0xff, 0x6a]),
            Buffer.from([0x11, 0x5f]),
            Buffer.from([0x23, 0x77, 0xf5])
        ]);

        // The data is read from the stream as a single chunk
        expectedChunks = [
            Buffer.from([0x80, 0xff, 0x6a, 0x11, 0x5f, 0x23, 0x77, 0xf5])
        ];

        // Wait for the data to be read from the stream
        await promises.splice(0, 1)[0];

        // Destroy the stream
        readable.destroy();
    });

    it('illustrates Readable stream with auto Buffer -> string encoding', async function () {
        const readable = new SimpleReadable("utf8");

        // Set some data that will be read from the stream. When decoded with
        // UTF-8 this is the string `a^©¼ÆbÐ`
        readable._data = [
            /* `a` */ Buffer.from([0x61]),
            /* `^` */ Buffer.from([0x5e]),
            /* `©` */ Buffer.from([0xc2, 0xa9]),
            /* `¼` */ Buffer.from([0xc2, 0xbc]),
            /* `Æ` */ Buffer.from([0xc3, 0x86]),
            /* `b` */ Buffer.from([0x62]),
            /* `Ð` */ Buffer.from([0xc3, 0x90])
        ];

        // Register the listener for the `readable` event. Note that this
        // call will actually invoke the internal `_read` method that will
        // in turn push data to the stream's internal buffer which will
        // then cause the `readable` event to be emitted
        await new Promise(resolve => {
            readable.on("readable", () => {
                let readString = "";
                let chunk;

                while ((chunk = readable.read()) !== null) {
                    readString += chunk;
                }

                // Assert that the read data matches the expected string
                assert.deepEqual(readString, "a^©¼ÆbÐ");

                // Resolve the promise
                resolve();
            })
        });

        // Destroy the stream
        readable.destroy();
    });

    /**
     * Assume that single `_read` invocation pushes 5 chunks of data to the
     * internal buffer. After pushing 3 chunks an error happens and it is
     * reported by `destroy(error)`. Even though the first 3 chunks were
     * pushed, the `readable` event won't be emitted because the error was
     * raised in the same `_read` call in which these chunks were pushed.
     */
    it('illustrates error handling in Readable streams', async function () {
        // Create a SimpleReadable stream
        const readable = new SimpleReadable("utf8");
        const actionLog = [];

        // Register the listener for the `error` event
        const errPromise = new Promise(resolve => {
            readable.on("error", err => {
                assert.deepEqual(err, new Error("error"));
                actionLog.push("error");
                resolve();
            });
        });

        // Register the listener for the `readable` event which
        // also invokes the `_read` method. The `readable` event
        // is fired only once in this test, because the second
        // call to `_read` raises an error.
        const dataReadPromise = new Promise(resolve => {
            readable.on("readable", () => {
                let chunk;
                let readString = "";

                while ((chunk = readable.read()) !== null) {
                    readString += chunk;
                }

                // As the third chunk caused an error, only the first two
                // chunks were pushed to the internal buffer and read by
                // the `read` method
                assert.deepEqual(readString, "abcdOOOxmnfds");
                actionLog.push("readable");
                resolve();
            });
        });

        // Set some data to be read from the stream. Note that none of
        // the strings match the `ERROR` so no error will be raised
        readable.generateData([
            "abcd",
            "OOOx",
            "mnfds"
        ]);

        // Wait for first batch of data to be read
        await dataReadPromise;

        // Generate some more data to be read from the stream. One of
        // these chunks is the `ERROR` string. Hence, `_read` will raise
        // an error because of which the `readable` event won't be emitted
        readable.generateData([
            "Home",
            "abc",
            "ERROR",
            "09f"
        ]);

        // Wait for the `error` event listener to be executed
        await errPromise;

        // The stream should already be destroyed because of the
        // error
        assert.ok(readable.destroyed);

        // Verify the sequence of operations is correct
        assert.deepEqual(actionLog, ["readable", "error"]);
    });

    /**
     * The Readable stream highWaterMark defines the maximum number of
     * bytes that may be written to the internal buffer before the `push`
     * method starts returning false to indicate that caller should cease
     * pushing data. Once data is consumed from the internal buffer (using
     * the `read` method for example), the base class will invoke `_read`
     * again so that more data can be pushed to the internal buffer.
     *
     * Note that invoking `read` method when internal buffer is full (i.e.
     * it's length is greater or equal than the highWaterMark) might invoke
     * the `_read` method again before actually returning data to the caller.
     * Hence, the highWaterMark value seems to be more of an advice than
     * the rule for the base Readable implementation.
     *
     * The default highWaterMark is 16kB or 16 objects for streams in the
     * object mode.
     */
    it('illustrates Readable stream highWaterMark', async function () {
        // Custom readable stream whose highWaterMark is 8 bytes.
        class CustomReadable extends Readable {
            constructor() {
                super({
                    highWaterMark: 8
                });

                // Simulates the underlying resource
                this._data = [];
            }

            _read(size) {
                let i = 0;
                while (i < this._data.length) {
                    assert.ok(this._data[i] instanceof Buffer);

                    // Cease pushing more data once `push` returns false which
                    // indicates that internal buffer has become bigger than the
                    // highWaterMark
                    if (!this.push(this._data[i++])) {
                        break;
                    }
                }

                // Remove chunks that were pushed to the internal buffer
                this._data.splice(0, i);
            }
        }

        const readable = new CustomReadable();

        // Prepare data that will be read via the stream.
        readable._data = [
            Buffer.from([0x1b, 0x9f, 0x8c]),
            Buffer.from([0xc5, 0x10]),
            Buffer.from([0x0f]),
            Buffer.from([0x93, 0x7e, 0xae]),
            Buffer.from([0x00, 0x7a]),
            Buffer.from([0x3c]),
            Buffer.from([0x9d, 0xdd, 0x4c, 0xcc, 0xaa]),
            Buffer.from([0xa8]),
            Buffer.from([0x64]),
            Buffer.from([0xca, 0x1d, 0x88]),
            Buffer.from([0xee])
        ];

        // Register the listener for the `readable` event. Note that event
        // is fired only once, even though the length of data to be read
        // (which is 22 bytes) exceeds the highWaterMark (8 bytes). What
        // happens is that each call to the `read` method will invoke the
        // `_read` method to push some more data to the internal buffer
        // and than return the data currently in the internal buffer to
        // the caller. Hence, there will be only one `readable` event
        // emitted, but the data is read by a few `read` calls
        let readableEventCount = 0;
        await new Promise(resolve => {
            readable.on("readable", () => {
                let chunk;
                const readData = [];

                while ((chunk = readable.read()) !== null) {
                    readData.push(...chunk);
                }

                assert.deepEqual(
                    Buffer.from(readData),
                    Buffer.from([
                        0x1b, 0x9f, 0x8c, 0xc5, 0x10, 0x0f, 0x93, 0x7e, 0xae,
                        0x00, 0x7a, 0x3c, 0x9d, 0xdd, 0x4c, 0xcc, 0xaa,
                        0xa8, 0x64, 0xca, 0x1d, 0x88, 0xee
                    ])
                );

                ++readableEventCount;
                resolve();
            });
        });

        // `readable` event should've been emitted only once
        assert.equal(readableEventCount, 1);

        // Destroy the stream
        readable.destroy();
    });

    /**
     * Readable streams are created in a state in which they don't have
     * a mechanism to consume data attached to them. Thus, they are neither
     * in paused nor are they in the flowing mode. If, at this point, a
     * listener for the `readable` event is register the stream enters the
     * paused mode. In paused mode the user has to manually invoke the
     * `read` method to pull the data out of the stream's internal buffer.
     * Note that in paused mode, if user doesn't invoke the `read` method
     * periodically, the data might accumulate in the internal read buffer.
     * Assuming that implementation ceases pushing data once `push` returns
     * true, the length of the internal buffer should never get larget than
     * the highWaterMark.
     */
    it('illustrates Readable stream paused mode', async function () {
        const readable = new SimpleReadable();

        // The stream is now in its initial state. In this state the stream
        // is neither paused nor is flowing. It has no attached mechanism to
        // consume data yet
        assert.ok(!readable.isPaused());
        assert.equal(readable.readableFlowing, null);

        // Set some data to be read via the stream
        readable._data = [
            Buffer.from([0x04, 0x45, 0x00]),
            Buffer.from([0xae, 0xa0])
        ];

        // Attaching a listener for the `readable` event while stream is in its
        // initial state puts it in the paused state
        const dataReadPromise = new Promise(resolve => {
            readable.on("readable", () => {
                let chunk;
                const dataRead = [];

                // Read the data from the internal buffer
                while ((chunk = readable.read()) !== null) {
                    dataRead.push(...chunk);
                }

                assert.deepEqual(
                    dataRead,
                    [0x04, 0x45, 0x00, 0xae, 0xa0]);

                resolve();
            });
        });

        // Stream must now be in paused state. Both `isPaused` and
        // `readableFlowing === false` can be used to verify this
        assert.ok(readable.isPaused());
        assert.ok(readable.readableFlowing === false);

        // Wait for all the data to be read from the stream
        await dataReadPromise;

        // Destroy the stream
        readable.destroy();
    });

    /**
     * Readable streams are created in a state in which they don't have
     * a mechanism to consume data attached to them. Thus, they are neither
     * in paused nor are they in the flowing mode. It, at this point, a
     * listener for the `data` event is attached to the stream, the stream
     * enters the flowing mode. In flowing mode, for each chunk pushed to
     * the internal buffer using the `push` method a `data` event is emitted.
     * The stream won't accumulate multiple chunks before firing the event -
     * it will fire a `data` event for every pushed chunk. It is a programming
     * error to manually invoke `read` when stream is in flowing mode. The
     * `read` will be automatically invoked to retrieve more data from the
     * underlying resource.
     */
    it('illustrates Readable stream flowing mode', async function () {
        const readable = new SimpleReadable();

        // The stream is now in its initial state. In this state the stream
        // is neither paused nor is flowing. It has no attached mechanism to
        // consume data yet
        assert.ok(!readable.isPaused());
        assert.equal(readable.readableFlowing, null);

        // Set some data to be read via the stream
        readable._data = [
            Buffer.from([0x04, 0x45, 0x00]),
            Buffer.from([0xae, 0xa0]),
            Buffer.from([0x99]),
            Buffer.from([0x8a, 0xf1, 0xc5])
        ];

        // Attaching a listener for the `data` event to the stream that is
        // in its initial state puts the stream into the flowing mode. In
        // the flowing mode, the `read` method is called automatically to
        // push more chunks into the internal buffer which are then passed
        // to the `data` event listener.
        // Note that the stream won't accumulate multiple chunks and then
        // fire a single `data` event passing it the combined chunks - it
        // will instead emit a `data` event for each chunk pushed by the
        // `_read` method
        const chunksReadPromise = new Promise(resolve => {
            let chunkCount = 0;
            let dataRead = [];

            readable.on("data", chunk => {
                dataRead.push(...chunk);

                // If all chunks were read, verify the data read and resolve
                // the promise
                if (++chunkCount === 4) {
                    assert.deepEqual(
                        dataRead,
                        [0x04, 0x45, 0x00, 0xae, 0xa0, 0x99, 0x8a, 0xf1, 0xc5]);

                    resolve();
                }
            });
        });

        // The stream is now in the flowing mode
        assert.ok(readable.readableFlowing);

        // Wait for all the chunks to be read
        await chunksReadPromise;

        // Destroy the stream
        readable.destroy();
    });

    /**
     * The rules that define the Readable stream flowing state machine are
     * described in
     * https://nodejs.org/docs/latest-v12.x/api/stream.html#stream_two_reading_modes
     * and https://nodejs.org/docs/latest-v12.x/api/stream.html#stream_three_states.
     * This sample illustrates most (but not all) of those rules.
     */
    it('illustrates three states of Readable.readableFlowing property', async function () {
        const readable1 = new SimpleReadable();

        // When created, `readableFlowing` is null indicating that a mechanism
        // to consume data from the stream is not yet attached
        assert.equal(readable1.readableFlowing, null);

        // Attaching a listener for the `data` event puts the stream in the flowing
        // mode
        readable1.on("data", () => {});
        assert.equal(readable1.readableFlowing, true);

        // Invoking `pause` method puts the stream into the paused mode
        readable1.pause();
        assert.equal(readable1.readableFlowing, false);

        // Invoking `resume` method makes the stream flowing again
        readable1.resume();
        assert.equal(readable1.readableFlowing, true);

        // Attaching a listener for the `readable` events pauses the stream
        readable1.on("readable", () => {});
        assert.equal(readable1.readableFlowing, false);

        // Remove the `readable` event listener makes the stream flowing again
        // if `data` event has a registered listener. However, this happens
        // asynchronously to removing the `readable` listener
        readable1.removeAllListeners("readable");
        await new Promise(resolve => {
            process.nextTick(() => {
                assert.equal(readable1.readableFlowing, true);
                resolve();
            });
        });

        // Destroy the stream
        readable1.destroy();

        // The following illustrates how `pipe/unpipe` methods also affect the
        // stream mode
        const readable2 = new SimpleReadable();
        const writable = new SimpleWritable(false);

        // The readable stream has no mechanism to consume data attached at
        // the moment
        assert.equal(readable2.readableFlowing, null);

        // Piping the readable to a writable stream automatically switches the
        // readable stream into the flowing mode and it'll push all of its data
        // to the writable stream
        readable2.pipe(writable);
        assert.equal(readable2.readableFlowing, true);

        // Detaching all the writable streams from the given readable stream
        // pauses the readable stream
        readable2.unpipe();
        assert.equal(readable2.readableFlowing, false);

        // Destroy the streams
        readable2.destroy();
        writable.destroy();
    });

    it('illustrates data loss in Readable flowing mode', async function () {
        const readable = new SimpleReadable();

        // Push some data into stream's internal buffer. As the stream
        // has no mechanism to consume data at the moment, the data
        // will be buffered
        readable.generateData([
            Buffer.from([0x01, 0xa8, 0x7f]),
            Buffer.from([0x99, 0xf4]),
            Buffer.from([0xc4])
        ]);

        // Register a listener for the `data` event which puts the
        // stream into the flowing mode
        await new Promise(resolve => {
            let counter = 0;
            const dataRead = [];

            readable.on("data", chunk => {
                dataRead.push(...chunk);

                // Event is fired 3 times, for each of the 3 chunks
                if (++counter === 3) {
                    assert.deepEqual(dataRead, [0x01, 0xa8, 0x7f, 0x99, 0xf4, 0xc4]);
                    resolve();
                }
            });
        });

        // The stream is in flowing mode
        assert.equal(readable.readableFlowing, true);

        // Removing the `data` listener doesn't pause the stream. We're
        // waiting for the next process tick to check the flowing mode
        // in case that changing the flowing mode is asynchronous to
        // removing the event listener (as is the case when `readable`
        // event listener is removed and stream switches back to flowing
        // mode in the next process tick - if there is `data` listener)
        await new Promise(resolve => {
            readable.removeAllListeners("data");
            process.nextTick(() => {
                assert.equal(readable.readableFlowing, true);
                resolve();
            });
        });

        // The stream is in flowing mode but there's no `data` listener
        // (nor there is a piped writable) to consume data. Pushing data
        // into the internal buffer will automatically consume it, but
        // as there's no mechanism to consume the data it will be thrown
        // away
        readable.generateData([
            Buffer.from[0x90, 0x5e, 0xcf, 0x61]
        ]);

        // Pause the stream and manually invoke the `read` method to get
        // any remaining data in the internal buffer, which should be
        // none
        readable.pause();
        assert.equal(readable.readableFlowing, false);
        assert.equal(readable.read(), null);

        // End the stream by pushing null to it
        readable.push(null);
    });

    it('illustrates ending Readable stream by pushing null', async function () {
        const readable = new SimpleReadable();
        const actionLog = [];

        // Push some data into stream's internal buffer
        readable.generateData([
            Buffer.from([0x9f, 0xff, 0x4c]),
            Buffer.from([0x2c, 0xea]),
            null // Marks the end of the stream
        ]);

        // Register a listener for the `end` event which is emitted
        // when the stream ends gracefully (for instance, when null
        // is written to it), as opposed to destroying the stream
        // which will throw away all remaining data in the internal
        // buffer
        const streamEndedPromise = new Promise(resolve => {
            readable.once("end", () => {
                actionLog.push("end");
                resolve();
            });
        });

        // Register a listener for the `data` event which will consume
        // all the data from the internal buffer
        const dataRead = [];
        readable.on("data", chunk => {
            dataRead.push(...chunk);

            if (dataRead.length === 2) {
                assert.deepEqual(dataRead, [0x9f, 0xff, 0x4c, 0x2c, 0xea]);
            }

            actionLog.push("data");
        });

        // Wait for the stream to end
        await streamEndedPromise;

        // Make sure the operations happened in expected order
        assert.deepEqual(actionLog, ["data", "data", "end"]);
    });

    it('illustrates size parameter of Readable.read method', function () {
        const readable = new SimpleReadable();

        // Push some data to stream's internal buffer
        readable.generateData([
            Buffer.from([0x9f, 0xce, 0x77]),
            Buffer.from([0x1a, 0xac])
        ]);

        // The length of the internal buffer is 5 bytes
        assert.equal(readable.readableLength, 5);

        // Invoking `read` with size greater than 5 at this point will
        // return null, because internal buffer doesn't have that much
        // buffered data. See below for what happens if `read` is called
        // with size greater than the length of internal buffer but the
        // stream has already ended
        assert.equal(readable.read(10), null);

        // Read 3 bytes from the internal buffer. There should be 2 bytes
        // left in the internal buffer afterwards
        assert.deepEqual(readable.read(3), Buffer.from([0x9f, 0xce, 0x77]))
        assert.equal(readable.readableLength, 2);

        // Push some more data to the internal buffer ending with a null
        // which marks the end of the stream
        readable.generateData([
            Buffer.from([0x8a, 0x66]),
            Buffer.from([0x91, 0xf4, 0x81]),
            null // Marks the end of the stream
        ]);

        // There should be 7 bytes in the internal buffer
        assert.equal(readable.readableLength, 7);

        // The stream has now ended, so invoking `read` with size greater than
        // the internal buffer length will return all data from the internal
        // buffer (equivalent to calling size without arguments)
        assert.deepEqual(
            readable.read(15),
            Buffer.from([0x1a, 0xac, 0x8a, 0x66, 0x91, 0xf4, 0x81]));
    });

    it('illustrates piping Readable to single Writable stream', async function () {
        const readable = new SimpleReadable();
        const writable = new SimpleWritable(false);
        const actionLog = [];

        // Push some data into the readable stream's internal buffer
        readable.generateData([
            Buffer.from([0x9a, 0x00, 0x77]),
            Buffer.from([0x1a]),
            Buffer.from([0x5c, 0xf1]),
            Buffer.from([0xa9]),
            null // Marks the end of the stream
        ]);

        // Pipe readable to the writable stream. This will automatically
        // read all the available data from the readable stream and write
        // it to the writable stream. Attaching a writable stream to a
        // readable stream in its initial state moves the readable stream
        // into the flowing mode.
        // The `options.end` determines whether writable stream is ended
        // once readable stream ends, and its default value is true
        readable.pipe(writable, {
            end: true // This is default
        });

        // Attach a listener for the readable stream `end` event
        readable.once("end", () => {
            actionLog.push("readable end");
        });

        // Attach a listener for the writable stream `finish` event
        // which should be emitted after the readable stream's `end`
        // event because the `options.end` passed to the `pipe` method
        // is true
        await new Promise(resolve => {
            writable.on("finish", () => {
                actionLog.push("writable end");

                // Assert that all data was written to the writable stream
                assert.deepEqual(
                    writable._data,
                    [0x9a, 0x00, 0x77, 0x1a, 0x5c, 0xf1, 0xa9]);

                resolve();
            });
        });

        // Both readable and writable streams should've ended by now
        assert.ok(readable.readableEnded);
        assert.ok(writable.writableEnded);

        // The writable `end` event is emitted before the readable `end` event
        assert.deepEqual(actionLog, ["writable end", "readable end"]);
    });

    /**
     * Readable.pipe method can be used to attach multiple Writable streams
     * all of which will receive all of the data from the readable stream.
     * This works because the `pipe` method doesn't start writing the data
     * from the internal buffer to the writable stream immediately. Writing
     * starts asynchronously, probably at the beginning of the next process
     * tick. Hence, one can use `pipe` method to attach multiple writable
     * streams and the data will start flowing from the internal buffer to
     * all those streams at the beginning of the next process tick.
     */
    it('illustrates piping Readable to multiple Writable streams', async function () {
        // Create single readable and multiple writable streams to
        // which the readable will stream its data to
        const readable = new SimpleReadable();
        const writables = [
            new SimpleWritable(false),
            new SimpleWritable(false)
        ];

        // Push some data into the readable stream's internal buffer
        readable.generateData([
            Buffer.from([0x9a, 0x00, 0x77]),
            Buffer.from([0x1a]),
            Buffer.from([0x5c, 0xf1]),
            Buffer.from([0xa9]),
            null // Marks the end of the stream
        ]);

        // Pipe readable to multiple writable streams. Each writable should
        // get all the data from the readable stream. The writable streams
        // at event indices in the `writables` array will be automatically
        // ended when readable stream ends, the writable streams at odd
        // indices won't be automatically ended
        for (let i = 0; i < writables.length; ++i) {
            readable.pipe(writables[i], {
                end: (i % 2 === 0)
            });
        }

        // Attach a listener for the readable stream `end` event
        await new Promise(resolve => {
            readable.once("end", () => {
                resolve();
            });
        });

        // Verify that each writable contains all the data read from
        // the readable stream
        for (let i = 0; i < writables.length; ++i) {
            assert.deepEqual(
                writables[i]._data,
                [0x9a, 0x00, 0x77, 0x1a, 0x5c, 0xf1, 0xa9]);

            if (i % 2 === 0) {
                // Writable stream should be ended automatically when readable
                // stream ended
                assert.ok(writables[i].writableEnded);
            }
            else {
                // End the writable stream
                writables[i].end();
            }
        }
    });

    /**
     * If `options.end` property of the options object passed to the `pipe` method is
     * true, the destination writable stream is ended automatically (Writable.end is
     * called) once the readable stream ends (null value is pushed to for example).
     * However, this won't happen if readable stream emits an error during processing.
     * If error is raised by the readable, user will have to manually close each writable
     * stream to prevent memory leaks.
     */
    it('illustrates error handling when piping Readable to Writable stream', async function () {
        const readable = new SimpleReadable("utf8");
        const writable = new SimpleWritable(false);
        const actionLog = [];

        // Push some data to readable's internal buffer. Note that one of
        // the strings is equal to `ERROR` which will make the readable
        // stream to raise an error
        readable.generateData([
            "ABC",
            "OP011",
            "M0912",
            "ERROR",
            "8721",
            "!@#%6"
        ]);

        // Pipe readable to the writable stream
        readable.pipe(writable);

        // Attach a listener for the readable `error` event
        readable.on("error", () => {
            actionLog.push("readable error");
        });

        // Attach a listener for the readable `close` event. This event should
        // be emitted after readable stream encounters and error and stream is
        // destroyed
        await new Promise(resolve => {
            readable.on("close", () => {
                actionLog.push("readable close");
                resolve();
            });
        });

        // Assert that writable stream wasn't ended because of the error in
        // readable stream
        assert.ok(!writable.writableEnded);

        // Verify that the data up to the error was written to the writable
        // stream
        assert.deepEqual(writable._data, ["ABC", "OP011", "M0912"]);

        // End the writable stream
        writable.end();
    });

    it('illustrates advanced Readable/Writable interplay in paused readable mode', async function () {
        // Create an asynchronous writable stream that completes each write
        // with the delay of at least 50 milliseconds from the moment `write`
        // is called. The writable stream's highWaterMark is set to 10 bytes
        // which will be exceeded because the readable stream is 5 times
        // faster than the writable stream (see below)
        const asyncWritable = new AsynchronousWritable(50, {
            highWaterMark: 10
        });

        // Create an asynchronous readable stream that continuously reads chunks
        // from the underlying resource in average every 10 milliseconds. Note
        // that readable stream is 5 times faster than the writable stream. The
        // readable stream's highWaterMark is set to 5 bytes which will be
        // exceeded because the writable stream is 5 types slower than the
        // readable stream, hence internal read buffer will fill up with data
        // that wasn't yet written to the writable stream
        const asyncReadable = new AsynchronousReadable(10, {
            highWaterMark: 5
        });

        // Attach a listener for the `drain` event to the writable stream. This
        // event will be emitted once writable internal buffer is emptied after
        // it has previously been filled up beyond the highWaterMark
        asyncWritable.on("drain", () => {
            // Signal the readable stream that it may continue writing
            // data to the writable stream
            asyncReadable.emit("readable");
        });

        // Attach a listener for the `readable` event to the readable stream.
        // This event is emitted when there is data to be read from the readable's
        // internal buffer
        asyncReadable.on("readable", () => {
            // If the writable stream's internal buffer is overloaded don't
            // read any data from the readable
            if (asyncWritable.writableLength >= asyncWritable.writableHighWaterMark) {
                return;
            }

            let chunk;
            while ((chunk = asyncReadable.read()) !== null) {
                // Write the chunk to the writable stream. Break the loop if
                // `write` returns false indicating that its internal buffer
                // has grown beyond the highWaterMark
                if (!asyncWritable.write(chunk)) {
                    break;
                }
            }
        });

        // Simulate the appearance of several chunks of data in the underlying
        // resource of the readable stream. These chunks will be read into the
        // readable stream's internal buffer, written to the writable stream's
        // internal buffer and from there to its underlying resource
        asyncReadable._data = [
            Buffer.from([0xaf, 0x98, 0x00]),
            Buffer.from([0xb1, 0x57]),
            Buffer.from([0xf5, 0xab, 0x09, 0x1e]),
            Buffer.from([0x77, 0xee, 0x94]),
            Buffer.from([0xda, 0x01]),
            Buffer.from([0x66, 0x12, 0xf0]),
            Buffer.from([0xff]),
            Buffer.from([0x43, 0x71, 0xed, 0x22, 0xbc]),
            Buffer.from([0x88, 0xf5]),
            Buffer.from([0x36, 0xae, 0x23]),
            Buffer.from([0x0a, 0x0b, 0x0c, 0x0d]),
            Buffer.from([0xa0, 0xb0]),
            null // Marks the end of the readable stream
        ];

        // Attach a listener for the `end` event to the readable stream. This
        // event is emitted when null is written to the stream
        asyncReadable.once("end", () => {
            // End the writable stream
            asyncWritable.end();
        });

        // Wait for the `finish` event to be emitted on the writable which
        // means that all data has been written to writable stream's underlying
        // resource. In this case, the `finish` event is emitted when readable
        // stream's `end` event listener ends the writable stream
        await new Promise(resolve => {
            asyncWritable.once("finish", () => {
                resolve();
            });
        });

        // Verify data written to the writable stream
        assert.deepEqual(
            asyncWritable._data,
            [
                0xaf, 0x98, 0x00, 0xb1, 0x57, 0xf5, 0xab, 0x09, 0x1e, 0x77, 0xee, 0x94,
                0xda, 0x01, 0x66, 0x12, 0xf0, 0xff, 0x43, 0x71, 0xed, 0x22, 0xbc, 0x88,
                0xf5, 0x36, 0xae, 0x23, 0x0a, 0x0b, 0x0c, 0x0d, 0xa0, 0xb0
            ]
        );
    });

    it('illustrates advanced Readable/Writable interplay with `data` event', async function () {
        // Create an asynchronous writable stream that completes each write
        // with the delay of at least 10 milliseconds from the moment `write`
        // is called. The writable stream's highWaterMark is set to 5 bytes
        const asyncWritable = new AsynchronousWritable(10, {
            highWaterMark: 5
        });

        // Create an asynchronous readable stream that continuously reads chunks
        // from the underlying resource in average every 50 milliseconds. Note
        // that readable stream is 5 times slower than the writable stream. The
        // readable stream's highWaterMark is set to 10 bytes
        const asyncReadable = new AsynchronousReadable(50, {
            highWaterMark: 10
        });

        // Attach a listener for the `drain` event to the writable stream. This
        // event will be emitted once writable internal buffer is emptied after
        // it has previously been filled up beyond the highWaterMark
        asyncWritable.on("drain", () => {
            // Resume the readable stream now that writable stream's internal
            // buffer has been emptied out
            asyncReadable.resume();
        });

        asyncReadable.on("data", chunk => {
            // Write the chunk to the writable stream. If writable stream
            // reports back pressure (`write` returns false), then pause
            // the readable stream until writable stream's internal buffer
            // empties out
            if (!asyncWritable.write(chunk)) {
                asyncReadable.pause();
            }
        });

        // Simulate the appearance of several chunks of data in the underlying
        // resource of the readable stream. These chunks will be read into the
        // readable stream's internal buffer, written to the writable stream's
        // internal buffer and from there to its underlying resource
        asyncReadable._data = [
            Buffer.from([0xaf, 0x98, 0x00]),
            Buffer.from([0xb1, 0x57]),
            Buffer.from([0xf5, 0xab, 0x09, 0x1e]),
            Buffer.from([0x77, 0xee, 0x94]),
            Buffer.from([0xda, 0x01]),
            Buffer.from([0x66, 0x12, 0xf0]),
            Buffer.from([0xff]),
            Buffer.from([0x43, 0x71, 0xed, 0x22, 0xbc]),
            Buffer.from([0x88, 0xf5]),
            Buffer.from([0x36, 0xae, 0x23]),
            Buffer.from([0x0a, 0x0b, 0x0c, 0x0d]),
            Buffer.from([0xa0, 0xb0]),
            null // Marks the end of the readable stream
        ];

        // Attach a listener for the `end` event to the readable stream. This
        // event is emitted when null is written to the stream
        asyncReadable.once("end", () => {
            // End the writable stream
            asyncWritable.end();
        });

        // Wait for the `finish` event to be emitted on the writable which
        // means that all data has been written to writable stream's underlying
        // resource. In this case, the `finish` event is emitted when readable
        // stream's `end` event listener ends the writable stream
        await new Promise(resolve => {
            asyncWritable.once("finish", () => {
                resolve();
            });
        });

        // Verify data written to the writable stream
        assert.deepEqual(
            asyncWritable._data,
            [
                0xaf, 0x98, 0x00, 0xb1, 0x57, 0xf5, 0xab, 0x09, 0x1e, 0x77, 0xee, 0x94,
                0xda, 0x01, 0x66, 0x12, 0xf0, 0xff, 0x43, 0x71, 0xed, 0x22, 0xbc, 0x88,
                0xf5, 0x36, 0xae, 0x23, 0x0a, 0x0b, 0x0c, 0x0d, 0xa0, 0xb0
            ]
        );
    });

    it('illustrates advanced Readable/Writable interplay with piping', async function () {
        // Create an asynchronous writable stream that completes each write
        // with the delay of at least 50 milliseconds from the moment `write`
        // is called. The writable stream's highWaterMark is set to 10 bytes
        // which will be exceeded because the readable stream is 5 times
        // faster than the writable stream (see below)
        const asyncWritable = new AsynchronousWritable(50, {
            highWaterMark: 10
        });

        // Create an asynchronous readable stream that continuously reads chunks
        // from the underlying resource in average every 10 milliseconds. Note
        // that readable stream is 5 times faster than the writable stream. The
        // readable stream's highWaterMark is set to 5 bytes which will be
        // exceeded because the writable stream is 5 types slower than the
        // readable stream, hence internal read buffer will fill up with data
        // that wasn't yet written to the writable stream
        const asyncReadable = new AsynchronousReadable(10, {
            highWaterMark: 5
        });

        // Pipe the readable to the writable stream. This will cause all the
        // available data to be read from the readable stream and written to
        // the writable stream's underlying resource
        asyncReadable.pipe(asyncWritable);

        // Simulate the appearance of several chunks of data in the underlying
        // resource of the readable stream. These chunks will be read into the
        // readable stream's internal buffer, written to the writable stream's
        // internal buffer and from there to its underlying resource
        asyncReadable._data = [
            Buffer.from([0xaf, 0x98, 0x00]),
            Buffer.from([0xb1, 0x57]),
            Buffer.from([0xf5, 0xab, 0x09, 0x1e]),
            Buffer.from([0x77, 0xee, 0x94]),
            Buffer.from([0xda, 0x01]),
            Buffer.from([0x66, 0x12, 0xf0]),
            Buffer.from([0xff]),
            Buffer.from([0x43, 0x71, 0xed, 0x22, 0xbc]),
            Buffer.from([0x88, 0xf5]),
            Buffer.from([0x36, 0xae, 0x23]),
            Buffer.from([0x0a, 0x0b, 0x0c, 0x0d]),
            Buffer.from([0xa0, 0xb0]),
            null // Marks the end of the readable stream
        ];

        // Wait for the `finish` event to be emitted on the writable which
        // means that all data has been written to writable stream's underlying
        // resource. In this case, the writable stream is ended automatically
        // once all data from the readable stream has been written to it
        await new Promise(resolve => {
            asyncWritable.once("finish", () => {
                resolve();
            });
        });

        // Verify data written to the writable stream
        assert.deepEqual(
            asyncWritable._data,
            [
                0xaf, 0x98, 0x00, 0xb1, 0x57, 0xf5, 0xab, 0x09, 0x1e, 0x77, 0xee, 0x94,
                0xda, 0x01, 0x66, 0x12, 0xf0, 0xff, 0x43, 0x71, 0xed, 0x22, 0xbc, 0x88,
                0xf5, 0x36, 0xae, 0x23, 0x0a, 0x0b, 0x0c, 0x0d, 0xa0, 0xb0
            ]
        );
    });

    /**
     * Duplex streams are basically a Readable and a Writable stream within a
     * single stream object. The important thing to remember is that the
     * writable and readable sides of the duplex stream are kept separate.
     * For example, duplex streams have two internal buffers one for the
     * writable and one for the readable side. Hence, it is perfectly valid
     * to pipe duplex stream to itself - the data is read from the readable
     * underlying resource and pushed into the internal read buffer, from
     * there it is written to the internal write buffer and finally to the
     * underlying write resource.
     */
    it('illustrates piping Duplex stream to itself', async function () {
        // Create a duplex stream
        const duplex = new SimpleDuplex();

        // Pipe the duplex stream to itself. While this might seem strange,
        // it is completely valid as the readable and writable parts of a
        // duplex stream are kept separate. Hence, this will read all the
        // data from the underlying read resource and write it to the underlying
        // write resource
        duplex.pipe(duplex);

        // Simulate several data chunks appearing in the underlying read resource
        duplex._readResource = [
            Buffer.from([0x01, 0xa8, 0x0f]),
            Buffer.from([0x99, 0x88]),
            Buffer.from([0xff]),
            null // Marks the end of the readable side of the duplex stream
        ];

        // Wait for the writable side of the duplex stream to end. As duplex
        // stream is piped to itself and `options.end` passed to the constructor
        // is true by default, the writable side is closed automatically once the
        // readable side is closed
        await new Promise(resolve => {
            duplex.once("finish", () => {
                // Verify the data written to the underlying write resource
                assert.deepEqual(duplex._writeResource, [0x01, 0xa8, 0x0f, 0x99, 0x88, 0xff]);
                resolve();
            });
        });
    });

    /**
     * Transform stream is a Duplex stream that is capable of transforming the
     * chunks read from the underlying resource and pushing zero or more transformed
     * chunks to the internal read buffer. Transform base class provides the implementation
     * for `_read` and `_write` methods.
     */
    it('illustrates Transform streams', async function () {
        // Create a transform stream that will encode Buffers to strings
        // using UTF-8 encoding when reading data out of the stream (for
        // example via the `data` event`) and will not decode strings to
        // buffers when writing data via the `write` method
        const transform = new SimpleTransform({
            decodeStrings: false,
            encoding: "utf8"
        }, "end of stream");

        // The chunks of data to be written to be written to and transformed
        // by the transform stream
        const originalChunks = [
            "ABCD",
            "Oy12",
            "Pi7123",
            "bmnadf"
        ];

        // Attach a listener for the `data` event to the transform stream. This
        // event is emitted for each chunk pushed by the `_transform` method.
        const transformedData = [];
        transform.on("data", chunk => {
            transformedData.push(chunk);
        });

        // Write one chunk per process tick. Note that transform stream's
        // `write` method is a bit special, in a sense that it will invoke
        // the internal `_transform` method that will in turn push the
        // transformed chunks to the internal read buffer (which is then
        // passed to the `data` event listener)
        (function transformData() {
            // If there's no more data to transform end the stream
            if (originalChunks.length === 0) {
                transform.end();
                return;
            }

            // Otherwise, write the next chunk to be transformed at the
            // beginning of the next process tick
            process.nextTick(() => {
                transform.write(originalChunks.shift(), "utf8");

                // Repeat the process for the next chunk (if there's any left)
                transformData();
            });
        })();

        // Wait for the listener for the `end` event to be invoked. This event
        // is emitted after the callback in the `_flush` method has been called
        // (which means that all chunks plus the extra chunk in the `_flush`
        // method have been processed)
        await new Promise(resolve => {
            transform.once("end", () => {
                resolve();
            });
        });

        // Verify the transformed data
        assert.deepEqual(
            transformedData,
            ["ABCD", "ABCD", "Oy12", "Oy12", "Pi7123", "Pi7123", "bmnadf", "bmnadf", "end of stream"]);
    });

    /**
     * The `pipeline` method can be used to chain multiple streams into a
     * pipeline where data will flow from one stream to another automatically.
     * Common usage of the `pipeline` method is to create a sequence of streams
     * readable -> transform -> writable where data is read from the underlying
     * readable resource, transformed by transform stream and then written to
     * the underlying writable stream by the writable stream.
     *
     * In order for `pipeline` method to function properly, the stream (or
     * streams) in the middle of the pipeline must be of Duplex type so that
     * they may both read and write data. Additionally, these mid-sequence
     * streams must also be able to pipe their output data to the input of
     * the next stream in the sequence. Normal Duplex streams are not
     * suitable for this purpose, as their `_write` method writes the data
     * to the underlying write resource. However, Transform streams have
     * specialized `_read` and `_write` methods that can do precisely what
     * the `pipeline` requires - they read the data output from the previous
     * stream in the sequence and output the data to the input of the next
     * stream in the sequence.
     */
    it('illustrates the `pipeline` method', async function () {
        // Create readable, transform and writable streams
        const readable = new SimpleReadable();
        const transform = new SimpleTransform();
        const writable = new SimpleWritable();

        // Set some data that will be read by the readable stream, transformed
        // by the transform stream and finally written to the writable stream
        readable._data = [
            Buffer.from([0x9a, 0x00, 0x1f]),
            Buffer.from([0x88]),
            Buffer.from([0x7c, 0x9e]),
            Buffer.from([0xee]),
            null
        ];

        // Wait for the `pipeline` method to complete that entire pipeline
        // has completed. This will happen once the last stream in the pipeline
        // (writable in this case) is ended, which means that all data has
        // been processed and written to its final destination
        await new Promise(resolve => {
            pipeline(readable, transform, writable, err => {
                // No error should've occurred
                assert.equal(err, undefined);
                resolve();
            });
        });

        // Verify the data written to the writable stream. Transform stream has
        // repeated each chunk twice
        assert.deepEqual(
            writable._data,
            [
                0x9a, 0x00, 0x1f, 0x9a, 0x00, 0x1f,
                0x88, 0x88,
                0x7c, 0x9e, 0x7c, 0x9e,
                0xee, 0xee
            ]);
    });

    it('illustrates consuming Readable streams with Async iterators', async function () {
        // Create an asynchronous readable stream
        const readable = new AsynchronousReadable(10, {
            encoding: "utf8"
        });

        // Set several data chunks that will read via the readable stream
        readable._data = [
            "ABCDE",
            "OOOO",
            "1234",
            "QQFDE",
            null // Marks the end of the stream
        ];

        // Consume the readable stream using the `for await..of` loop.
        // Each iteration waits until the next chunk becomes available
        // and is then read from the stream
        const dataRead = [];
        for await (const chunk of readable) {
            dataRead.push(chunk);
        }

        // Verify the data read from the stream
        assert.deepEqual(dataRead, ["ABCDE", "OOOO", "1234", "QQFDE"]);
    });

    it('illustrate creating Readable streams from Async generators', async function () {
        // Define an async generator function
        async function * generateChunks() {
            const chunks = [
                "ABCD",
                "09123",
                "TIPTOP",
                "tfdef",
                "qmbd"
            ];

            for (const chunk of chunks) {
                yield chunk;
            }
        }

        // Use the `Readable.from` method to create a readable stream from
        // the iterator returned by the async generator function
        const readable = Readable.from(generateChunks());

        // Attach a listener for the `data` event which puts the stream
        // into flowing mode causing all data to be read from it
        const dataRead = [];
        readable.on("data", chunk => {
            dataRead.push(chunk);
        });

        // Wait for the `end` event
        await new Promise(resolve => {
            readable.once("end", () => {
                resolve();
            });
        });

        // Verify the data read
        assert.deepEqual(dataRead, ["ABCD", "09123", "TIPTOP", "tfdef", "qmbd"]);
    });

    it('illustrates piping to Writable stream from Async iterators', async function () {
        // A generator that yields a value with at least the specified
        // amount of milliseconds
        function * generateData(delay) {
            // The array of chunks that will be generated one by one
            // every `delay` milliseconds
            const chunks = [
                "ABCD",
                "091231",
                "tuta",
                "bnmsds",
                "ufds"
            ];

            // For each chunk
            for (const chunk of chunks) {
                // Yield a promise that will be resolved with the chunk after
                // the specified delay
                yield new Promise(resolve => {
                    setTimeout(() => {
                        resolve(chunk);
                    }, delay);
                });
            }
        }

        // Create an async writable that takes at least 30 milliseconds
        // to complete a write. Considering that the generator produces
        // a new value every 10 milliseconds and the writable has the
        // highWaterMark set to 5 bytes, the writable might report the
        // back pressure
        const writable = new AsynchronousWritable(30, {
            decodeStrings: false,
            highWaterMark: 5
        });

        // Iterate over the chunks asynchronously produced by the generator
        // and write them to the writable stream
        for await (const chunk of generateData(10)) {
            if (!writable.write(chunk, "utf8")) {
                // If writable stream reported the back pressure cease
                // writing new data until `drain` event is emitted. The
                // following await statement suspends the execution of
                // this loop until the `drain` event is emitted (the
                // promise returned by the following await is picked up
                // by loop's await statement which suspends the test
                // method)
                await once(writable, "drain");
            }
        }

        // End the writable stream
        writable.end();

        // Wait until the stream has finished (is no longer writable, an
        // error happens or is closed prematurely such as when stream is
        // destroyed while it still has some data that wasn't flushed to
        // the underlying resource). Note that the `finished` method used
        // here is the `util.promisify` version of the `stream.finished`
        // method
        await finished(writable);

        // Verify the data written to the stream
        assert.deepEqual(writable._data, ["ABCD", "091231", "tuta", "bnmsds", "ufds"]);
    });
});