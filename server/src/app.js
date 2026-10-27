import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and specified client URL
      if (!origin || origin === env.CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-session-id'],
    exposedHeaders: ['x-guest-session-id'],
  })
);

// Body and Cookie parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Mount API v1
app.use('/api/v1', apiRouter);

// Undefined route 404 handler
app.use('*', (req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} not found on this server.`, 404, 'NOT_FOUND'));
});

// Centralized error handler
app.use(errorHandler);

export default app;
