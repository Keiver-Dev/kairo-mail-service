import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

let transporter = null;
let isInitializing = false;

/**
 * Gets or creates the nodemailer transporter
 * @returns {Promise<Object>}
 */
export const getTransporter = async () => {
  if (transporter) return transporter;

  if (isInitializing) {
    // Wait until the other initialization is complete
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (transporter) return transporter;
  }

  isInitializing = true;
  try {
    if (process.env.EMAIL_TEST_MODE === 'true') {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info('Ethereal transporter created');
    } else {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      logger.info('Gmail transporter created');
    }
  } finally {
    isInitializing = false;
  }

  return transporter;
};
