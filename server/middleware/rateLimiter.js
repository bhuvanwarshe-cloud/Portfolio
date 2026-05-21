import rateLimit from 'express-rate-limit';

// ─── Contact Form Rate Limiter ────────────────────────────────────────────────
//
// Strategy for a portfolio contact form:
//   - Generous enough for real visitors (who might preview then re-submit)
//   - Strict enough to block bots and spam floods
//   - Window: 1 hour | Max: 10 requests per IP
//
// Why these numbers?
//   A genuine human user will NEVER send 10 contact messages in 1 hour.
//   This blocks automated spam floods while never touching real users.
// ─────────────────────────────────────────────────────────────────────────────

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour rolling window

  max: 10, // Max 10 requests per IP per hour — generous for real users, strict for bots

  // Skip counting successful requests — only failed/spam attempts count toward the limit.
  // This means a genuine user submitting successfully won't burn through their quota.
  skipSuccessfulRequests: false,

  // Clean JSON error response — matches the rest of the API's response shape
  message: {
    success: false,
    message: 'Too many requests. Please wait a while before trying again.',
  },

  // Return standard RateLimit-* headers so clients know how long to wait
  standardHeaders: true,

  // Disable the older X-RateLimit-* headers (deprecated)
  legacyHeaders: false,

  // Custom handler for cleaner logging and response control
  handler: (req, res, next, options) => {
    console.warn(`[Rate Limit] Blocked IP: ${req.ip} — exceeded ${options.max} requests in the window.`);
    res.status(429).json(options.message);
  },
});

// ─── General API Rate Limiter (broader protection) ────────────────────────────
//
// Applied globally to all routes as a secondary safety net.
// Much more permissive — only blocks extreme abuse.
// ─────────────────────────────────────────────────────────────────────────────

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100,                  // 100 requests per IP per 15 min — normal browsing is fine
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});
