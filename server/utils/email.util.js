import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a contact email
 * @param {Object} data - The contact form data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email
 * @param {string} [data.subject] - Sender's subject
 * @param {string} data.message - Sender's message
 * @returns {Promise<boolean>} - True if sent successfully
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    // Current timestamp for the email
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Escape HTML from user input to prevent XSS in email client
    const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Professional HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Portfolio Contact Message</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Subject:</strong> ${subject || 'New Contact Request'}</p>
          <p><strong>Date:</strong> ${timestamp}</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <h3 style="margin-top: 0; color: #2c3e50;">Message:</h3>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #e0e0e0; white-space: pre-wrap; color: #333; font-size: 15px; line-height: 1.5;">
            ${safeMessage}
          </div>
        </div>
        <div style="background-color: #eeeeee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          This message was sent via your portfolio contact form. Reply to this email to respond directly to the sender.
        </div>
      </div>
    `;

    // Setup email data
    const mailOptions = {
      from: `"${name} (Portfolio)" <${process.env.EMAIL_USER}>`, // Sender address (uses your authenticated email for reliable delivery)
      replyTo: email, // Allows you to hit "Reply" and email the person back directly
      to: 'bhuvanwarshe@gmail.com', // Your personal inbox — receives all contact form emails
      subject: `Portfolio Contact: ${subject || 'New Contact Request'}`, // Subject line
      html: htmlContent, // HTML body
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error in sendContactEmail utility:', error);
    throw new Error('Failed to send email via SMTP');
  }
};
