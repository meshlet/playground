/**
 * Uses Mongoose to establish a connection to a MongoDB and monitors
 * connection state, terminating the connection once the app is
 * closed or restarted. Additionally, sets up mongoose's global
 * options.
 */
import mongoose from 'mongoose';
import { _Env as Environment } from '../misc/env-parser';
import { _registerCleanupTask as registerCleanupTask } from '../misc/proc-term-mngr';

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

// Register the clean-up task that closes mongoose connection upon
// process termination
registerCleanupTask(() => {
  return mongoose.connection.close();
});
