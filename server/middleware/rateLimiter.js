import rateLimit from 'express-rate-limit';

// ─── Contact Route Rate Limiter ───────────────────────────────────────────────
//
// Applied only to POST /api/contact.
//
// Settings rationale for a portfolio contact form:
//   Window : 1 hour
//   Max    : 10 requests per IP
//
// A real human visitor sends 1-2 messages max per hour.
// A bot or spammer typically fires hundreds of requests — this blocks them
// at request #11 without ever affecting real users.
//
// NOTE: trust proxy must be set in index.js (app.set('trust proxy', 1))
//       for req.ip to return the real client IP on Render, not the proxy IP.
//       Without that, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
// ─────────────────────────────────────────────────────────────────────────────

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour rolling window

  max: 10,                    // 10 requests per IP per hour

  standardHeaders: true,      // Send RateLimit-* headers so clients know when to retry
  legacyHeaders:   false,     // Don't send deprecated X-RateLimit-* headers

  // Skip incrementing the counter for successful requests.
  // Only failed attempts (validation errors, spam) eat into the quota.
  skipSuccessfulRequests: true,

  // Custom handler: logs blocked IPs to Render logs and returns clean JSON
  handler: (req, res, next, options) => {
    console.warn(`[Rate Limit] Blocked ${req.ip} — hit ${options.max} req/${options.windowMs / 60000}min limit`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from your IP. Please wait an hour before trying again.',
    });
  },
});

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
//
// Applied to ALL routes in index.js as a broad protective layer.
// Much more permissive — only catches extreme abuse or DDoS attempts.
//
// Settings:
//   Window : 15 minutes
//   Max    : 100 requests per IP
// ─────────────────────────────────────────────────────────────────────────────

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per IP — normal browsing is well under this
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res, next, options) => {
    console.warn(`[Global Rate Limit] Blocked ${req.ip} — hit global limit`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please slow down and try again later.',
    });
  },
});
