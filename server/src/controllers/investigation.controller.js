import { Investigation } from '../models/Investigation.js';
import { MysteryCase } from '../models/MysteryCase.js';
import { Evidence } from '../models/Evidence.js';
import { AppError } from '../middleware/errorHandler.js';

export async function startInvestigation(req, res, next) {
  try {
    const { caseId } = req.params;
    const mysteryCase = await MysteryCase.findById(caseId);
    if (!mysteryCase) {
      throw new AppError('Mystery case not found.', 404, 'CASE_NOT_FOUND');
    }

    const userId = req.user ? req.user._id : null;
    const guestSessionId = !req.user ? req.guestSessionId : null;

    // Find existing investigation or create a new one
    const query = { caseId };
    if (userId) {
      query.userId = userId;
    } else {
      query.guestSessionId = guestSessionId;
    }

    let investigation = await Investigation.findOne(query);

    if (!investigation) {
      investigation = await Investigation.create({
        caseId,
        userId,
        guestSessionId,
        status: 'in_progress',
        reviewedEvidenceIds: [],
        notes: [],
        evidenceBoard: { cards: [], connections: [] },
        hintsUsed: [],
        startedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      data: investigation,
    });
  } catch (err) {
    next(err);
  }
}

export async function getInvestigation(req, res, next) {
  try {
    const { investigationId } = req.params;
    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    // Access check
    if (req.user && investigation.userId && investigation.userId.toString() !== req.user._id.toString()) {
      throw new AppError('You do not have permission to view this investigation.', 403, 'FORBIDDEN');
    }
    if (!req.user && investigation.guestSessionId && investigation.guestSessionId !== req.guestSessionId) {
      throw new AppError('You do not have permission to view this investigation.', 403, 'FORBIDDEN');
    }

    res.status(200).json({
      success: true,
      data: investigation,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateNotes(req, res, next) {
  try {
    const { investigationId } = req.params;
    const { notes } = req.body;

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    investigation.notes = notes;
    await investigation.save();

    res.status(200).json({
      success: true,
      message: 'Investigation notes updated.',
      data: investigation.notes,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEvidenceBoard(req, res, next) {
  try {
    const { investigationId } = req.params;
    const { cards, connections } = req.body;

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    investigation.evidenceBoard = {
      cards: cards || investigation.evidenceBoard.cards,
      connections: connections || investigation.evidenceBoard.connections,
    };

    await investigation.save();

    res.status(200).json({
      success: true,
      message: 'Evidence board updated.',
      data: investigation.evidenceBoard,
    });
  } catch (err) {
    next(err);
  }
}

export async function markEvidenceReviewed(req, res, next) {
  try {
    const { investigationId, evidenceId } = req.params;

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    if (!investigation.reviewedEvidenceIds.includes(evidenceId)) {
      investigation.reviewedEvidenceIds.push(evidenceId);
      await investigation.save();
    }

    res.status(200).json({
      success: true,
      data: investigation.reviewedEvidenceIds,
    });
  } catch (err) {
    next(err);
  }
}

export async function requestHint(req, res, next) {
  try {
    const { investigationId } = req.params;
    const hintLevel = Number(req.body.hintLevel || 1);

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    // Retrieve canonical case to extract hints without revealing culprit directly
    const mysteryCase = await MysteryCase.findById(investigation.caseId).select('+canonicalCase');
    if (!mysteryCase || !mysteryCase.canonicalCase) {
      throw new AppError('Mystery case details missing.', 404, 'CASE_NOT_FOUND');
    }

    const { keyClues, innocentSuspectExplanations } = mysteryCase.canonicalCase.canonicalSolution;

    let hintText = '';
    if (hintLevel === 1) {
      hintText = 'Examine the timeline carefully: notice the precise gap between the scheduled movements and electronic logs.';
    } else if (hintLevel === 2) {
      if (innocentSuspectExplanations && innocentSuspectExplanations.length > 0) {
        const randomInnocent = innocentSuspectExplanations[0];
        hintText = `Elimination hint: Cross-reference the verified alibi sensors. One suspect's whereabouts are firmly corroborated: ${randomInnocent.whyEliminated}`;
      } else {
        hintText = 'Focus on physical and digital forensics: access keycards and footwear leave distinct footprints that cannot be fabricated.';
      }
    } else {
      if (keyClues && keyClues.length > 0) {
        hintText = `Critical Deductive Lead: Pay attention to ${keyClues[0]}`;
      } else {
        hintText = 'Look for the suspect whose administrative or physical privileges allowed them to manipulate surveillance or bypass physical locks.';
      }
    }

    investigation.hintsUsed.push({
      hintLevel,
      hintText,
      requestedAt: new Date(),
    });

    await investigation.save();

    res.status(200).json({
      success: true,
      hintText,
      hintLevel,
      totalHintsUsed: investigation.hintsUsed.length,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitAccusation(req, res, next) {
  try {
    const { investigationId } = req.params;
    const { suspectId, reasoning, supportingEvidenceIds } = req.body;

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    // Terminal rule enforcement: only one accusation permitted
    if (investigation.status === 'completed' || investigation.accusation.submittedAt) {
      throw new AppError(
        'An accusation has already been submitted for this investigation. The case is completed.',
        409,
        'ACCUSATION_ALREADY_SUBMITTED'
      );
    }

    const mysteryCase = await MysteryCase.findById(investigation.caseId).select('+canonicalCase');
    if (!mysteryCase || !mysteryCase.canonicalCase) {
      throw new AppError('Case data missing for resolution.', 404, 'CASE_NOT_FOUND');
    }

    // Validate that the accused suspect actually exists in this case
    const suspectExists = mysteryCase.canonicalCase.suspects.some((s) => s.id === suspectId);
    if (!suspectExists) {
      throw new AppError('Selected suspect does not exist in this investigation.', 400, 'INVALID_SUSPECT');
    }

    const canonicalSolution = mysteryCase.canonicalCase.canonicalSolution;
    const isCorrect = canonicalSolution.culpritId === suspectId;

    // Calculate investigator score
    // Base 1000 pts if correct, -100 per hint used, +50 for each reviewed evidence item
    let score = 0;
    if (isCorrect) {
      const hintPenalty = (investigation.hintsUsed?.length || 0) * 100;
      const reviewBonus = Math.min((investigation.reviewedEvidenceIds?.length || 0) * 50, 300);
      score = Math.max(1000 - hintPenalty + reviewBonus, 200);
    } else {
      score = Math.min((investigation.reviewedEvidenceIds?.length || 0) * 30, 250);
    }

    const completedAt = new Date();

    investigation.status = 'completed';
    investigation.accusation = {
      suspectId,
      reasoning: reasoning || '',
      supportingEvidenceIds: supportingEvidenceIds || [],
      submittedAt: completedAt,
    };
    investigation.result = {
      isCorrect,
      score,
      completedAt,
    };
    investigation.completedAt = completedAt;

    await investigation.save();

    res.status(200).json({
      success: true,
      message: isCorrect
        ? 'Accusation confirmed! You identified the true culprit.'
        : 'Case closed. Your accusation did not match the canonical evidence.',
      isCorrect,
      score,
      solutionAvailable: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSolution(req, res, next) {
  try {
    const { investigationId } = req.params;

    const investigation = await Investigation.findById(investigationId);
    if (!investigation) {
      throw new AppError('Investigation not found.', 404, 'INVESTIGATION_NOT_FOUND');
    }

    // MANDATORY SECURITY GATE:
    // Culprit and canonical solution must NEVER be exposed before an accusation has been submitted!
    if (investigation.status !== 'completed' || !investigation.accusation.submittedAt) {
      throw new AppError(
        'Access denied: The canonical solution is sealed until an accusation is formally submitted.',
        403,
        'SOLUTION_LOCKED'
      );
    }

    const mysteryCase = await MysteryCase.findById(investigation.caseId).select('+canonicalCase');
    if (!mysteryCase || !mysteryCase.canonicalCase) {
      throw new AppError('Canonical case details not found.', 404, 'CASE_NOT_FOUND');
    }

    const { canonicalSolution, suspects } = mysteryCase.canonicalCase;
    const trueCulprit = suspects.find((s) => s.id === canonicalSolution.culpritId);

    res.status(200).json({
      success: true,
      solution: {
        isPlayerCorrect: investigation.result.isCorrect,
        playerAccusation: investigation.accusation,
        score: investigation.result.score,
        culprit: {
          id: trueCulprit ? trueCulprit.id : canonicalSolution.culpritId,
          name: trueCulprit ? trueCulprit.name : canonicalSolution.culpritName,
          occupation: trueCulprit ? trueCulprit.occupation : '',
          profileDescription: trueCulprit ? trueCulprit.profileDescription : '',
        },
        motive: canonicalSolution.motive,
        method: canonicalSolution.method,
        explanation: canonicalSolution.explanation,
        authoritativeTimeline: canonicalSolution.timeline,
        keyClues: canonicalSolution.keyClues,
        innocentSuspectExplanations: canonicalSolution.innocentSuspectExplanations,
      },
    });
  } catch (err) {
    next(err);
  }
}
