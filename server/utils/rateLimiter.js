const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

class RateLimiter {
  async isAllowed(key, limit, window) {
    const now = Date.now();
    const windowStart = now - (window * 1000);
    
    const pipeline = redis.pipeline();
    pipeline.zadd(key, now, now.toString());
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    pipeline.expire(key, window);
    
    const results = await pipeline.exec();
    const count = results[2][1];
    
    return count <= limit;
  }

  async checkRateLimit(userId, operation, limit, window) {
    const key = `ratelimit:${userId}:${operation}`;
    const allowed = await this.isAllowed(key, limit, window);
    
    if (!allowed) {
      throw new Error(`Rate limit exceeded. Please try again later.`);
    }
  }
}

const rateLimiter = new RateLimiter();

const rateLimit = (options = {}) => {
  const {
    windowMs = 60 * 1000,
    max = 10,
    keyGenerator = (req) => req.ip,
    handler = (req, res) => {
      res.status(429).json({
        error: 'Too many requests, please try again later.'
      });
    }
  } = options;

  return async (req, res, next) => {
    try {
      const key = typeof keyGenerator === 'function' 
        ? keyGenerator(req) 
        : keyGenerator;
      
      const allowed = await rateLimiter.isAllowed(
        key,
        max,
        windowMs / 1000
      );
      
      if (!allowed) {
        return handler(req, res);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  rateLimiter,
  rateLimit
};