import rateLimit from 'express-rate-limit';

// Rate limiting configuration to prevent spam and abuse
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message: 'Too many contact requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
