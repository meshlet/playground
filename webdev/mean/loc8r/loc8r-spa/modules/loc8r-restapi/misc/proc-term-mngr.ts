/**
 * @file Process termination manager.
 *
 * The purpose of this module is to listen for different
 * signals that mark process termination and run cleanup
 * tasks before process is allowed to terminate.
 */

/**
 * The cleanup callback type describing function signature to be used for
 * cleanup callbacks.
 */
type CleanupCallbackT<Args extends unknown[]> = (...args: Args) => Promise<unknown>;

/**
 * An array of clean-up tasks. For each task, a callback function
 * and arguments it will be called with is kept.
 */
const cleanupTasks: Array<{
  cb: (...args: unknown[]) => Promise<unknown>,
  args: unknown[]
}> = [];

/**
 * A function used to append clean-up tasks. The caller provides a
 * task callback as well as the arguments to be passed to the callback
 * at eventual termination.
 *
 * @note Clean-up callback must return a promise that is resolved
 * if clean-up task completes successfully, fails otherwise.
 */
export function _registerCleanupTask<T extends unknown[]>(callback: CleanupCallbackT<T>, ...args: T): void;
export function _registerCleanupTask(callback: (...args: unknown[]) => Promise<unknown>, ...args: unknown[]) {
  // Register a new clean-up task
  cleanupTasks.push({
    cb: callback,
    args: args
  });
}

/**
 * Runs clean-up tasks and returns compound promise that will be
 * resolved
 */
function processCleanupTasks() {
  const promises: Array<Promise<unknown>> = [];
  for (const task of cleanupTasks) {
    promises.push(task.cb(...task.args));
  }
  return Promise.all(promises);
}

/**
 * A helper that runs clean-up tasks and terminates the process
 * depending on the outcome of the clean-up as well as the type
 * of the signal received.
 */
function shutdownHelper(signal: 'SIGINT' | 'SIGTERM' | 'SIGUSR2') {
  // Process clean-up tasks
  processCleanupTasks()
    .then(() => {
      console.log(`Process is gracefully exiting after receving a ${signal} signal.`);
      // All clean-up tasks have completed. Terminate the process.
      switch (signal) {
        case 'SIGINT':
          process.exit();
          // ESlint reports a false positive fallthrough error here.
          // esling-disable-next-line @no-fallthrough
        case 'SIGTERM':
          process.exit();
          // ESlint reports a false positive fallthrough error here.
          // esling-disable-next-line @no-fallthrough
        case 'SIGUSR2':
          // SIGUSR2 signal is used by Nodemon to restart the process. Hence,
          // instead of exiting the process we re-send the same signal that
          // is then processed by the Nodemon itself.
          process.kill(process.pid, 'SIGUSR2');
      }
    })
    .catch(() => {
      console.log('Process is exiting with an error because clean-up couldn\'t be completed.');
      process.exit(-1);
    });
}

// SIGINT signal is sent to the process once user attempts to terminate
// the process (usually with Ctrl+C).
process
  .on('SIGINT', () => {
    shutdownHelper('SIGINT');
  })
  // Heroku sends SIGTERM signal to instruct process to terminate
  .on('SIGTERM', () => {
    shutdownHelper('SIGTERM');
  })
  // When Nodemon detects file change it attempts to restart the process by
  // sending it a SIGUSR2 signal. Nodemon wrapper reacts to this signal itself
  // by terminating the process. This is why it is important to listen to the
  // SIGUSR2 only once (using process.once) and, instead of exiting the process,
  // signal SIGUSR2 again to our process (handled in shutdownHelper). This
  // SIGUSR2 signal is then processed by the Nodemon wrapper.
  //
  // @note Due to a bug (https://github.com/remy/nodemon/issues/1889), Nodemon
  // might kill the script before clean-up tasks are processed even though we
  // have captured the SIGUSR2 signal. Killing will happen even though script
  // doesn't re-signal the SIGUSR2.
  .once('SIGUSR2', () => {
    shutdownHelper('SIGUSR2');
  });
