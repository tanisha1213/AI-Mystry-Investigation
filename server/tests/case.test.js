import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { validateCanonicalCase } from '../src/ai/validators/case.validator.js';
import { generateFallbackCase } from '../src/ai/generators/fallback.generator.js';
import { buildPlayerSafeCase } from '../src/services/generation.service.js';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('AI Mystery Case Generation & Player-Safe Security', () => {
  it('should validate canonical case schema correctly', () => {
    const rawCase = generateFallbackCase({
      scenario: 'An ancient Egyptian ruby necklace vanished from the vault during a stormy night with 4 curators present.',
      difficulty: 'Medium',
    });

    const validation = validateCanonicalCase(rawCase, 'Medium');
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(rawCase.canonicalSolution.culpritId).toBeDefined();
  });

  it('CRITICAL SECURITY: playerSafeCase must NEVER contain culpritId, canonicalSolution, or isCulprit', () => {
    const canonical = generateFallbackCase({
      scenario: 'A prototype cryptographic key was stolen from a cyber research laboratory.',
      difficulty: 'Medium',
    });

    const playerSafe = buildPlayerSafeCase(canonical);

    // Deep JSON string inspection to ensure zero leakage
    const serialized = JSON.stringify(playerSafe);
    expect(serialized).not.toContain('canonicalSolution');
    expect(serialized).not.toContain('culpritId');
    expect(serialized).not.toContain('"isCulprit":true');
    expect(serialized).not.toContain('"isCulprit":false');
    expect(serialized).not.toContain('privateFacts');
    expect(serialized).not.toContain('hiddenSignificance');

    // Object property checks
    expect(playerSafe).not.toHaveProperty('canonicalSolution');
    for (const suspect of playerSafe.suspects) {
      expect(suspect).not.toHaveProperty('isCulprit');
      expect(suspect).not.toHaveProperty('privateFacts');
    }
  });

  it('POST /api/v1/cases should create a mystery case and return status ready', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .send({
        scenario: 'A precious diamond ring vanished from a private salon with four suspects present at midnight.',
        difficulty: 'Medium',
        category: 'Theft',
        investigationStyle: 'Realistic',
        evidenceTypes: ['Messages', 'CCTV', 'Witness Statements'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.caseId).toBeDefined();
    expect(res.body.caseCode).toMatch(/^CASE-/);

    // Now retrieve the player-facing case details
    const caseRes = await request(app).get(`/api/v1/cases/${res.body.caseId}`);
    expect(caseRes.status).toBe(200);
    expect(caseRes.body.data.suspects.length).toBeGreaterThanOrEqual(3);
    expect(caseRes.body.data.evidence.length).toBeGreaterThanOrEqual(4);

    // CRITICAL SECURITY ASSERTION ON API RESPONSE
    expect(caseRes.body.data).not.toHaveProperty('canonicalSolution');
    expect(caseRes.body.data).not.toHaveProperty('culpritId');
    const responseStr = JSON.stringify(caseRes.body);
    expect(responseStr).not.toContain('isCulprit');
    expect(responseStr).not.toContain('canonicalSolution');
  });

  it('rejects scenario shorter than 30 characters', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .send({
        scenario: 'Too short',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
