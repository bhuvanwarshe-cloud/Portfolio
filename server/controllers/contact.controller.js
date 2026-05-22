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

    // ── Log incoming request body for Render debugging ────────────────────────
    console.log('📥 Incoming contact request body:', {
      name:    name    || '(empty)',
      email:   email   || '(empty)',
      subject: subject || '(empty)',
      message: message ? `${message.substring(0, 60)}...` : '(empty)',
    });

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

    // ── Log before sending ────────────────────────────────────────────────────
    console.log(`📩 Contact form submission from: ${name.trim()} <${email.trim()}>`);
    console.log('📤 Calling sendContactEmail...');

    // ── Send email via Nodemailer ─────────────────────────────────────────────
    await sendContactEmail({
      name:    name.trim(),
      email:   email.trim(),
      subject: subject?.trim() || 'New Contact Request',
      message: message.trim(),
    });

    console.log('✅ sendContactEmail resolved successfully — email delivered.');

    // ── Success ───────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
    });

  } catch (error) {
    // ── Full error dump — visible in Render logs ──────────────────────────────
    console.error('❌ Contact controller caught an error:');
    console.error('   message :', error.message);
    console.error('   code    :', error.code    || 'N/A');
    console.error('   command :', error.command || 'N/A');
    console.error('   stack   :\n', error.stack);
    console.error('   full obj:', error);

    // Return full error details so you can read them directly on the frontend
    // or in the Render logs during debugging
    return res.status(500).json({
      success: false,
      message: error.message,
      stack:   error.stack,
    });
  }
};
