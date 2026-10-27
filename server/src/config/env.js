import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_mystery_room',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  JWT_SECRET: process.env.JWT_SECRET || 'ai_mystery_room_super_secure_jwt_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
  IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || 'gemini',
  IMAGE_MODEL: process.env.IMAGE_MODEL || 'imagen-3.0-generate-002',
};

export function validateEnv() {
  const missing = [];
  if (!env.JWT_SECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!env.GEMINI_API_KEY && env.NODE_ENV === 'production') {
    console.warn('[WARN] GEMINI_API_KEY is not defined in production.');
  }
}
