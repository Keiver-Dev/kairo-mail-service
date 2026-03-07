import winston from 'winston';
import path from 'path';
import { sanitizeObject } from './sanitizeLog.js';

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

// Formato personalizado para sanitizar automáticamente los metadatos
const sanitizeFormat = winston.format((info) => {
  const { message, level, timestamp, stack, ...meta } = info;
  const sanitizedMeta = sanitizeObject(meta);
  
  // Strip ANSI colors in production
  if (process.env.NODE_ENV === 'production' && typeof info.message === 'string') {
    info.message = info.message.replace(/\x1B\[\d+m/g, '');
  }
  
  return { ...info, ...sanitizedMeta };
});

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(),
    sanitizeFormat()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? winston.format.json()
        : combine(
            colorize(),
            logFormat
          )
    })
  ]
});

if (process.env.NODE_ENV === 'production') {
  const logDir = 'logs';
  logger.add(new winston.transports.File({ 
    filename: path.join(logDir, 'error.log'), 
    level: 'error',
    format: winston.format.json()
  }));
  logger.add(new winston.transports.File({ 
    filename: path.join(logDir, 'combined.log'),
    format: winston.format.json()
  }));
}

export default logger;
