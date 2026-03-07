import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';
import pool from './database.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures the migrations table exists to track applied scripts
 */
const ensureMigrationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * Runs all pending migrations from the migrations directory
 */
export const runMigrations = async () => {
  logger.info(pc.cyan('[MIGRATION] Checking for database migrations...'));
  
  try {
    await ensureMigrationsTable();
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure order by filename

    const { rows: appliedMigrations } = await pool.query('SELECT name FROM migrations');
    const appliedSet = new Set(appliedMigrations.map(m => m.name));

    for (const file of sqlFiles) {
      if (!appliedSet.has(file)) {
        logger.info(pc.yellow(`[APPLYING] Migration: ${pc.bold(file)}`));
        
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf8');

        // Execute in transaction
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(sql);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          logger.info(pc.green(`[SUCCESS] Migration ${pc.bold(file)} applied successfully.`));
        } catch (err) {
          await client.query('ROLLBACK');
          logger.error(pc.red(`[ERROR] Error applying migration ${file}:`), err);
          throw err;
        } finally {
          client.release();
        }
      }
    }

    logger.info(pc.green('[MIGRATION] Database is up to date.'));
  } catch (error) {
    logger.error(pc.red('[ERROR] Migration runner failed:'), error);
    // Don't throw here if we want the server to start even with DB issues (as per our "Optional DB" policy)
    // However, for migrations, failure might be critical if the app depends on new schema.
    // For now, we'll log it and let the startup continue.
  }
};
