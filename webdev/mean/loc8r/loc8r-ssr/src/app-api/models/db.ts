/**
 * Uses Mongoose to establish a connection to a MongoDB and monitors
 * connection state, terminating the connection once the app is
 * closed or restarted. Additionally, sets up mongoose's global
 * options.
 */
import mongoose from 'mongoose';
import { Environment } from '../../utils/utils.module';
import { _LocationModel as LocationModel } from './location.model';

/**
 * Set mongoose's global options.
 *
 * - satinizeFilter: prevents query injection attacks
 * - sanitizeProjection: prevents selecting arbitrary fields via select method
 * - castNonArrays: prevent mongoose from wrapping non-array value in an array before casting.
 */
mongoose.set('sanitizeFilter', true);
mongoose.set('sanitizeProjection', true);
mongoose.Schema.Types.Array.options.castNonArrays = false;
mongoose.Schema.Types.DocumentArray.options.castNonArrays = false;

/**
 * Override some of mongoose's built-in casting functions.
 */
const originalNumberCast = mongoose.Schema.Types.Number.cast();
mongoose.Schema.Types.Number.cast((v: unknown) => {
  if (typeof v === 'string' && v.length > 50) {
    // We don't want to parse strings whose length is over 50 characters.
    // Under no circumstances do we need numbers so large or small that
    // 50 digits are needed to represent it.
    return NaN;
  }
  // mongoose.Schema.Types.Number.cast has return type set to Function, hence
  // eslint complains about `unsafe return of any`.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return originalNumberCast(v);
});

// Default database URI
const dbUri = `mongodb://${Environment.DB_ADDRESS}:${Environment.DB_PORT}/${Environment.DB_NAME}`;

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
    // Wait for all mongoose models to become ready
    // @note Append promises for other models below
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
