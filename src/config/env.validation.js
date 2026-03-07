import pc from 'picocolors';
import logger from '../utils/logger.js';

/**
 * Validate required environment variables at startup
 */
export const validateEnv = () => {
  const requiredEnv = [
    'INTERNAL_API_KEY',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];

  if (!process.env.INTERNAL_API_KEY || process.env.INTERNAL_API_KEY.length < 32) {
    logger.error(pc.red(pc.bold('CRITICAL: INTERNAL_API_KEY must be at least 32 characters long.')));
    process.exit(1);
  }

  if (process.env.EMAIL_TEST_MODE === 'false') {
    const missing = requiredEnv.filter(env => !process.env[env]);
    if (missing.length > 0) {
      logger.warn(pc.yellow(`[WARNING] EMAIL_TEST_MODE is false but missing credentials: ${pc.bold(missing.join(', '))}`));
    }
  } else {
    logger.info(pc.magenta('[EMAIL] Email service running in TEST MODE (Ethereal)'));
  }
};
