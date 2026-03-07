import { testConnection } from '../config/database.js';
import { getTransporter } from '../config/email.config.js';

export const checkHealth = async (req, res) => {
  const dbStatus = await testConnection();
  let smtpStatus = false;

  try {
    const transporter = await getTransporter();
    await transporter.verify();
    smtpStatus = true;
  } catch (error) {
    smtpStatus = false;
  }

  const status = dbStatus && smtpStatus ? 'ok' : 'degraded';

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: dbStatus ? 'connected' : 'disconnected',
      smtp: smtpStatus ? 'ready' : 'error'
    }
  });
};
