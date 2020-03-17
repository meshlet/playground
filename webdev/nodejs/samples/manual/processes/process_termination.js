/**
 * Illustrates various ways to terminate a NodeJS process.
 */
const yargs = require("yargs");

const argv = yargs
    .option("exit_with_zero", {
        alias: "exit0",
        description: "Exits process with exit code 0 (success)",
        type: "boolean"
    })
    .option("exit_with_one", {
        alias: "exit1",
        description: "Exits process with exit code 1 (failure)",
        type: "boolean"
    })
    .option("exit_with_term", {
        alias: "term",
        description: "Sends SIGTERM to itself",
        type: "boolean"
    })
    .help()
    .alias("help", "h")
    .argv;

// This exit code is returned when program is terminated gracefully
// (i.e. using SIGTERM)
process.exitCode = 10;

if (argv.exit0) {
    // Terminate the process with zero exit code
    process.exit();
}
else if (argv.exit1) {
    // Terminate the process with exit code 1
    process.exit(1);
}
else if (argv.term) {
    process.on("SIGTERM", () => {

    });

    // Send SIGTERM to the process
    process.kill(process.pid, "SIGTERM");
}
else {
    throw TypeError("Unknown command line option");
}