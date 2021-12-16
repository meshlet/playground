/**
 * Populates local MongoDB database with test data.
 */
import { _defaultDbReady as defaultDbReady } from '../models/db';
import { _testData as testData } from './test-data';

(async function() {
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
})()
  .then(undefined, (e) => {
    console.log(`Failed to populate DB with test data. ${e instanceof Error ? e.message : ''}`);
  });
