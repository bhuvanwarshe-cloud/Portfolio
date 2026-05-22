import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure env variables are loaded (index.js calls this first, but safe to call again)
dotenv.config();

// ─── Validate required env variables on startup ───────────────────────────────
// If these are missing, log a clear warning immediately rather than failing
// silently at send time.
if (!process.env.EMAIL_USER) {
  console.error('⚠️  EMAIL_USER environment variable is not set. Emails will fail.');
}
if (!process.env.EMAIL_PASS) {
  console.error('⚠️  EMAIL_PASS environment variable is not set. Emails will fail.');
}

// ─── Nodemailer Transporter ───────────────────────────────────────────────────
// Using explicit Gmail SMTP settings (host/port/secure) instead of the
// shorthand `service: 'gmail'` — this is more reliable on cloud platforms
// like Render where the `service` shorthand can use the wrong port/settings.
//
// Key settings:
//   host: 'smtp.gmail.com'  — Gmail's SMTP server
//   port: 465               — SSL port (always encrypted from the start)
//   secure: true            — Use TLS/SSL (required for port 465)
//
// Why port 465 over 587?
//   Port 587 uses STARTTLS (upgrades plain → encrypted mid-connection).
//   Render's network sometimes drops STARTTLS handshakes → ETIMEDOUT.
//   Port 465 is encrypted from byte 1 — no handshake to drop.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,           // true = SSL from connection start (port 465)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be a Gmail App Password, not your login password
  },
  // Connection timeout settings — prevents hanging on Render cold network
  connectionTimeout: 10000,  // 10s to establish the TCP connection
  greetingTimeout:   10000,  // 10s for the SMTP server greeting
  socketTimeout:     30000,  // 30s max for any socket operation
});

// ─── Verify transporter on startup ───────────────────────────────────────────
// This checks that Gmail credentials are correct when the server boots.
// Errors here mean EMAIL_USER or EMAIL_PASS is wrong — check Render env vars.
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP transporter verification failed:', error.message);
    console.error('   Check EMAIL_USER and EMAIL_PASS in your Render environment variables.');
  } else {
    console.log('✅ SMTP transporter is ready — emails will send successfully.');
  }
});

/**
 * Sends a contact form email to the portfolio owner's inbox.
 *
 * @param {Object} data
 * @param {string} data.name    - Visitor's name
 * @param {string} data.email   - Visitor's email address
 * @param {string} data.subject - Email subject (optional)
 * @param {string} data.message - Visitor's message body
 * @returns {Promise<void>} Resolves on success, throws detailed error on failure
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  // Format a readable timestamp for the email body
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    timeZoneName: 'short',
  });

  // Sanitize user input — prevent HTML injection in the email client
  const safe = (str) => String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const safeMessage = safe(message).replace(/\n/g, '<br/>');
  const safeName    = safe(name);
  const safeSubject = safe(subject || 'New Contact Request');

  // ─── Professional HTML email template ──────────────────────────────────────
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 28px 32px; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
          📬 New Portfolio Contact
        </h2>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.6); font-size: 13px;">
          Someone reached out via your portfolio website
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 28px 32px; background: #f8fafc;">

        <!-- Sender info -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; width: 90px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600;">From</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
              <strong style="color: #1e293b;">${safeName}</strong>
              &nbsp;
              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600;">Subject</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #1e293b; font-weight: 500;">${safeSubject}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600;">Received</span>
            </td>
            <td style="padding: 10px 0;">
              <span style="color: #64748b; font-size: 14px;">${timestamp}</span>
            </td>
          </tr>
        </table>

        <!-- Message -->
        <div style="margin-bottom: 4px;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600;">Message</span>
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 18px 20px; color: #334155; font-size: 15px; line-height: 1.7;">
          ${safeMessage}
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; background: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          Hit <strong>Reply</strong> to respond directly to ${safeName} at ${email}
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from:    `"${safeName} via Portfolio" <${process.env.EMAIL_USER}>`,
    replyTo: email,                        // Reply goes directly to the visitor
    to:      'bhuvanwarshe@gmail.com',     // Your inbox
    subject: `Portfolio Contact: ${safeSubject}`,
    html:    htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent — Message ID: ${info.messageId}`);
  } catch (error) {
    // Log the full error object so Render logs show the exact SMTP failure reason
    console.error('❌ sendMail failed:', {
      code:    error.code,
      command: error.command,
      message: error.message,
    });
    // Re-throw with a clean message for the controller to catch
    throw new Error(`SMTP send failed: ${error.code || error.message}`);
  }
};
