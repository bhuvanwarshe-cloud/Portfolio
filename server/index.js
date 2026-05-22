import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.routes.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

// ─── Load env variables FIRST before anything else reads them ─────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Trust Proxy (CRITICAL for Render) ───────────────────────────────────────
// Render sits behind a reverse proxy (nginx). Without this:
//   1. express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
//   2. req.ip returns the proxy IP, not the real client IP
// "1" means trust the first proxy hop (Render's load balancer).
app.set('trust proxy', 1);

// ─── CORS Configuration ───────────────────────────────────────────────────────
// CLIENT_URL is the single source of truth for the allowed frontend origin.
// Supports comma-separated list for multi-environment setups.
// e.g. CLIENT_URL=https://portfolio-one-sepia-vdli3a698w.vercel.app
const rawOrigins = (
  process.env.CLIENT_URL ||
  process.env.ALLOWED_ORIGINS ||
  process.env.ALLOWED_ORIGIN ||
  ''
);

const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''))   // strip trailing slashes
  .filter(Boolean);

console.log(`🌐 Allowed CORS origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'ALL (open — no CLIENT_URL set)'}`);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin header (Postman, curl, health checks)
    if (!origin) return callback(null, true);

    // Normalize the incoming origin — strip any trailing slash
    const normalized = origin.replace(/\/$/, '');

    // Allow if whitelist is empty (dev mode) or origin is in the list
    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }

    // Log blocked origins — useful for debugging Render logs
    console.warn(`🚫 CORS blocked: ${origin}`);
    return callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,            // Allow cookies/auth headers from frontend
  optionsSuccessStatus: 200,    // Preflight response (some browsers choke on 204)
};

// Respond to preflight OPTIONS for ALL routes before anything else
app.options('*', cors(corsOptions));

// Apply CORS to every request
app.use(cors(corsOptions));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
// Broad protection — contact route has its own tighter limiter on top of this
app.use(globalRateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

// ─── Health Check Routes ──────────────────────────────────────────────────────
// GET /  — warmup ping used by useBackendWarmup() on the React frontend
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio backend is running perfectly.',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/health — standard health check for monitoring tools and Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend running',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches any error thrown by middleware or route handlers that isn't caught locally
app.use((err, req, res, next) => {
  console.error('💥 Unhandled server error:', err.message);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again.',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email user: ${process.env.EMAIL_USER || '⚠️  EMAIL_USER not set!'}`);
  console.log(`🔑 Email pass: ${process.env.EMAIL_PASS ? '✅ set' : '⚠️  EMAIL_PASS not set!'}`);
});
