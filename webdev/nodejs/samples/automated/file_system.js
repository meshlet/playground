/**
 * Illustrates the NodeJS file system module providing utilities
 * for working with files and directories.
 */
const assert = require("assert").strict;
const fs = require("fs");
const util = require("util");
const finished = util.promisify(require("stream").finished);

describe("File System", function () {
    const TEST_FILE_NAME = Date.now().toString() + ".txt";

    // Create a file before each test so that test code doesn't have
    // to do this itself. Note that file will be truncated if it already
    // exists, so there's no need to remove the file after each test is
    // run
    beforeEach(function () {
        // Synchronously write an empty string to the file using
        // writeFileSync. This will create the file if it doesn't
        // exist already
        fs.writeFileSync(TEST_FILE_NAME, "");
    });

    // Remove the test file after all the tests have completed
    after(function () {
        fs.unlinkSync(TEST_FILE_NAME);
    });

    it('illustrates fs.open and fs.close methods', function () {
        // Promise returned to Mocha to make it wait for async work
        // to complete
        return new Promise(resolve => {
            // Open the test file in read/write mode. An exception will
            // be thrown if file doesn't exist
            fs.open(TEST_FILE_NAME, "r+", (err, fd) => {
                // We don't expect any errors in which case fd will not be -1
                assert.equal(err, null);
                assert.notEqual(fd, -1);

                // Asynchronously close the file descriptor
                fs.close(fd, err => {
                    // We expect no errors
                    assert.equal(err, null);
                    resolve();
                });
            });
        });
    });

    it('illustrates fs.openSync and fs.closeSync methods', function () {
        // Open the test file in read/write mode. An exception is
        // thrown if the doesn't exist (mustn't happen as the file
        // exists)
        let fd = -1;
        assert.doesNotThrow(() => {
            fd = fs.openSync(TEST_FILE_NAME, "r+");
        });
        assert.notEqual(fd, -1);

        // Synchronously close the file
        assert.doesNotThrow(() => {
            fs.closeSync(fd);
        });
    });

    it('illustrates fs.access method', function () {
        // The aggregated promise is returned to Mocha to make it
        // wait for the async work to complete
        return Promise.all([
            new Promise(resolve => {
                // Confirm that the test file exists in the current directory
                fs.access(TEST_FILE_NAME, fs.constants.F_OK, err => {
                    assert.equal(err, null);

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            }),

            new Promise(resolve => {
                // Confirm that the test file is readable and writable
                fs.access(TEST_FILE_NAME, fs.constants.R_OK | fs.constants.W_OK, err => {
                    assert.equal(err, null);

                    // Resolve the promise returned to Mocha
                    resolve();
                });
            }),
        ]);
    });

    it('illustrates fs.accessSync method', function () {
        // The test assumes that the file with the following name doesn't
        // exist in the current directory
        const filename = Date.now().toString() + "." + Date.now().toString();

        // Confirms that the file isn't accessible from the current process
        assert.throws(() => {
            fs.accessSync(filename, fs.constants.F_OK);
        },
        {
            name: "Error"
        });

        // Confirms that the file can't be read or written by the current process
        assert.throws(() => {
            fs.accessSync(filename, fs.constants.R_OK | fs.constants.W_OK);
        },
        {
            name: "Error"
        });
    });

    it('illustrates fs.appendFile method', async function () {
        // The name of the file to append data to. The first call to
        // fs.appendFile should create the file
        const filename = Date.now().toString() + "." + Date.now().toString();

        // Several lines of data to be appended to the test file
        const lines = [
            "line 1\n",
            "line 2\n",
            "line 3"
        ];

        // Fire the append operations one by one and wait for each one to finish.
        // Note that it is important that we block until each write completes,
        // otherwise writes might complete out-of-order
        for (const line of lines) {
            await new Promise(resolve => {
                fs.appendFile(filename, line, "utf8", err => {
                    // There should be no errors
                    assert.equal(err, null);
                    resolve();
                });
            });
        }

        // Verify the file contents. Specifying encoding makes sure the
        // read data is interpreted as UTF-8 string. Omitting the encoding
        // would cause the method to return Buffer object
        const fileData = fs.readFileSync(filename, "utf8");
        assert.deepEqual(fileData, lines.join(""));

        // Remove the created file
        fs.unlinkSync(filename);
    });

    it('illustrates fs.copyFileSync method', function () {
        // The destination filename
        const dstFilename = Date.now().toString() + "." + Date.now().toString();

        // Synchronously write some text to the test file
        fs.writeFileSync(TEST_FILE_NAME, "some text");

        // Copy test file to a new file with `dstFilename` name. Copy
        // operation would throw an exception if the file already exists
        // because of the COPYFILE_EXCL flag
        assert.doesNotThrow(() => {
            fs.copyFileSync(TEST_FILE_NAME, dstFilename, fs.constants.COPYFILE_EXCL);
        });

        // Assert that the new file contents matches the contents of the
        // test file
        assert.deepEqual(
            fs.readFileSync(dstFilename, "utf8"),
            fs.readFileSync(TEST_FILE_NAME, "utf8"));

        // Remove the new file
        fs.unlinkSync(dstFilename);
    });

    it('illustrates the `createReadStream` method', async function () {
        // Write some data to the test file synchronously
        fs.writeFileSync(TEST_FILE_NAME, "¥ab§©¶ÀÈÐ");

        // Create a readable stream. The data read from the file will be
        // encoded to a string using UTF-8 encoding
        const readable = fs.createReadStream(TEST_FILE_NAME, {
            encoding: "utf8"
        });

        // Attach a listener for the `data` event which puts the stream
        // into flowing mode causing all data to be read from the file
        let dataRead = "";
        readable.on("data", chunk => {
            dataRead += chunk;
        });

        // Wait for the readable stream to finish
        await finished(readable);

        // Verify the data read from the file
        assert.deepEqual(dataRead, "¥ab§©¶ÀÈÐ");
    });

    it('illustrates the `createWriteStream` method', async function () {
        // Create a writable stream from the test file
        const writable = fs.createWriteStream(TEST_FILE_NAME);

        // Write several chunks of data to the writable stream
        for (const chunk of ["¼ÂÇ", "ÑÖ", "Øßëó", "ØÝ"]) {
            writable.write(chunk, "utf8");
        }

        // End the writable stream and wait for it to finish
        writable.end();
        await finished(writable);

        // Verify the data written to the file
        assert.deepEqual(
            fs.readFileSync(TEST_FILE_NAME, "utf8"),
            "¼ÂÇÑÖØßëóØÝ");
    });

    it('illustrates the `ftruncate` method', async function () {
        // Write some text to the test file. Note that this string is
        // decoded to a 16-byte Buffer using UTF-8 encoding
        fs.writeFileSync(TEST_FILE_NAME, "¥ab§©¶ÀÈÐ");

        // Promisify the `ftruncate` method
        const ftruncate = util.promisify(fs.ftruncate);

        // Truncate the file to 5 bytes. Note that this will throw away
        // the second by of the `§` character
        const fd = fs.openSync(TEST_FILE_NAME, "r+");
        await ftruncate(fd, 5);

        // Verify the contents of the file after it was truncated
        assert.deepEqual(
            fs.readFileSync(fd),
            Buffer.from([0xc2, 0xa5, 0x61, 0x62, 0xc2]));

        // Close the file descriptor
        fs.closeSync(fd);
        
        // If truncated file is encoded to string, the last byte will be
        // encoded to a `�` replacement character, as 0xc2 byte doesn't
        // represent any valid UTF-8 character encoding
        assert.deepEqual(fs.readFileSync(TEST_FILE_NAME, "utf8"), "¥ab�");
    });
});