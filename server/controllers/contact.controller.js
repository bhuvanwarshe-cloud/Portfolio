import { sendContactEmail } from '../utils/email.util.js';

export const handleContactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validate fields are provided and not empty
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 2. Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // 3. Process email sending using utility
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'New Contact Request',
      message: message.trim()
    });

    // 4. Send clean success response
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};
