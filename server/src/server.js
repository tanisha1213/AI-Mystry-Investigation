import app from './app.js';
import { env, validateEnv } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    validateEnv();
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`===============================================`);
      console.log(` AI MYSTERY ROOM — Backend Investigation API  `);
      console.log(` Mode:    ${env.NODE_ENV}`);
      console.log(` Port:    http://localhost:${env.PORT}`);
      console.log(` Health:  http://localhost:${env.PORT}/api/v1/health`);
      console.log(` Gemini:  ${env.GEMINI_API_KEY ? 'Configured (' + env.GEMINI_MODEL + ')' : 'Not configured (procedural fallback active)'}`);
      console.log(`===============================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('Database disconnected. Process terminating.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err.message);
    process.exit(1);
  }
}

bootstrap();
