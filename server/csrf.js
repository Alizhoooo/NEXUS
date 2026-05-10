import crypto from 'node:crypto';

const CSRF_HEADER_NAME = 'x-csrf-token';

const csrfTokens = new Map();
const TOKEN_TTL = 3600000;

setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(userId);
    }
  }
}, 60000);

export function generateCsrfToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(userId, {
    token,
    expiresAt: Date.now() + TOKEN_TTL
  });
  return token;
}

export function validateCsrfToken(userId, token) {
  if (!token) return false;

  const data = csrfTokens.get(userId);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    csrfTokens.delete(userId);
    return false;
  }

  const isValid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(data.token));
  if (isValid) {
    data.expiresAt = Date.now() + TOKEN_TTL;
  }
  return isValid;
}

export function csrfMiddleware(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers[CSRF_HEADER_NAME] || req.body?._csrf;
  const userId = req.user?.sub;

  if (!userId) {
    return next();
  }

  if (!validateCsrfToken(userId, token)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
}

export function csrfTokenHandler(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = generateCsrfToken(userId);
  res.json({ token });
}

export function csrfConfig(app) {
  app.get('/api/csrf-token', csrfTokenHandler);

  if (process.env.NODE_ENV === 'production') {
    app.use(csrfMiddleware);
  }

  console.log('[Security] CSRF protection enabled');
}

export default { generateCsrfToken, validateCsrfToken, csrfMiddleware, csrfTokenHandler, csrfConfig };