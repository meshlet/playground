import { createClient } from 'redis';
import {
  Environment,
  registerCleanupTask
} from '../../common/common.module';

/** Redis server connection string. */
const redisUri = `redis://${Environment.REDIS_DB_ADDRESS}:${Environment.REDIS_DB_PORT}`;

/**
 * Attempts to establish a connection to the Redis server. If
 * successfull promise is resolved with a Redis client instance,
 * otherwise promise gets rejected with an error.
 */
export async function _connectRedis() {
  const client = createClient({
    url: redisUri,
    legacyMode: true
  });

  // Listen for Redis client events
  client.on('ready', () => {
    console.log('Connection to the Redis server has been established.');
  });
  client.on('end', () => {
    console.log('Connection to the Redis server has been closed.');
  });
  client.on('error', (err: Error) => {
    /** @todo What do do in case of an error? In case of network error, redis client tries to reconnect. */
    console.log(`Redis client reported an error: ${err.message}`);
  });

  // Register the clean-up task that disconnects from the Redis
  // server upon process termination.
  registerCleanupTask(() => {
    return client.disconnect();
  });

  // Establish connection to the Redis server
  await client.connect();
  return client;
}
