import { sendContactEmail } from '../utils/email.util.js';

/**
 * POST /api/contact
 *
 * Receives form data from the portfolio contact form, validates it,
 * and sends an email to the portfolio owner via Nodemailer.
 *
 * Expected request body:
 *   { name, email, subject?, message }
 *
 * Responses:
 *   200 — email sent successfully
 *   400 — validation error (missing/invalid field)
 *   500 — SMTP or server error
 */
export const handleContactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    // Check each required field individually so the frontend gets precise errors

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    // RFC-compliant email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    // ── Log incoming request (helps trace issues in Render logs) ──────────────
    console.log(`📩 Contact form submission from: ${name.trim()} <${email.trim()}>`);

    // ── Send email via Nodemailer ─────────────────────────────────────────────
    await sendContactEmail({
      name:    name.trim(),
      email:   email.trim(),
      subject: subject?.trim() || 'New Contact Request',
      message: message.trim(),
    });

    // ── Success ───────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
    });

  } catch (error) {
    // Log the full error for Render logs — never swallow it silently
    console.error('❌ Contact controller error:', error.message);

    // Distinguish SMTP failures from unknown errors for clearer responses
    const isSmtpError = error.message?.includes('SMTP');

    return res.status(500).json({
      success: false,
      message: isSmtpError
        ? 'Failed to send your message due to a mail server issue. Please try again later.'
        : 'An unexpected error occurred. Please try again.',
    });
  }
};
