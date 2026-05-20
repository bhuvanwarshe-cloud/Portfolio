import express from 'express';
import { handleContactSubmit } from '../controllers/contact.controller.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/contact
// Applies rate limiter middleware before the controller to prevent spam/abuse
router.post('/', contactRateLimiter, handleContactSubmit);

export default router;
