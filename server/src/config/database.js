import mongoose from 'mongoose';
import { env } from './env.js';

let mongodInstance = null;

export async function connectDatabase() {
  try {
    // Attempt standard connection first with short timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to MongoDB at ${env.MONGODB_URI}`);
  } catch (err) {
    if (env.NODE_ENV !== 'production') {
      console.warn(`[Database] Direct MongoDB connection failed (${err.message}). Starting MongoMemoryServer for development...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const uri = mongodInstance.getUri();
        await mongoose.connect(uri);
        console.log(`[Database] In-memory MongoDB running at ${uri}`);
        return;
      } catch (memErr) {
        console.error('[Database] Failed to start MongoMemoryServer:', memErr.message);
        throw memErr;
      }
    }
    throw err;
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
}
