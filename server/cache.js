import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis = null;
let isConnected = false;

try {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
    connectTimeout: 5000
  });

  redis.on('connect', () => {
    isConnected = true;
    console.log('[Cache] Redis connected');
  });

  redis.on('error', (err) => {
    isConnected = false;
    console.warn('[Cache] Redis unavailable, using fallback:', err.message);
  });

  redis.connect().catch(() => {
    isConnected = false;
  });
} catch {
  console.warn('[Cache] Redis not configured, caching disabled');
}

const DEFAULT_TTL = 300;

const cache = {
  async get(key) {
    if (!isConnected || !redis) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async set(key, value, ttl = DEFAULT_TTL) {
    if (!isConnected || !redis) return false;
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  async del(key) {
    if (!isConnected || !redis) return false;
    try {
      await redis.del(key);
      return true;
    } catch {
      return false;
    }
  },

  async invalidatePattern(pattern) {
    if (!isConnected || !redis) return false;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch {
      return false;
    }
  },

  async healthCheck() {
    return isConnected && redis ? 'connected' : 'unavailable';
  }
};

const CACHE_KEYS = {
  employees: (page, limit) => `employees:${page}:${limit}`,
  employeesSearch: (page, limit, search) => `employees:${page}:${limit}:${search}`,
  tasks: 'tasks:all',
  bootstrap: (userId) => `bootstrap:${userId}`,
  payroll: 'payroll:all'
};

export { cache, CACHE_KEYS };
export default cache;