const REQUEST_RATE_LIMIT = new Map();
const IP_BLOCKLIST = new Map();

const RATE_LIMIT_WINDOW = 60_000;
const REQUEST_LIMIT_DEFAULT = 100;
const REQUEST_LIMIT_AUTH = 10;
const REQUEST_LIMIT_AI = 12;

const BLOCK_DURATION = 300_000;

function cleanupRateLimit() {
  const now = Date.now();

  for (const [ip, data] of IP_BLOCKLIST.entries()) {
    if (now > data.unblockAt) {
      IP_BLOCKLIST.delete(ip);
    }
  }

  for (const [key, timestamps] of REQUEST_RATE_LIMIT.entries()) {
    const valid = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    if (valid.length === 0) {
      REQUEST_RATE_LIMIT.delete(key);
    } else {
      REQUEST_RATE_LIMIT.set(key, valid);
    }
  }
}

setInterval(cleanupRateLimit, RATE_LIMIT_WINDOW);

export function checkRateLimit(ip, limit = REQUEST_LIMIT_DEFAULT) {
  if (IP_BLOCKLIST.has(ip)) {
    const blockData = IP_BLOCKLIST.get(ip);
    if (Date.now() < blockData.unblockAt) {
      return { allowed: false, reason: 'blocked', remainingTime: blockData.unblockAt - Date.now() };
    }
    IP_BLOCKLIST.delete(ip);
  }

  const key = ip;
  const now = Date.now();
  const bucket = REQUEST_RATE_LIMIT.get(key)?.filter(ts => now - ts < RATE_LIMIT_WINDOW) || [];

  if (bucket.length >= limit) {
    bucket.push(now);
    REQUEST_RATE_LIMIT.set(key, bucket);

    if (bucket.length >= limit * 3) {
      IP_BLOCKLIST.set(ip, { unblockAt: Date.now() + BLOCK_DURATION, reason: 'ddos' });
      return { allowed: false, reason: 'blocked', remainingTime: BLOCK_DURATION };
    }

    return { allowed: false, reason: 'rate_limit', remainingTime: RATE_LIMIT_WINDOW };
  }

  bucket.push(now);
  REQUEST_RATE_LIMIT.set(key, bucket);
  return { allowed: true, remaining: limit - bucket.length };
}

export function globalRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const limit = req.path.startsWith('/api/auth') ? REQUEST_LIMIT_AUTH :
                req.path.startsWith('/api/assistant') ? REQUEST_LIMIT_AI :
                REQUEST_LIMIT_DEFAULT;

  const result = checkRateLimit(ip, limit);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', result.remaining || 0);

  if (!result.allowed) {
    if (result.reason === 'blocked') {
      return res.status(403).json({
        message: 'Temporarily blocked due to suspicious activity',
        retryAfter: Math.ceil(result.remainingTime / 1000)
      });
    }
    return res.status(429).json({
      message: 'Too many requests',
      retryAfter: Math.ceil(result.remainingTime / 1000)
    });
  }

  next();
}

export function sanitizeInput(text) {
  if (typeof text !== 'string') return text;

  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
}

export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeInput(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('key')) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  return obj;
}

export function inputSanitizer(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
}

export default {
  checkRateLimit,
  globalRateLimiter,
  sanitizeInput,
  sanitizeObject,
  inputSanitizer
};