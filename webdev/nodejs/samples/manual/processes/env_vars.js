/**
 * Illustrates accessing environment variables.
 */
for (let envVar in process.env) {
    console.log(`${envVar}: ${process.env[envVar]}`);
}