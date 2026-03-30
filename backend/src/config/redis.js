const Redis = require('ioredis');

let redis = null;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          console.error('❌ Redis: Max retries reached. Giving up.');
          return null; // Stop retrying
        }
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: false,
    });

    redis.on('connect', () => {
      console.log('✅ Redis Connected Successfully');
    });

    redis.on('error', (err) => {
      console.error(`❌ Redis Connection Error: ${err.message}`);
    });

    redis.on('close', () => {
      console.log('⚠️  Redis Connection Closed');
    });

    return redis;
  } catch (error) {
    console.error(`❌ Redis Setup Error: ${error.message}`);
    return null;
  }
};

const getRedis = () => {
  if (!redis) {
    return connectRedis();
  }
  return redis;
};

module.exports = { connectRedis, getRedis };
