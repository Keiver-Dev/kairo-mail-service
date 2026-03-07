import pg from 'pg';
import pc from 'picocolors';
import logger from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool({
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT) || 5432,
  database: String(process.env.DB_NAME || ''),
  user: String(process.env.DB_USER || ''),
  password: String(process.env.DB_PASSWORD || ''),
});

export const query = (text, params) => pool.query(text, params);

/**
 * Test the database connection
 * @returns {Promise<boolean>}
 */
export const testConnection = async () => {
  // If no password is provided and the server requires one (SCRAM), pg driver will throw.
  // We wrap the initial query to handle this gracefully.
  try {
    const res = await pool.query('SELECT NOW()');
    logger.info(pc.green(`Database connected: ${pc.bold(res.rows[0].now)}`));
    return true;
  } catch (err) {
    if (err.message.includes('SASL') || err.message.includes('password')) {
      logger.warn(pc.yellow('Database Authentication: Password is required for SCRAM but none provided.'));
    } else {
      logger.error(pc.red(`Database connection error: ${err.message}`));
    }
    return false;
  }
};

export default pool;
