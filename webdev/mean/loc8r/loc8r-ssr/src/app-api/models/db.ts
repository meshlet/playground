/**
 * Uses Mongoose to establish a connection to a MongoDB and monitors
 * connection state, terminating the connection once the app is
 * closed or restarted. Additionally, sets up mongoose's global
 * options.
 */
import mongoose from 'mongoose';
import { Environment } from '../../common/common.module';

// Default database URI
const dbUri = `mongodb://${Environment.DB_ADDRESS}:${Environment.DB_PORT}/${Environment.DB_NAME}`;

/**
 * The consumer can use this promise to wait for mongoose to open the
 * default connection to MongoDB.
 */
export async function _openDefaultConnection() {
  try {
    // Establish connection to the database
    await mongoose.connect(dbUri);
  }
  catch (e) {
    throw new Error(`Mongoose couldn't connect to: ${dbUri}`);
  }
}

// Register event listeners for a few events we're interested in
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connected to: ${dbUri}`);
  })
  .on('disconnected', () => {
    console.log(`Mongoose disconnected from: ${dbUri}`);
  })
  .on('error', (err: Error) => {
    console.log(`Mongoose connection error: ${err.message}`);
  });

/**
 * @todo This is not the best place to handle signals. These should be more
 * centralized, potentially in the main module or in utils module. DB module
 * can expose the clean-up function that is to be called when app is about
 * to exit.
 *
 * Mongoose doesn't automatically close connection once the process exits.
 * This has to be done manually by listening to signals received by the
 * process.
 */
function shutdownHelper(msg: string, cb: () => void) {
  mongoose.connection.close(() => {
    console.log(`${msg}`);
    cb();
  });
}

// SIGINT signal is sent to the process once user attempts to terminate
// the process (usually with Ctrl+C).
process.on('SIGINT', () => {
  shutdownHelper('HTTP server is exiting...', () => {
    process.exit();
  });
});

// Heroku sends SIGTERM signal to instruct process to terminate
process.on('SIGTERM', () => {
  shutdownHelper('Heroku app is exiting...', () => {
    process.exit();
  });
});

// When Nodemon detects file change it attempts to restart the process by
// sending it a SIGUSR2 signal. Nodemon wrapper reacts to this signal itself
// by terminating the process. This is why it is important to listen to the
// SIGUSR2 only once (using process.once) and, instead of exiting the process,
// signal SIGUSR2 again to our process. This SIGUSR2 signal is then processed
// by the Nodemon wrapper.
process.once('SIGUSR2', () => {
  shutdownHelper('HTTP server is restarted by Nodemon...', () => {
    // process.kill sends a signal to the process (it does not `kill` the process)
    process.kill(process.pid, 'SIGUSR2');
  });
});
