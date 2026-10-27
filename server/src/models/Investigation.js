import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MysteryCase',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestSessionId: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'accusation_submitted', 'completed'],
      default: 'in_progress',
      index: true,
    },
    reviewedEvidenceIds: {
      type: [String],
      default: [],
    },
    notes: [
      {
        id: { type: String, required: true },
        evidenceId: { type: String, default: null },
        title: { type: String, default: '' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    evidenceBoard: {
      cards: [
        {
          id: { type: String, required: true },
          type: { type: String, enum: ['suspect', 'evidence', 'custom_note'], required: true },
          refId: { type: String, default: null },
          title: { type: String, default: '' },
          content: { type: String, default: '' },
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
          color: { type: String, default: '#D9A441' },
          notes: { type: String, default: '' },
        },
      ],
      connections: [
        {
          id: { type: String, required: true },
          fromId: { type: String, required: true },
          toId: { type: String, required: true },
          label: { type: String, default: '' },
          color: { type: String, default: '#D9A441' },
        },
      ],
    },
    hintsUsed: [
      {
        hintLevel: { type: Number, required: true },
        hintText: { type: String, required: true },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    accusation: {
      suspectId: { type: String, default: null },
      reasoning: { type: String, default: null },
      supportingEvidenceIds: { type: [String], default: [] },
      submittedAt: { type: Date, default: null },
    },
    result: {
      isCorrect: { type: Boolean, default: null },
      score: { type: Number, default: null },
      completedAt: { type: Date, default: null },
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

investigationSchema.index({ caseId: 1, userId: 1 });
investigationSchema.index({ caseId: 1, guestSessionId: 1 });

export const Investigation = mongoose.model('Investigation', investigationSchema);
