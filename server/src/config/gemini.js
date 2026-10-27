import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

let genAI = null;

export function getGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return genAI;
}

export function isGeminiConfigured() {
  return Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);
}

export function getGeminiModel(modelOverride) {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('Gemini API key is not configured.');
  }
  const modelName = modelOverride || env.GEMINI_MODEL || 'gemini-2.5-flash';
  return client.getGenerativeModel({ model: modelName });
}
