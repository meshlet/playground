const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const filesExist = require('files-exist');
const merge = require('merge-stream');
const concat = require('gulp-concat');

/**
 * The following Gulp task uses sass module to compile SASS/SCSS scripts to CSS
 * styles.
 */
function compileScss() {
  return gulp.src('./src/public/stylesheets/*.scss')
    .pipe(sass({
      includePaths: ['node_modules']
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/public/stylesheets'));
}

/**
 * Create a TS project using the tsconfig.json file as the source of Typescript
 * configuration.
 */
const tsProject = ts.createProject('tsconfig.json');

/**
 * Compiler Typescript sources including generating sourcemaps as external files.
 *
 * @note Native Typescript's sourcemap generation mechanism is not supported by
 * Gulp, hence the need to use a dedicated module.
 *
 * @note Setting base to './src' makes sure that ./src part of the patch is
 * removed when writing the file with gulp.dest. This is desired behavior
 * as we don't need src/ directory within dist/.
 */
function compileTs() {
  const tsResult = gulp.src('./src/**/*.ts', { base: './src' })
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
  // For info on how sourceRoot option works see https://www.npmjs.com/package/gulp-sourcemaps
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
    .pipe(gulp.dest('./dist'));
}

/**
 * The following copies static resources to dist folder including external libraries
 * from node_modules.
 *
 * @note While src/public/stylesheets and src/public/scripts are technically
 * static resources, both need to be compiled into their final form before placing
 * them into dist. Hence dedicated tasks (compileScss and compileTs) handle these.
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
      base: './src',
      dest: './dist',
      checkGlobs: false,
      files: [
        './src/app_server/views/**/*.*',
        './src/public/images/**/*.*'
      ]
    },
    {
      base: './src',
      dest: './dist',
      checkGlobs: true,
      files: [
        './src/public/webfonts/**/*.*'
      ]
    },
    {
      base: undefined,
      dest: './dist/public/scripts',
      checkGlobs: false,
      files: [
        './node_modules/jquery/dist/jquery.slim.min.js',
        './node_modules/popper.js/dist/umd/popper.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js'
      ]
    },
    {
      base: undefined,
      dest: './dist/public/webfonts',
      checkGlobs: true,
      files: [
        './node_modules/@fortawesome/fontawesome-free/webfonts/*.*'
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
      fileGroup.base ? { base: fileGroup.base } : {})
      .pipe(gulp.dest(fileGroup.dest));
  });

  // Merge all the task streams so that task finishes only when all streams end
  return merge(tasks);
}

/**
 * A task that runs ESLinter.
 */
function runEslint() {
  return gulp.src('./src/**/*.ts')
    .pipe(eslint({ configFile: '.eslintrc.js' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

/**
 * The default task runs SCSS->CSS, copy static resources to dist and ESLinter/
 * compile TS tasks in parallel. Note that linter must run first before TS scripts
 * are compiled.
 */
const buildTask = gulp.parallel(gulp.series(runEslint, compileTs), compileScss, cpStaticResources);
exports.build = buildTask;
exports.default = buildTask;

/**
 * The build and watch task does everything done by the default task, as well as
 * setup file watchers so that SCSS and TS are automatically recompiled to CSS
 * and JS on every file change and any new view (in src/app_server/views) and
 * image (in src/public/images) are copied to dist.
 *
 * @note Expectation is that default gulpBuild task is run before the watch task
 * to perform initial setup. This could be achieved with the watch task as well
 * by passing in options with `ignoreInitial: false`, however this doesn't play
 * well with running app via nodemon. Nodemon should ideally wait for the build
 * task to complete before running, however this is not possible as watch task
 * blocks indefinitely preventing nodemon from starting. Running tasks in the
 * order gulpBuild -> nodemon -> watch works around this.
 */
exports.watch = () => {
  gulp.watch('./src/public/stylesheets/*.scss', compileScss);
  gulp.watch('./src/**/*.ts', gulp.series(runEslint, compileTs));

  // We want to monitor only some paths.
  gulp.watch(
    ['./src/app_server/views/*.*', './src/public/images/*.*'],
    cpStaticResources);
};

/**
 * Export ESLinter task.
 */
exports.lint = runEslint;
