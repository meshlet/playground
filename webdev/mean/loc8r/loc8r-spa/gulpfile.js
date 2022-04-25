const gulp = require('gulp');
const { spawn } = require('child_process');
const filesExist = require('files-exist');
const merge = require('merge-stream');

/**
 * @todo Compiled CSS and client-side Javascript should be minified in
 * production in order to reduce BW. Minifying server-side Javascript
 * is not equally important, but should be done anyways in production.
 */

/**
 * A helper function that spawns a child process to execute the provided
 * command.
 *
 * @return A promise that resolves (with 0 exit code) or rejects (with
 * an error) once process exits.
 */
function exec(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit' });

    proc.on('exit', exitCode => {
      if (exitCode === 0) {
        resolve(exitCode);
      }
      else {
        reject(new Error(`Process exited with error code: ${exitCode}`));
      }
    });
    proc.on('error', error => {
      reject(error);
    });
  });
}

/**
 * Returns a gulp task that compiles each of the TypeScript
 * projects whose root directories are passed in the projRootDirs
 * array.
 */
function buildCompileTsTask(projRootDirs) {
  return () => {
    return exec(
      process.execPath,
      ['node_modules/.bin/tsc', '-b', projRootDirs.join(' ')]
    );
  }
}

/**
 * A task that compiles TS projects referenced by modules/tsconfig.json.
 */
gulp.task('compileTsSrc', buildCompileTsTask(['modules']));
const compileTsSrc = gulp.task('compileTsSrc');

/**
 * Returns a gulp task that runs Eslint for the project.
 */
function buildEslintTask() {
  return () => {
    return exec(
      process.execPath,
      [
        'node_modules/.bin/eslint',
        '--cache',
        '--cache-location', './.eslintcache',
        '--ext', '.ts',
        'modules/loc8r-common', 'modules/loc8r-restapi'
      ]
    );
  }
}

/**
 * The following copies static resources to dist folder including external libraries
 * from node_modules.
 *
 * @note By default, files-exist throws an error if files with full filenames
 * (without globs) are not found. This makes sure that task fails if some javascript
 * libraries from node_modules are not found. In some cases we want to make sure
 * error is thrown even for paths with globs, which is supported by files-exist as
 * well.
 */
 function cpStaticResources() {
  // Filenames must be grouped by their base path so that dedicated tasks can
  // copy them into the correct dest directory. In case where `checkGlobs`
  // option differ between different globs with the same base path, a different
  // file group can be created.
  const fileGroups = [
    {
      base: undefined,
      dest: './dist/loc8r-restapi/env-configs',
      checkGlobs: true,
      files: [
        './modules/loc8r-restapi/env-configs/.*'
      ]
    }
  ];

  // Build an array of tasks for each of the file groups
  const tasks = fileGroups.map(fileGroup => {
    return gulp.src(
      filesExist(fileGroup.files, {
        exceptionMessage: 'Some files are missing. Have you run `npm install`?',
        checkGlobs: fileGroup.checkGlobs
      }),
      fileGroup.base ? { base: fileGroup.base, since: gulp.lastRun(cpStaticResources) } : { since: gulp.lastRun(cpStaticResources) })
      .pipe(gulp.dest(fileGroup.dest));
  });

  // Merge all the task streams so that task finishes only when all streams end
  return merge(tasks);
}

/**
 * A task that runs ESLinter.
 */
gulp.task('lint', buildEslintTask());
const runEslint = gulp.task('lint');

/**
 * Note that linter must run first before TS scripts are compiled.
 */
const buildTask = gulp.parallel(gulp.series(runEslint, compileTsSrc), cpStaticResources);
exports.build = buildTask;
exports.default = buildTask;

/**
 * The build and watch task does everything done by the default task, as well as
 * setup file watchers so that SCSS and TS are automatically recompiled to CSS
 * and JS on every file change and any new view (in src/app_server/views) and
 * image (in src/public/images) are copied to dist.
 *
 * @note Expectation is that default build task is run before the watch task
 * to perform initial setup. This could be achieved with the watch task as well
 * by passing in options with `ignoreInitial: false`, however this doesn't play
 * well with running app via nodemon. Nodemon should ideally wait for the build
 * task to complete before running, however this is not possible as watch task
 * blocks indefinitely preventing nodemon from starting. Running the build task
 * task first, then starting nodemon and watch task in parallel works around this.
 */
exports.watch = () => {
  gulp.watch(
    ['./modules/loc8r-common/**/*.ts', './modules/loc8r-restapi/**/*.ts'],
    gulp.series(runEslint, compileTsSrc));
};
