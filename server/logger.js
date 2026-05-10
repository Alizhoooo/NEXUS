import crypto from 'node:crypto';
import os from 'node:os';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const currentLevel = process.env.LOG_LEVEL ? LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info : LOG_LEVELS.info;

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const pid = process.pid;
  const hostname = os.hostname();
  const version = process.env.npm_package_version || '1.0.0';

  return JSON.stringify({
    level: level.toUpperCase(),
    message,
    timestamp,
    pid,
    hostname,
    version,
    ...meta
  });
};

export const logger = {
  error: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(formatMessage('error', message, meta));
    }
  },

  warn: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },

  info: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, meta));
    }
  },

  http: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.http) {
      console.log(formatMessage('http', message, meta));
    }
  },

  debug: (message, meta = {}) => {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(formatMessage('debug', message, meta));
    }
  }
};

export const requestLogger = (req, res, next) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  req.requestId = requestId;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });

  next();
};

export const errorLogger = (error, req, res, next) => {
  logger.error('Unhandled Error', {
    requestId: req.requestId,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    method: req.method,
    url: req.url
  });
  next(error);
};

export default logger;