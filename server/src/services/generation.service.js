import { getGeminiModel, isGeminiConfigured } from '../config/gemini.js';
import { buildCaseGenerationPrompt } from '../ai/prompts/case-generation.prompt.js';
import { validateCanonicalCase } from '../ai/validators/case.validator.js';
import { generateFallbackCase } from '../ai/generators/fallback.generator.js';
import { MysteryCase } from '../models/MysteryCase.js';
import { Evidence } from '../models/Evidence.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a redacted, player-safe representation of the canonical case.
 * ABSOLUTELY NEVER exposes:
 * - culpritId
 * - canonicalSolution
 * - isCulprit on suspects
 * - privateFacts on suspects
 * - hiddenSignificance on evidence
 */
export function buildPlayerSafeCase(canonicalCase) {
  if (!canonicalCase) return null;

  const playerSuspects = (canonicalCase.suspects || []).map((s) => ({
    id: s.id,
    name: s.name,
    age: s.age,
    occupation: s.occupation,
    relationship: s.relationship,
    profileDescription: s.profileDescription,
    publicMotive: s.publicMotive,
    publicAlibi: s.publicAlibi,
    avatar: s.avatar || null,
  }));

  const playerEvidence = (canonicalCase.evidence || []).map((e) => ({
    id: e.id,
    type: e.type,
    title: e.title,
    description: e.description,
    timestamp: e.timestamp,
    content: e.content,
    relatedSuspectIds: e.relatedSuspectIds || [],
    relatedEvidenceIds: e.relatedEvidenceIds || [],
    assetUrl: e.assetUrl || null,
    assetType: e.assetType || null,
    isRequired: e.isRequired || false,
  }));

  return {
    case: {
      ...canonicalCase.case,
    },
    suspects: playerSuspects,
    evidence: playerEvidence,
    timeline: canonicalCase.timeline || [],
  };
}

export async function generateMysteryCase({
  scenario,
  difficulty = 'Medium',
  category = 'Custom',
  investigationStyle = 'Realistic',
  evidenceTypes = ['Messages', 'CCTV', 'Witness Statements'],
  userId = null,
  guestSessionId = null,
}) {
  const caseCode = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let canonicalCase = null;
  let generationAttempts = 0;
  let validationErrors = [];
  let modelUsed = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const canUseGemini = isGeminiConfigured();

  if (canUseGemini) {
    const { systemInstruction, userPrompt } = buildCaseGenerationPrompt({
      scenario,
      difficulty,
      category,
      investigationStyle,
      evidenceTypes,
    });

    for (let attempt = 1; attempt <= 3; attempt++) {
      generationAttempts = attempt;
      try {
        const model = getGeminiModel();
        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        const rawText = result.response.text();
        // Clean any accidental markdown code fencing
        const jsonText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(jsonText);

        const validation = validateCanonicalCase(parsed, difficulty);
        if (validation.valid) {
          canonicalCase = parsed;
          break;
        } else {
          validationErrors = validation.errors;
          console.warn(`[Generation] Attempt ${attempt} failed validation:`, validation.errors);
        }
      } catch (err) {
        console.warn(`[Generation] Attempt ${attempt} encountered error:`, err.message);
        validationErrors.push(err.message);
      }
    }
  }

  // If Gemini wasn't configured, or all 3 attempts failed, fall back to the structured deterministic procedural generator
  if (!canonicalCase) {
    console.info(`[Generation] Using procedural fallback generator for case ${caseCode}`);
    canonicalCase = generateFallbackCase({
      scenario,
      difficulty,
      category,
      investigationStyle,
      evidenceTypes,
    });
    modelUsed = canUseGemini ? `${modelUsed}-fallback` : 'procedural-fallback';
  }

  // Build the safe player representation
  const playerSafeCase = buildPlayerSafeCase(canonicalCase);

  // Store the MysteryCase in the database
  const mysteryCase = await MysteryCase.create({
    caseCode,
    createdBy: userId,
    guestSessionId,
    title: canonicalCase.case.title,
    scenario,
    category,
    difficulty,
    investigationStyle,
    evidenceTypes,
    status: 'ready',
    generationStatus: 'completed',
    canonicalCase,
    playerSafeCase,
    generationMetadata: {
      model: modelUsed,
      promptVersion: '1.0',
      generationAttempts,
      generatedAt: new Date(),
      validationStatus: 'passed',
      reviewStatus: 'passed',
    },
  });

  // Store each individual evidence item in the Evidence collection
  if (Array.isArray(canonicalCase.evidence)) {
    const evidenceDocs = canonicalCase.evidence.map((ev, index) => ({
      caseId: mysteryCase._id,
      evidenceCode: ev.id || `EVD-${String(index + 1).padStart(2, '0')}`,
      type: ev.type || 'document',
      title: ev.title || `Evidence Item #${index + 1}`,
      description: ev.description || '',
      content: ev.content || {},
      assetUrl: ev.assetUrl || null,
      assetType: ev.assetType || null,
      timestamp: ev.timestamp || null,
      relatedSuspectIds: ev.relatedSuspectIds || [],
      relatedEvidenceIds: ev.relatedEvidenceIds || [],
      isRequired: ev.isRequired || false,
      hiddenSignificance: ev.hiddenSignificance || null,
    }));

    await Evidence.insertMany(evidenceDocs);
  }

  return mysteryCase;
}
