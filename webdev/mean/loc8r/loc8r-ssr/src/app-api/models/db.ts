/**
 * Uses Mongoose to establish a connection to a MongoDB and monitors
 * connection state, terminating the connection once the app is
 * closed or restarted.
 */
import mongoose from 'mongoose';
import { DB_ADDRESS, DB_PORT, DB_NAME } from '../../utils/utils.module';
import { _LocationModel as LocationModel } from './locations';

// Default database URI
const dbUri = `mongodb://${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`;

// The consumer can use this promise to wait for the following:
// - outcome of opening the default mongoose connection to MongoDB
// - outcome of compiling DB indexes for all the models used in the app
export const _defaultDbReady = (async function() {
  try {
    // Establish connection to the database
    await mongoose.connect(dbUri);
  }
  catch (e) {
    throw new Error(`Mongoose couldn't connect to: ${dbUri}`);
  }

  try {
    // Wait for all the DB indexes to be created
    await Promise.all([
      LocationModel.init()
    ]);
  }
  catch (e) {
    throw new Error(`Failed to build DB indexes. ${e instanceof Error ? e.message : ''}`);
  }
})();

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

// Mongoose doesn't automatically close connection once the process exits.
// This has to be done manually by listening to signals received by the
// process.
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
