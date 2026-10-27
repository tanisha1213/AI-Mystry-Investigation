import { Router } from 'express';
import authRoutes from './auth.routes.js';
import caseRoutes from './case.routes.js';
import investigationRoutes from './investigation.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    product: 'AI Mystery Room',
    disclaimer: 'All cases, suspects, messages, images, and evidence in AI Mystery Room are fictional and generated for entertainment purposes.',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/cases', caseRoutes);
apiRouter.use('/investigations', investigationRoutes);

export default apiRouter;
