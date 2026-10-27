export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected server error occurred.';

  // Handle Mongoose / MongoDB errors
  if (err.name === 'CastError') {
    statusCode = 404;
    code = 'RESOURCE_NOT_FOUND';
    message = `Resource not found with specified ID.`;
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY_ERROR';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join('. ');
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Unhandled Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}
