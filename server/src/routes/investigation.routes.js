import { Router } from 'express';
import {
  getInvestigation,
  updateNotes,
  updateEvidenceBoard,
  markEvidenceReviewed,
  requestHint,
  submitAccusation,
  getSolution,
} from '../controllers/investigation.controller.js';
import { validateBody, accusationSchema, hintSchema } from '../validators/schemas.js';
import { sessionContext, authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, sessionContext);

router.get('/:investigationId', getInvestigation);
router.patch('/:investigationId/notes', updateNotes);
router.patch('/:investigationId/evidence-board', updateEvidenceBoard);
router.post('/:investigationId/evidence/:evidenceId/review', markEvidenceReviewed);
router.post('/:investigationId/hints', validateBody(hintSchema), requestHint);
router.post('/:investigationId/accuse', validateBody(accusationSchema), submitAccusation);
router.get('/:investigationId/solution', getSolution);

export default router;
