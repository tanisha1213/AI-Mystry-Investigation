import { Router } from 'express';
import { createCase, getCaseStatus, getCase, listCases } from '../controllers/case.controller.js';
import { startInvestigation } from '../controllers/investigation.controller.js';
import { getEvidenceById } from '../controllers/evidence.controller.js';
import { validateBody, createMysterySchema } from '../validators/schemas.js';
import { sessionContext, authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, sessionContext);

router.post('/', validateBody(createMysterySchema), createCase);
router.get('/', listCases);
router.get('/:caseId/status', getCaseStatus);
router.get('/:caseId', getCase);

// Investigation start under case
router.post('/:caseId/investigations', startInvestigation);

// Evidence detail under case
router.get('/:caseId/evidence/:evidenceId', getEvidenceById);

export default router;
