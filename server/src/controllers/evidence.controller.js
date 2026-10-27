import { Evidence } from '../models/Evidence.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getEvidenceById(req, res, next) {
  try {
    const { caseId, evidenceId } = req.params;

    // Search by either MongoDB _id or evidenceCode (e.g. evd_01 or EVD-01)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(evidenceId);
    const query = { caseId };
    if (isObjectId) {
      query.$or = [{ _id: evidenceId }, { evidenceCode: evidenceId }];
    } else {
      query.evidenceCode = evidenceId;
    }

    const evidence = await Evidence.findOne(query);
    if (!evidence) {
      throw new AppError('Evidence item not found.', 404, 'EVIDENCE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (err) {
    next(err);
  }
}
