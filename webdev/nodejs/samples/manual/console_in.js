/**
 * Illustrates the console input.
 */
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
const readlineSync = require("readline-sync");

(async () => {
    // Using readline to get input from the input stream (in this case stdin)
    await (async () => {
        function readInput(question) {
            return new Promise(resolve => {
                readline.question(question, input => {
                    resolve(input);
                });
            });
        }

        // Prompt the user for the name
        let name = await readInput("Enter your name: ");

        // Prompt the user for the surname
        let surname = await readInput("Enter your surname: ");

        // Print the entered info and close the stream
        console.log(`Name: ${name}, Surname: ${surname}`);
        readline.close();
    })();

    // Use readline-sync to let user enter a password. Unlike readline,
    // readlineSync is synchronous
    (() => {
        let username = readlineSync.question("Enter your username: ");
        let password = readlineSync.question("Enter your password: ", {
            hideEchoBack: true
        });

        console.log(`Username: ${username}, Password: ${password}`);
    })();
})();