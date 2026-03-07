import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { corsOptions } from './config/cors.config.js';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Routes
app.use(routes);

// Error handling (must be at the end)
app.use(errorMiddleware);

export default app;
