# Quick Start Guide - Google OAuth Setup

## Step 1: Get Google OAuth Credentials (5 minutes)

### Create Google Cloud Project
1. Open https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Enter project name: "Expense Tracker" → Create
4. Wait for project creation, then select it

### Enable Google+ API (Optional but recommended)
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click Enable

### Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → Create
3. Fill in:
   - App name: **Expense Tracker**
   - User support email: **your-email@gmail.com**
   - Developer contact: **your-email@gmail.com**
4. Click "Save and Continue"
5. Skip "Scopes" → "Save and Continue"
6. Skip "Test users" → "Save and Continue"
7. Click "Back to Dashboard"

### Create OAuth Client ID
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Select "Web application"
4. Name: **Expense Tracker Web Client**
5. Add Authorized JavaScript origins:
   - Click "+ Add URI"
   - Enter: `http://localhost:5173`
   - Click "+ Add URI" again
   - Enter: `http://localhost:3000`
6. Add Authorized redirect URIs:
   - Click "+ Add URI"
   - Enter: `http://localhost:5173`
7. Click "CREATE"
8. **COPY** the Client ID (looks like: xxxxx.apps.googleusercontent.com)
9. **COPY** the Client Secret
10. Click "OK"

---

## Step 2: Configure Your Application

### Backend Configuration
1. Open file: `server/.env`
2. Replace the placeholders:
   ```env
   GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
   ```

### Frontend Configuration
1. Open file: `client/.env`
2. Replace the placeholder:
   ```env
   VITE_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
   ```

---

## Step 3: Start the Application

### Terminal 1 - Start Backend
```bash
cd server
npm start
```
Wait for: "MongoDB connected" and "Server running on port 3000"

### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```
Wait for: "Local: http://localhost:5173/"

---

## Step 4: Test Google Login

1. Open browser: http://localhost:5173
2. Click "Sign in with Google" button
3. Select your Google account
4. Click "Allow" to authorize
5. You should be logged in! ✅

---

## Troubleshooting

### Error: "Invalid Google token"
- Double-check GOOGLE_CLIENT_ID matches in both frontend and backend .env files
- Ensure you saved the .env files after editing

### Error: "redirect_uri_mismatch"
- Go back to Google Cloud Console
- Edit your OAuth Client
- Ensure `http://localhost:5173` is in "Authorized JavaScript origins"
- Click Save

### Google button not showing
- Check browser console (F12)
- Ensure `@react-oauth/google` is installed: `cd client && npm install @react-oauth/google`
- Refresh the page

### CORS errors
- Ensure backend is running on port 3000
- Check FRONTEND_URL in server/.env is correct

---

## What Happens When You Sign In?

1. **You click** "Sign in with Google"
2. **Google popup** opens asking you to select account
3. **Google verifies** your identity
4. **Google returns** a secure token
5. **Our backend** verifies the token with Google
6. **Backend creates/finds** your user account
7. **Backend returns** your profile and login token
8. **Frontend stores** your session
9. **You're logged in!** Dashboard loads

---

## Security Notes

- ✅ Your password never leaves Google
- ✅ Tokens are verified on our backend
- ✅ Tokens expire after 30 days
- ✅ You can revoke access anytime from Google Account settings

---

## Production Deployment

When deploying to production:

1. Add your production URL to Google Cloud Console:
   - Go to Credentials → Edit OAuth Client
   - Add your production URLs to authorized origins
   - Example: `https://myapp.vercel.app`

2. Update environment variables in your hosting platform

3. Never commit `.env` files to Git!

---

## Need Help?

- 📖 Full documentation: See `GOOGLE_AUTH_SETUP.md`
- 🔍 Google's guide: https://developers.google.com/identity/protocols/oauth2
- 💬 Check backend logs for detailed error messages

---

**That's it! Your Google OAuth is ready to use! 🎉**
