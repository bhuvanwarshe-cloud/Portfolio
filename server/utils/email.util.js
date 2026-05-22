import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// ─── Load env variables ────────────────────────────────────────────────────────
// dotenv.config() is idempotent — safe to call here even though index.js calls
// it first. This ensures EMAIL_USER and EMAIL_PASS are always available even if
// email.util.js is imported before index.js runs dotenv.
dotenv.config();

// ─── Validate credentials at module load time ─────────────────────────────────
// Fail fast and visibly — far better than a cryptic SMTP error at send time.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER) {
  console.error('❌ [email.util] EMAIL_USER is not set in environment variables.');
}
if (!EMAIL_PASS) {
  console.error('❌ [email.util] EMAIL_PASS is not set in environment variables.');
}

// ─── Create Nodemailer Transporter ────────────────────────────────────────────
//
// WHY these specific settings for Render free tier:
//
//   host: 'smtp.gmail.com'
//     Direct SMTP host instead of `service: 'gmail'` shorthand.
//     The shorthand resolves to different ports/settings depending on the
//     Nodemailer version — explicit config is always predictable.
//
//   port: 587
//     The standard STARTTLS submission port. Port 465 (SSL) can be blocked
//     by some cloud provider outbound firewall rules. 587 is more universally
//     open on Render's network.
//
//   secure: false
//     MUST be false for port 587. `secure: true` is for port 465 (SSL-only).
//     With port 587, the connection starts unencrypted and upgrades via STARTTLS.
//
//   requireTLS: true
//     Forces Nodemailer to UPGRADE the connection to TLS via STARTTLS before
//     sending any credentials. Without this, Gmail rejects the auth attempt.
//     This is the critical flag that makes port 587 work securely.
//
//   tls.rejectUnauthorized: false
//     Render's outbound network sometimes routes through intermediate proxies
//     whose TLS certificates don't match the expected chain. This setting
//     prevents those certificate validation failures from killing the connection.
//     Safe to use here because we are explicitly connecting to smtp.gmail.com —
//     we trust the destination, just not every intermediate hop.
//
//   connectionTimeout / greetingTimeout / socketTimeout: 30000
//     Render free tier has cold start delays and slower network I/O.
//     Without explicit timeouts, Nodemailer uses very short defaults (~10s)
//     which expire before the SMTP handshake completes.
//     30s gives the connection enough time to establish on a cold Render instance.
//
console.log('🔧 [email.util] Creating Nodemailer SMTP transporter...');
console.log(`   host    : smtp.gmail.com`);
console.log(`   port    : 587`);
console.log(`   secure  : false (STARTTLS upgrade via requireTLS)`);
console.log(`   user    : ${EMAIL_USER || '⚠️  NOT SET'}`);
console.log(`   pass    : ${EMAIL_PASS ? '✅ set (hidden)' : '⚠️  NOT SET'}`);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   // Direct SMTP host — no `service` shorthand
  port: 587,                // STARTTLS port — most open on cloud providers
  secure: false,            // false = plain start, then upgrade to TLS via STARTTLS
  requireTLS: true,         // Force STARTTLS upgrade before any auth/data
  auth: {
    user: EMAIL_USER,       // Your Gmail address (EMAIL_USER env var)
    pass: EMAIL_PASS,       // 16-char Gmail App Password (EMAIL_PASS env var)
                            // NOT your Gmail login password — App Password only!
  },
  tls: {
    rejectUnauthorized: false, // Allow connections through Render's network proxies
  },
  connectionTimeout: 30000, // 30s — time to establish TCP connection
  greetingTimeout:   30000, // 30s — time to receive SMTP server greeting (220 ...)
  socketTimeout:     30000, // 30s — max idle time on the socket during a command
});

// ─── Verify SMTP connection on server startup ─────────────────────────────────
// transporter.verify() opens a real connection to smtp.gmail.com and checks that
// the credentials authenticate correctly. If this fails, the error message tells
// you exactly what's wrong:
//   ECONNREFUSED → port blocked by Render firewall
//   EAUTH        → wrong EMAIL_USER or EMAIL_PASS (most common issue)
//   ETIMEDOUT    → network/proxy issue, adjust timeouts
//
console.log('🔍 [email.util] Verifying SMTP connection to smtp.gmail.com:587...');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ [email.util] SMTP verification FAILED — emails will not send:');
    console.error(`   message  : ${error.message}`);
    console.error(`   code     : ${error.code     || 'N/A'}`);
    console.error(`   command  : ${error.command  || 'N/A'}`);
    console.error(`   response : ${error.response || 'N/A'}`);
    console.error('   stack    :\n', error.stack);
    console.error('   ──────────────────────────────────────────────────────────');
    console.error('   ➜ EAUTH?     → EMAIL_PASS is wrong or not a Gmail App Password');
    console.error('   ➜ ETIMEDOUT? → Render is blocking port 587, try port 465');
    console.error('   ➜ ECONNREFUSED? → Port 587 is blocked on this network');
  } else {
    console.log('✅ [email.util] SMTP connected and authenticated — ready to send emails!');
  }
});

/**
 * Sends a professional HTML contact form email to the portfolio owner.
 *
 * @param {Object} data
 * @param {string} data.name    — Visitor's full name
 * @param {string} data.email   — Visitor's email address
 * @param {string} data.subject — Subject line (optional)
 * @param {string} data.message — Message body
 * @returns {Promise<void>}     — Resolves on success, throws on failure
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {

  // ── Format timestamp ─────────────────────────────────────────────────────────
  const timestamp = new Date().toLocaleString('en-US', {
    weekday:      'long',
    year:         'numeric',
    month:        'long',
    day:          'numeric',
    hour:         '2-digit',
    minute:       '2-digit',
    timeZoneName: 'short',
  });

  // ── Sanitize user input (prevent HTML injection in email body) ────────────────
  const safe = (str) => String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');

  const safeName    = safe(name);
  const safeEmail   = safe(email);
  const safeSubject = safe(subject || 'New Contact Request');
  const safeMessage = safe(message).replace(/\n/g, '<br/>');

  // ── Professional HTML email template ─────────────────────────────────────────
  const htmlContent = `
    <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:620px; margin:0 auto;
                background:#ffffff; border:1px solid #e2e8f0; border-radius:10px;
                overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a202c 0%,#2d3748 100%);
                  padding:28px 32px; text-align:center;">
        <h2 style="margin:0; color:#ffffff; font-size:20px; font-weight:600; letter-spacing:0.5px;">
          📬 New Portfolio Contact
        </h2>
        <p style="margin:6px 0 0; color:rgba(255,255,255,0.6); font-size:13px;">
          Someone reached out via your portfolio website
        </p>
      </div>

      <!-- Details -->
      <div style="padding:28px 32px; background:#f8fafc;">
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; width:90px;">
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
                           color:#94a3b8; font-weight:600;">From</span>
            </td>
            <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
              <strong style="color:#1e293b;">${safeName}</strong>&nbsp;
              <a href="mailto:${safeEmail}" style="color:#3b82f6; text-decoration:none; font-size:14px;">
                ${safeEmail}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
                           color:#94a3b8; font-weight:600;">Subject</span>
            </td>
            <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
              <span style="color:#1e293b; font-weight:500;">${safeSubject}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;">
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
                           color:#94a3b8; font-weight:600;">Received</span>
            </td>
            <td style="padding:10px 0;">
              <span style="color:#64748b; font-size:14px;">${timestamp}</span>
            </td>
          </tr>
        </table>

        <!-- Message body -->
        <div style="margin-bottom:4px;">
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
                       color:#94a3b8; font-weight:600;">Message</span>
        </div>
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid #3b82f6;
                    border-radius:6px; padding:18px 20px; color:#334155;
                    font-size:15px; line-height:1.7;">
          ${safeMessage}
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px; background:#f1f5f9; text-align:center;
                  border-top:1px solid #e2e8f0;">
        <p style="margin:0; font-size:12px; color:#94a3b8;">
          Hit <strong>Reply</strong> to respond directly to ${safeName}
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from:    `"${safeName} via Portfolio" <${EMAIL_USER}>`,
    replyTo: email,                      // Reply goes straight to the visitor
    to:      'bhuvanwarshe@gmail.com',   // Your inbox
    subject: `Portfolio Contact: ${safeSubject}`,
    html:    htmlContent,
  };

  // ── Send with full logging ────────────────────────────────────────────────────
  console.log(`📤 [email.util] sendMail → to: bhuvanwarshe@gmail.com`);
  console.log(`   from   : "${safeName} via Portfolio" <${EMAIL_USER}>`);
  console.log(`   subject: Portfolio Contact: ${safeSubject}`);

  try {
    const info = await transporter.sendMail(mailOptions);
    // messageId confirms Gmail accepted the message — delivery guaranteed
    console.log(`✅ [email.util] sendMail accepted — Message-ID: ${info.messageId}`);
  } catch (error) {
    // Log every field — nothing swallowed, everything visible in Render logs
    console.error('❌ [email.util] sendMail FAILED:');
    console.error(`   message  : ${error.message}`);
    console.error(`   code     : ${error.code     || 'N/A'}`);
    console.error(`   command  : ${error.command  || 'N/A'}`);
    console.error(`   response : ${error.response || 'N/A'}`);
    console.error('   stack    :\n', error.stack);

    // Re-throw the original error (not a wrapped one) so the controller
    // catch block receives the full error object with code/command intact
    throw error;
  }
};
