import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongod;
let caseId;
let investigationId;
let suspectIds = [];

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Create a case first
  const caseRes = await request(app)
    .post('/api/v1/cases')
    .send({
      scenario: 'An eccentric billionaire was poisoned in his high-tech penthouse during an exclusive dinner with 4 close associates.',
      difficulty: 'Medium',
      category: 'Murder Mystery',
      investigationStyle: 'Realistic',
      evidenceTypes: ['Messages', 'CCTV', 'Forensic Reports'],
    });

  caseId = caseRes.body.caseId;

  const detailRes = await request(app).get(`/api/v1/cases/${caseId}`);
  suspectIds = detailRes.body.data.suspects.map((s) => s.id);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Investigation Lifecycle & Accusation Gate', () => {
  it('starts an investigation for the case', async () => {
    const res = await request(app).post(`/api/v1/cases/${caseId}/investigations`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in_progress');
    investigationId = res.body.data._id;
  });

  it('updates investigation notes and evidence board', async () => {
    const notesRes = await request(app)
      .patch(`/api/v1/investigations/${investigationId}/notes`)
      .send({
        notes: [{ id: 'note-1', content: 'Suspect 2 has inconsistent boot prints.', title: 'Boot Tread' }],
      });
    expect(notesRes.status).toBe(200);
    expect(notesRes.body.data).toHaveLength(1);

    const boardRes = await request(app)
      .patch(`/api/v1/investigations/${investigationId}/evidence-board`)
      .send({
        cards: [{ id: 'c1', type: 'suspect', refId: suspectIds[0], x: 100, y: 150 }],
        connections: [],
      });
    expect(boardRes.status).toBe(200);
    expect(boardRes.body.data.cards).toHaveLength(1);
  });

  it('CRITICAL SECURITY: Solution must be LOCKED (403) before accusation is made', async () => {
    const solutionRes = await request(app).get(`/api/v1/investigations/${investigationId}/solution`);
    expect(solutionRes.status).toBe(403);
    expect(solutionRes.body.code).toBe('SOLUTION_LOCKED');
  });

  it('submits accusation and unlocks solution', async () => {
    const accusedId = suspectIds[1]; // Accuse suspect_02 (Julian Sterling)
    const accuseRes = await request(app)
      .post(`/api/v1/investigations/${investigationId}/accuse`)
      .send({
        suspectId: accusedId,
        reasoning: 'Master keycard was scanned at 20:47 and boot tread matched standard security issue.',
        supportingEvidenceIds: ['evd_02', 'evd_04'],
      });

    expect(accuseRes.status).toBe(200);
    expect(accuseRes.body.solutionAvailable).toBe(true);
    expect(accuseRes.body.isCorrect).toBe(true);
    expect(accuseRes.body.score).toBeGreaterThan(0);

    // CRITICAL TERMINAL RULE: Duplicate accusations must be rejected (409)
    const dupRes = await request(app)
      .post(`/api/v1/investigations/${investigationId}/accuse`)
      .send({
        suspectId: suspectIds[0],
      });
    expect(dupRes.status).toBe(409);
    expect(dupRes.body.code).toBe('ACCUSATION_ALREADY_SUBMITTED');

    // Now solution endpoint must be accessible
    const solutionRes = await request(app).get(`/api/v1/investigations/${investigationId}/solution`);
    expect(solutionRes.status).toBe(200);
    expect(solutionRes.body.solution.culprit.id).toBeDefined();
    expect(solutionRes.body.solution.motive).toBeDefined();
    expect(solutionRes.body.solution.method).toBeDefined();
    expect(solutionRes.body.solution.explanation).toBeDefined();
    expect(solutionRes.body.solution.isPlayerCorrect).toBe(true);
  });
});
