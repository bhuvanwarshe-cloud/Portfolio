import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.routes.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ───────────────────────────────────────────────────────
// Build allowed origins from env variable — supports comma-separated list
// e.g. ALLOWED_ORIGINS=https://bhuvanwarshe.vercel.app,http://localhost:5173
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''))  // ← strip any trailing slash
  .filter(Boolean);

// If no origin is configured, default to allowing all (useful for initial setup)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Normalize: strip any trailing slash from the incoming origin too
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked request from: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // Some browsers (IE11) choke on 204
};

// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Apply CORS middleware globally
app.use(cors(corsOptions));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Global Rate Limiter (broad protection across all routes) ─────────────────
app.use(globalRateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

// Health check — visit the backend URL root to confirm it's alive
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio backend is running perfectly.',
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'ALL (open)'}`);
});
