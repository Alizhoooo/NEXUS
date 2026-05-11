const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

export const allowedCorsOrigins = (process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN)
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export function corsOrigin(origin, callback) {
  if (!origin || allowedCorsOrigins.includes('*') || allowedCorsOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error('Not allowed by CORS'));
}
