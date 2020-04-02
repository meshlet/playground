/**
 * Illustrates the NodeJS net module that provides API for creating
 * TCP (sockets) or IPC (named pipes/domain sockets) servers and
 * clients.
 */
const net = require("net");
const {once} = require("events");
const assert = require("assert").strict;

describe("Net", function () {
    it('illustrates client-server socket communication', async function () {
        // Data received by client and server for verification purposes
        const dataReceivedByClient = [];
        const dataReceivedByServer = [];

        // Data sent to the client as response to each chunk of data
        // sent by the client
        const serverData = [
            Buffer.from([0x9a, 0x88, 0x00]),
            Buffer.from([0xaa, 0x1f]),
            Buffer.from([0xff, 0x55, 0xbc, 0x10]),
            Buffer.from([0xee])
        ];

        // Create a new TCP server and pass in the listener invoked for
        // each new connection request
        const server = net.createServer(socket => {
            // Attach a listener for the `data` event to the socket.
            socket.on("data", chunk => {
                //console.log(chunk);
                dataReceivedByServer.push(...chunk);

                // Sent a response to the client
                socket.write(serverData.shift());
            });
        });

        // Start listening for connections. Wait until `listening` event
        // is emitted, the callback passed to the `listen` method is
        // register as listener for that event. Note that port is left
        // as 0 so will be automatically assigned by the OS. The port
        // is passed back when resolving the promise
        const port = await new Promise(resolve => {
            server.listen(0, "localhost", () => {
                // Resolve the promise with the port that server is listening
                // at
                resolve(server.address().port);
            });
        });

        // Create a connection to the server and wait until the connection
        // is established. This happens once the `connect` event is emitted
        // and the last argument of the `createConnection` method is the
        // listener for that event. Note that the port client connects to
        // is the one that server is listening at
        const clientSocket = await new Promise(resolve => {
            const socket = net.createConnection(port, "localhost", () => {
                // The connection has been established. Attach a listener
                // for the `data` event that is emitted for each chunk of
                // data that client receives from the server
                let counter = 0;
                socket.on("data", chunk => {
                    dataReceivedByClient.push(...chunk);

                    // If server has no responses left to send, end the connection
                    if (serverData.length === 0) {
                        // End the connection (sends FIN packet to the server). Note that
                        // this will also make the server send the FIN packet back to the
                        // client ensuring that connection is completely closed. This is
                        // because the `allowHalfOpen` option is by default false when
                        // creating the server, hence half-opened TCP connections are not
                        // allowed.
                        socket.end();
                    }
                });

                // Resolve the promise passing the client socket to it
                resolve(socket);
            });
        });

        // Asynchronously generates chunks sent to the server. Each chunk
        // is generated with the delay of at least the specified amount of
        // milliseconds
        function* generateClientChunks(delay) {
            const chunks = [
                Buffer.from([0x83, 0xaf]),
                Buffer.from([0xff, 0x91, 0xbe]),
                Buffer.from([0x00]),
                Buffer.from([0xaa, 0xbb, 0xcc, 0xdd, 0xee])
            ];

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

        // Write chunks to server. Note that execution is suspended after
        // writing each chunk, making it possible for server to process
        // the chunk and send its response back to the client
        for await (const chunk of generateClientChunks(10)) {
            clientSocket.write(chunk);
        }

        // Close the server. This stops server from accepting new connections,
        // while allowing existing connections to terminate gracefully (which
        // essentially means that the connection can remain alive as long as
        // it needs to)
        server.close();

        // Wait for the server to emit the `close` event which means
        // that there all connections have been terminated
        await once(server, "close");

        // Verify data received by the client as well as data received by
        // the server
        assert.deepEqual(
            dataReceivedByClient,
            [0x9a, 0x88, 0x00, 0xaa, 0x1f, 0xff, 0x55, 0xbc, 0x10, 0xee]);
        assert.deepEqual(
            dataReceivedByServer,
            [0x83, 0xaf, 0xff, 0x91, 0xbe, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0xee]);
    });

    it.skip('illustrates half opened socket connection', function () {
        // Implement this test
    });
});