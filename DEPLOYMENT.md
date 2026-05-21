# 🚀 Portfolio Deployment Guide

> **Architecture:** React + Vite frontend on **Vercel** · Express + Nodemailer backend on **Render**

Vercel is a static hosting platform — it cannot run a long-lived Node.js Express server.
So the deployment is split:

| Layer | Platform | URL (example) |
|-------|----------|---------------|
| Frontend (React/Vite) | Vercel | `https://bhuvanwarshe.vercel.app` |
| Backend (Express/Nodemailer) | Render | `https://portfolio-backend-xyz.onrender.com` |

---

## 📁 Repository Structure (as analysed)

```
c:\Portfolio\
├── Frontend\                  ← React + Vite (deploy to Vercel)
│   ├── src\
│   │   └── sections\
│   │       └── Contact.jsx   ← Uses VITE_API_URL env variable
│   ├── vite.config.js
│   └── package.json
│
└── server\                    ← Express + Nodemailer (deploy to Render)
    ├── index.js
    ├── package.json
    ├── .env.example
    ├── routes\contact.routes.js
    ├── controllers\contact.controller.js
    ├── middleware\rateLimiter.js
    └── utils\email.util.js
```

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Your code is pushed to a GitHub repository
- [ ] `server/.env` is in `.gitignore` (never push secrets)
- [ ] `server/node_modules` is in `.gitignore`
- [ ] `Frontend/node_modules` and `Frontend/dist` are in `.gitignore`
- [ ] Gmail App Password is ready (16 characters, no spaces)

### Ensure both .gitignore files are correct

**`server/.gitignore`** should contain:
```
node_modules/
.env
```

**`Frontend/.gitignore`** should contain:
```
node_modules/
dist/
.env
.env.local
```

---

## 🔧 Step 1 — Push Code to GitHub

```bash
# From the root c:\Portfolio directory
git init                         # (if not already a git repo)
git add .
git commit -m "initial portfolio deployment"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> **Important:** Make sure `.env` files are NOT committed.

---

## 🖥️ Step 2 — Deploy Backend to Render

> The Express backend **must** be on Render (or Railway/Fly.io). Vercel does not support persistent Express servers.

### 2.1 — Create a Render Account
Go to [https://render.com](https://render.com) and sign up with GitHub.

### 2.2 — Create a New Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure as follows:

| Setting | Value |
|---------|-------|
| **Name** | `portfolio-backend` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### 2.3 — Add Environment Variables on Render

In the **Environment** tab, add these variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `EMAIL_USER` | `bhuvanwarshe@gmail.com` |
| `EMAIL_PASS` | `iswivpbmdycxhqli` *(your Gmail App Password)* |
| `ALLOWED_ORIGIN` | *(leave blank for now — add after Vercel deploy)* |

### 2.4 — Deploy

Click **Create Web Service**. Render will build and deploy your backend.

Once done, copy your Render URL — it will look like:
```
https://portfolio-backend-xyz.onrender.com
```

> ⚠️ **Free tier note:** Render free services spin down after 15 minutes of inactivity. The first request after inactivity may take 30–60 seconds. Upgrade to a paid plan to avoid cold starts.

---

## 🌐 Step 3 — Deploy Frontend to Vercel

### 3.1 — Create a Vercel Account
Go to [https://vercel.com](https://vercel.com) and sign up with GitHub.

### 3.2 — Import Your Project

1. Click **Add New → Project**
2. Select your GitHub repository
3. Vercel will auto-detect Vite. Configure as follows:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `Frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.3 — Add Environment Variables on Vercel

In the **Environment Variables** section before deploying, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://portfolio-backend-xyz.onrender.com` *(your Render URL)* |

> **Critical:** Vite environment variables MUST start with `VITE_` to be accessible in the browser.

### 3.4 — Deploy

Click **Deploy**. Vercel will build your React app and give you a URL:
```
https://bhuvanwarshe.vercel.app
```

---

## 🔗 Step 4 — Update CORS on Render

Now that Vercel has given you a frontend URL, update your backend's CORS settings:

1. Go to your Render dashboard → **portfolio-backend** → **Environment**
2. Update `ALLOWED_ORIGIN` to your Vercel URL:
   ```
   ALLOWED_ORIGIN=https://bhuvanwarshe.vercel.app
   ```
3. Render will automatically redeploy the backend.

---

## 🧪 Step 5 — Test the Live Deployment

### Test the backend is alive:
Open in your browser:
```
https://portfolio-backend-xyz.onrender.com/
```
You should see:
```json
{ "message": "Portfolio backend is running perfectly." }
```

### Test the contact form end-to-end:
1. Visit your live Vercel site: `https://bhuvanwarshe.vercel.app`
2. Scroll to the **Hire Me** / **Contact** section
3. Fill in Name, Email, Subject, and Message
4. Click **Send Signal**
5. Check **bhuvanwarshe@gmail.com** — email should arrive within seconds ✉️

### Test via curl (optional):
```bash
curl -X POST https://portfolio-backend-xyz.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Hello!\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully! I will get back to you soon."
}
```

---

## 🔄 How It All Works in Production

```
Visitor fills form
      ↓
React app (Vercel)
      ↓
axios.post(`${VITE_API_URL}/api/contact`)
      ↓
Express API (Render)
      ↓  validates fields
      ↓  applies rate limiting
      ↓
Nodemailer → Gmail SMTP
      ↓
📧 Email arrives at bhuvanwarshe@gmail.com
      ↓
Success JSON → React shows "Signal Received!" ✅
```

---

## 🔑 Environment Variables Summary

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full URL of your Render backend |

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (5000) |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail 16-char App Password |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL |

---

## 🐛 Troubleshooting

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| Form submits but no email arrives | `EMAIL_PASS` wrong on Render | Re-check App Password (no spaces) |
| CORS error in browser console | `ALLOWED_ORIGIN` not set on Render | Add your Vercel URL to `ALLOWED_ORIGIN` |
| Backend returns 404 | Wrong Render URL in `VITE_API_URL` | Copy exact Render URL with no trailing slash |
| First form submit is slow | Render free tier cold start | Wait 30–60s, or upgrade Render plan |
| Vercel build fails | Wrong Root Directory | Set Root Directory to `Frontend` in Vercel settings |
| `VITE_API_URL` is undefined | Missing env var on Vercel | Add it in Vercel → Project Settings → Environment Variables |

---

## 🔁 Redeployment (Future Updates)

Any `git push` to `main` will **automatically trigger redeployment** on both:
- **Vercel** — rebuilds and redeploys the frontend
- **Render** — rebuilds and restarts the backend

No manual steps needed after the initial setup.

---

## 📋 Quick Reference

```bash
# Local development
cd c:/Portfolio/server  &&  npm run dev     # Backend: http://localhost:5000
cd c:/Portfolio/Frontend  &&  npm run dev   # Frontend: http://localhost:5173

# Production URLs (after deployment)
Frontend:  https://bhuvanwarshe.vercel.app
Backend:   https://portfolio-backend-xyz.onrender.com
API:       https://portfolio-backend-xyz.onrender.com/api/contact
```
