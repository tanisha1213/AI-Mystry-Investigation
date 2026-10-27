import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MysteryCase',
      required: true,
      index: true,
    },
    evidenceCode: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'message',
        'cctv',
        'photograph',
        'witness',
        'document',
        'forensic',
        'location',
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    assetUrl: {
      type: String,
      default: null,
    },
    assetType: {
      type: String,
      default: null,
    },
    timestamp: {
      type: String,
      default: null,
    },
    relatedSuspectIds: {
      type: [String],
      default: [],
    },
    relatedEvidenceIds: {
      type: [String],
      default: [],
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    // Hidden investigative significance (canonical only, never exposed to player before case completion)
    hiddenSignificance: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

evidenceSchema.index({ caseId: 1, evidenceCode: 1 });

export const Evidence = mongoose.model('Evidence', evidenceSchema);
