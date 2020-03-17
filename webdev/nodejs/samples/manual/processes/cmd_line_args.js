/**
 * Illustrates parsing command line arguments.
 */
const yargs = require("yargs");

const argv = yargs
    .command("command1", "Specifies options for the command 1", {
        option1: {
            description: "option 1 for the command 1",
            type: "string",
            alias: "cmd1"
        }
    })
    .option("flag1", {
        alias: "f1",
        description: "Global flag 1",
        type: "number"
    })
    .help()
    .alias("help", "h")
    .argv;