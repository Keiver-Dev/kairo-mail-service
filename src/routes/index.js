import { Router } from 'express';
import emailRoutes from './email.routes.js';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

router.get('/health', checkHealth);
router.use('/api/email', emailRoutes);

export default router;
