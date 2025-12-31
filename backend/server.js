import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import interviewRoutes from './routes/interview.js';
import userRoutes from './routes/user.js';
import chatCompletionsRoutes from './routes/chatCompletions.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import Firebase Admin and Firestore
import { initializeFirebaseAdmin } from './config/firebaseAdmin.js';
import { initializeFirestore } from './config/firebase.js';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
initializeFirebaseAdmin();
// Initialize Firestore
initializeFirestore();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'visa-interview-api',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Public routes (no auth required) - MUST come before global CORS to use route-specific CORS
app.use('/', chatCompletionsRoutes); // OpenAI-compatible endpoint for ElevenLabs (has its own CORS config)

// CORS for /api routes only (stricter)
app.use('/api/*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
