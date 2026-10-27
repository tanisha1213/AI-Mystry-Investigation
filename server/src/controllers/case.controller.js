import { MysteryCase } from '../models/MysteryCase.js';
import { generateMysteryCase } from '../services/generation.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createCase(req, res, next) {
  try {
    const { scenario, difficulty, category, investigationStyle, evidenceTypes } = req.body;
    const userId = req.user ? req.user._id : null;
    const guestSessionId = !req.user ? req.guestSessionId : null;

    const mysteryCase = await generateMysteryCase({
      scenario,
      difficulty,
      category,
      investigationStyle,
      evidenceTypes,
      userId,
      guestSessionId,
    });

    res.status(201).json({
      success: true,
      caseId: mysteryCase._id,
      caseCode: mysteryCase.caseCode,
      title: mysteryCase.title,
      status: mysteryCase.status,
      generationStatus: mysteryCase.generationStatus,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCaseStatus(req, res, next) {
  try {
    const { caseId } = req.params;
    const mysteryCase = await MysteryCase.findById(caseId).select('status generationStatus generationError caseCode title');
    if (!mysteryCase) {
      throw new AppError('Mystery case not found.', 404, 'CASE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      caseId: mysteryCase._id,
      caseCode: mysteryCase.caseCode,
      status: mysteryCase.status,
      generationStatus: mysteryCase.generationStatus,
      error: mysteryCase.generationError,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCase(req, res, next) {
  try {
    const { caseId } = req.params;
    // Note: canonicalCase is select: false by default in schema, preventing leakage!
    const mysteryCase = await MysteryCase.findById(caseId);
    if (!mysteryCase) {
      throw new AppError('Mystery case not found.', 404, 'CASE_NOT_FOUND');
    }

    // Safety verification: confirm no canonical fields exist in player response
    const safeData = {
      id: mysteryCase._id,
      caseCode: mysteryCase.caseCode,
      title: mysteryCase.title,
      scenario: mysteryCase.scenario,
      category: mysteryCase.category,
      difficulty: mysteryCase.difficulty,
      investigationStyle: mysteryCase.investigationStyle,
      status: mysteryCase.status,
      createdAt: mysteryCase.createdAt,
      // Player safe details
      caseDetails: mysteryCase.playerSafeCase.case,
      suspects: mysteryCase.playerSafeCase.suspects,
      evidence: mysteryCase.playerSafeCase.evidence,
      timeline: mysteryCase.playerSafeCase.timeline,
    };

    res.status(200).json({
      success: true,
      data: safeData,
    });
  } catch (err) {
    next(err);
  }
}

export async function listCases(req, res, next) {
  try {
    const query = {};
    if (req.user) {
      query.createdBy = req.user._id;
    } else if (req.guestSessionId) {
      query.guestSessionId = req.guestSessionId;
    }

    const cases = await MysteryCase.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .select('caseCode title category difficulty status createdAt');

    res.status(200).json({
      success: true,
      data: cases,
    });
  } catch (err) {
    next(err);
  }
}
