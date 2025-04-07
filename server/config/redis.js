const Redis = require('ioredis');

const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const client = new Redis(redisUrl, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3
  });

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  return client;
};

const redisClient = createRedisClient();

module.exports = {
  redisClient
};