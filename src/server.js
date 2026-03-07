import pc from 'picocolors';
import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';
import { validateEnv } from './config/env.validation.js';
import { testConnection } from './config/database.js';
import { runMigrations } from './config/migrate.js';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // 0. Ensure production mode by default for security
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'production';
    }

    // 1. Validate environment variables
    validateEnv();

    // 2. Test database connection
    const connected = await testConnection();

    // 3. Run Migrations if connected
    if (connected) {
      await runMigrations();
    } else {
      logger.warn(pc.yellow('Running without database connection. Some features may be limited.'));
    }

    // 4. Start server
    const server = app.listen(PORT, () => {
      logger.info(pc.green(`Kairo Email Service running in ${pc.bold(process.env.NODE_ENV)} mode`));
      logger.info(pc.cyan(`Server accessible at ${pc.underline(`http://localhost:${PORT}`)}`));
    });

    // Graceful shutdown handling
    const shutdown = () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('Server closed. Goodbye!');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
