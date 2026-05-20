# Portfolio Contact Backend Setup Guide

This guide covers setting up, running, and deploying the Node.js Express backend for your portfolio's contact form.

## 1. Local Setup

1. **Navigate to the server directory**:
   ```bash
   cd c:/Portfolio/server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *This will install `express`, `nodemailer`, `dotenv`, `cors`, and `express-rate-limit`.*

3. **Configure Environment Variables**:
   Create a new file named `.env` in the `server` folder (copy from `.env.example`) and add your actual credentials:
   ```env
   PORT=5000
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ALLOWED_ORIGIN=http://localhost:5173
   ```

## 2. Generating a Gmail App Password
Because standard Google passwords do not work for Nodemailer without 2FA complications, you need an "App Password":
1. Go to your [Google Account Manage page](https://myaccount.google.com/).
2. Navigate to **Security** on the left menu.
3. Under "How you sign in to Google", ensure **2-Step Verification** is turned ON.
4. Click on **2-Step Verification**, scroll to the bottom, and click on **App passwords**.
5. Select **App**: *Other (Custom name)*, type `Portfolio Backend`, and click **Generate**.
6. Copy the **16-character password** (remove any spaces) and paste it into your `.env` file for `EMAIL_PASS`.

## 3. Local Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   You should see `Server is running on port 5000`.

2. **Test using cURL (or Postman)**:
   Open another terminal and test your endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/contact \
   -H "Content-Type: application/json" \
   -d "{\"name\":\"Test User\", \"email\":\"test@example.com\", \"message\":\"This is a test message.\"}"
   ```
   Check your Gmail inbox. You should receive a professional HTML email!

---

## 4. Deployment Instructions for Render

1. Go to [Render.com](https://render.com) and sign in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository that contains this code.
4. Ensure the **Root Directory** is set to `server` (if your repo contains both frontend and backend).
5. Set the configurations:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down to **Environment Variables** and add:
   - `EMAIL_USER` = (your Gmail address)
   - `EMAIL_PASS` = (your 16-char App Password)
   - `ALLOWED_ORIGIN` = (your deployed frontend URL, e.g., `https://myportfolio.vercel.app`)
7. Click **Create Web Service**. Wait for the build to finish.
8. Once deployed, Render gives you a URL (e.g., `https://portfolio-backend-xyz.onrender.com`). Update your frontend code to use this URL.

---

## 5. Frontend Integration

Here is how you can integrate this backend with your existing React/Vite frontend using `axios`.

### Example Axios POST Request
```javascript
import axios from 'axios';
import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      // Use your deployed URL in production, or localhost for development
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      
      // Success case
      setStatus({ 
        loading: false, 
        error: null, 
        success: response.data.message // "Your message has been sent successfully!..."
      });
      
      // Clear form
      setFormData({ name: '', email: '', message: '' });
      
    } catch (err) {
      // Error case
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ loading: false, error: errorMessage, success: null });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your input fields bound to formData state */}
      {status.error && <div className="error-message">{status.error}</div>}
      {status.success && <div className="success-message">{status.success}</div>}
      <button type="submit" disabled={status.loading}>
        {status.loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
```

### Example API Responses

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! I will get back to you soon."
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

**Rate Limit Error Response (429 Too Many Requests):**
```json
{
  "success": false,
  "message": "Too many contact requests from this IP, please try again after 15 minutes."
}
```
