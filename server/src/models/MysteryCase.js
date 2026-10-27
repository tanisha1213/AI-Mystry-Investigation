import mongoose from 'mongoose';

const mysteryCaseSchema = new mongoose.Schema(
  {
    caseCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdBy: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    scenario: {
      type: String,
      required: true,
      minlength: 30,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Murder Mystery',
        'Theft',
        'Disappearance',
        'Corporate Espionage',
        'Cybercrime',
        'Suspicious Incident',
        'Custom',
      ],
      default: 'Custom',
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    investigationStyle: {
      type: String,
      required: true,
      enum: ['Realistic', 'Cinematic', 'Psychological', 'Classic Detective'],
      default: 'Realistic',
    },
    evidenceTypes: {
      type: [String],
      default: ['Messages', 'CCTV', 'Witness Statements'],
    },
    status: {
      type: String,
      enum: ['generating', 'ready', 'in_progress', 'completed', 'failed'],
      default: 'generating',
      index: true,
    },
    generationStatus: {
      type: String,
      enum: ['pending', 'generating', 'validating', 'reviewing', 'completed', 'failed'],
      default: 'pending',
    },
    generationError: {
      type: String,
      default: null,
    },
    // The canonical case contains the ground truth (culpritId, canonical solution, motives, contradictions, private facts)
    // NEVER returned directly to the player-facing API before resolution!
    canonicalCase: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      select: false, // Exclude by default from queries
    },
    // The player-safe case contains only the redacted information suitable for investigators
    playerSafeCase: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generationMetadata: {
      model: { type: String, default: 'gemini-2.5-flash' },
      promptVersion: { type: String, default: '1.0' },
      generationAttempts: { type: Number, default: 1 },
      generatedAt: { type: Date, default: Date.now },
      validationStatus: { type: String, default: 'passed' },
      reviewStatus: { type: String, default: 'passed' },
    },
  },
  {
    timestamps: true,
  }
);

mysteryCaseSchema.index({ createdAt: -1 });

export const MysteryCase = mongoose.model('MysteryCase', mysteryCaseSchema);
