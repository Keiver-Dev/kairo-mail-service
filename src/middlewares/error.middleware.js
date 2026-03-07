import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error with Winston
  if (err.statusCode === 500) {
    logger.error('UNEXPECTED ERROR [CRITICAL]:', err);
  } else {
    logger.warn(`App Error (${err.statusCode}): ${err.message}`);
  }

  // Response to client
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // Only send stack in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
