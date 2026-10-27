import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const createMysterySchema = z.object({
  scenario: z
    .string()
    .trim()
    .min(30, 'Scenario must be at least 30 characters long.')
    .max(3000, 'Scenario cannot exceed 3000 characters.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  category: z
    .enum([
      'Murder Mystery',
      'Theft',
      'Disappearance',
      'Corporate Espionage',
      'Cybercrime',
      'Suspicious Incident',
      'Custom',
    ])
    .default('Custom'),
  investigationStyle: z
    .enum(['Realistic', 'Cinematic', 'Psychological', 'Classic Detective'])
    .default('Realistic'),
  evidenceTypes: z
    .array(z.string())
    .min(3, 'At least three evidence categories must be selected.')
    .default(['Messages', 'CCTV', 'Witness Statements']),
});

export const accusationSchema = z.object({
  suspectId: z.string().min(1, 'Suspect ID is required'),
  reasoning: z.string().max(2000).optional().nullable(),
  supportingEvidenceIds: z.array(z.string()).optional().default([]),
});

export const hintSchema = z.object({
  hintLevel: z.number().int().min(1).max(3).default(1),
});

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message).join(' ');
      return res.status(400).json({
        success: false,
        message: issues || 'Validation failed on request body.',
        code: 'VALIDATION_ERROR',
      });
    }
    req.body = result.data;
    next();
  };
}
