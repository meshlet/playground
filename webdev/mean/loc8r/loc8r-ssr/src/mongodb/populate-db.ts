/**
 * Populates local MongoDB database with test data.
 */
import { defaultDbReady } from '../app_server/models/db';
import { testData } from './test-data';

(async function() {
  try {
    // Wait for DB
    await defaultDbReady;

    for (const data of testData) {
      // Remove any documents from the collection
      await data.model.deleteMany();

      // Insert the documents
      await data.model.insertMany(data.documents);
    }
    console.log('DB has been successfully populated with test data.');

    // Shutdown gracefully
    process.kill(process.pid, 'SIGINT');
  }
  catch (e) {
    console.log(`Failed to populate DB with test data due to: ${e}`);
    process.exit(-1);
  }
})();
