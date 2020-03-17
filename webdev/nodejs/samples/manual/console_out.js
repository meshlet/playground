/**
 * Illustrates the console output.
 */
const chalk = require("chalk");
const ProgressBar = require("progress");

// Prints multiple values with single console.log call
(() => {
    const x = "x";
    const y = "y";
    console.log(x, y);
})();

// Formatting with console.log
(() => {
    console.log(
        "Number: %d, Integer: %i, String: %s, Object: %o",
        2.45,
        8.456,
        "ABC",
        {
            name: "Mickey",
            surname: "Mouse"
        });
})();

// Using console.count
(() => {
    console.count("Mickey");
    console.count("Mickey");
    console.count("Tony");
    console.count("Tony");
    console.count("Tony");
})();

// Print the stack trace
(() => {
    console.trace();
})();

// Measure time spent by a function
(function someFun() {
    // Log the start time
    console.time("someFun")

    // Do some work

    // Log the end time
    console.timeEnd("someFun");
})();

// Illustrates using chalk to style console text
(() => {
    console.log(chalk.red("I am red!"));
})();

// Illustrates using progress to create console progress bar
(() => {
    const bar = new ProgressBar(":bar", { total: 50 });
    const interval = setInterval(() => {
        bar.tick();
        if (bar.complete) {
            clearInterval(interval);
        }
    }, 50);
})();