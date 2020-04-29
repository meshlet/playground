/**
 * A module that provides means to connect to and manage the MongoDB
 * database. The module will use the in-memory MongoDB database if
 * requested.
 */
const mongoose = require("mongoose");

// The in-memory Mongo DB is used if running in test Node environment and
// IN_MEMORY_DB environment variable is set to 1.
const useInMemoryDb = process.env.NODE_ENV === "test" && process.env.IN_MEMORY_DB === "1";

// Create the in-memory Mongo DB server if needed
let memoryDbServer = undefined;
if (useInMemoryDb) {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryDbServer = new MongoMemoryServer();
}

// Establishes connection to the Mongo database
exports.connect = async () => {
    try {
        const uri =
            useInMemoryDb ?
                await memoryDbServer.getConnectionString() :
                "mongodb://localhost:27017/socialnetwork";

        await mongoose.connect(uri, {
            useNewUrlParser: true
        });

        // Attach a listener for the `error` event that is emitted in case of
        // errors in communication with the MongoDB database
        mongoose.connection.on("error", err => {
            console.log(err.message);
        });
    }
    catch (e) {
        // Throw an exception which will make the NodeJS process exit gracefully
        throw new Error("Failed to connect to the MongoDB database");
    }
};

// Drops the database, closes the database connection and stops the in-memory
// mongo server if used
exports.destroy = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    if (useInMemoryDb) {
        await memoryDbServer.stop();
    }
};

// Deletes all documents from all collections
exports.clearCollections = async () => {
    Object.getOwnPropertyNames(mongoose.connection.collections).forEach(async collectionKey => {
        const collection = mongoose.connection.collections[collectionKey];
        await collection.deleteMany();
    });
};