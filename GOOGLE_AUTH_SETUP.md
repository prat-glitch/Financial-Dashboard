# Google OAuth Authentication Setup Guide

## Overview
This application uses Google OAuth 2.0 for user authentication. Users can sign in or sign up using their Google account.

## Data Flow
1. **User Action**: User clicks "Sign in with Google" button
2. **Google OAuth**: Google OAuth popup opens and user selects account
3. **Token Generation**: Google generates an ID token (JWT) containing user info
4. **Token Verification**: Backend receives token and verifies it with Google's servers
5. **User Creation/Login**: Backend creates new user or logs in existing user
6. **JWT Token**: Backend generates app-specific JWT token
7. **Client Storage**: Client stores JWT token and user data in localStorage
8. **Authentication**: Client uses JWT token for all subsequent API requests

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen if not done already:
   - User Type: External
   - App Name: Your App Name
   - User support email: Your email
   - Authorized domains: Add your domains
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Your App Name
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production URL
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - Your production URL
7. Copy the **Client ID** and **Client Secret**

### 2. Configure Backend Environment Variables

Edit `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:5173
```

### 3. Configure Frontend Environment Variables

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

Required packages:
- `google-auth-library` - For verifying Google ID tokens
- `jsonwebtoken` - For generating JWT tokens
- `bcrypt` - For password hashing (email/password auth)

**Frontend:**
```bash
cd client
npm install
```

Required packages:
- `@react-oauth/google` - Google OAuth React components

### 5. Start the Application

**Start Backend:**
```bash
cd server
npm start
```

**Start Frontend:**
```bash
cd client
npm run dev
```

## Architecture

### Frontend (React)

**Components:**
- `Auth.jsx` - Login/Signup component with Google OAuth button
- `GoogleLogin` component from `@react-oauth/google` library

**Context:**
- `AuthContext.jsx` - Manages authentication state
- Stores JWT token and user data in localStorage

**Flow:**
```
User clicks Google button
  → GoogleLogin component opens OAuth popup
  → User authorizes app
  → Google returns credential (ID token)
  → Send credential to backend API
  → Store returned JWT token and user data
  → Redirect to dashboard
```

### Backend (Node.js/Express)

**Controller:** `userController.js`
- `googleAuth` function handles Google authentication

**Process:**
1. Receive Google ID token from frontend
2. Verify token using `google-auth-library`
3. Extract user info (email, name, picture, googleId)
4. Check if user exists in database
5. Create new user or update existing user
6. Generate JWT token
7. Return JWT token and user data

**Database Model:** `usermodel.js`
- Stores user information
- `authProvider` field indicates auth method (email/google)
- `googleId` field stores Google user ID
- Email/password users have `authProvider: 'email'`
- Google users have `authProvider: 'google'`

### Security Features

1. **Token Verification**: All Google ID tokens are verified with Google servers
2. **JWT Authentication**: App uses its own JWT tokens for API requests
3. **Protected Routes**: Backend routes protected with authentication middleware
4. **CORS Configuration**: Frontend URL whitelisted in backend

## API Endpoints

### POST `/api/users/google-auth`
Authenticate user with Google ID token

**Request:**
```json
{
  "credential": "google_id_token_here"
}
```

**Response:**
```json
{
  "message": "Google authentication successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@gmail.com",
    "avatar": "profile_picture_url",
    "phone": null,
    "preferences": {...}
  }
}
```

### GET `/api/users/verify-token`
Verify JWT token and get user data

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@gmail.com",
    "avatar": "profile_picture_url"
  }
}
```

## Testing

### Development Testing
1. Ensure both frontend and backend are running
2. Navigate to `http://localhost:5173`
3. Click "Sign in with Google"
4. Select your Google account
5. Authorize the application
6. You should be redirected to the dashboard

### Common Issues

**Issue:** "Invalid Google token" error
- **Solution:** Verify GOOGLE_CLIENT_ID is correct in both frontend and backend
- Ensure authorized JavaScript origins include your current URL

**Issue:** CORS errors
- **Solution:** Check FRONTEND_URL in backend .env matches your frontend URL
- Verify CORS configuration in backend

**Issue:** "No credential provided" error
- **Solution:** Ensure GoogleOAuthProvider wraps your app in main.jsx
- Check VITE_GOOGLE_CLIENT_ID is set in client/.env

**Issue:** Google button not showing
- **Solution:** Check browser console for errors
- Verify @react-oauth/google is installed
- Ensure internet connection (Google loads external resources)

## Production Deployment

### Frontend (Vercel/Netlify)
1. Add production domain to Google OAuth authorized origins
2. Set environment variable: `VITE_GOOGLE_CLIENT_ID`
3. Set environment variable: `VITE_API_URL` to your backend URL

### Backend (Vercel/Railway/Heroku)
1. Set all environment variables in hosting platform
2. Update FRONTEND_URL to production frontend URL
3. Ensure Google OAuth authorized origins include production URL

### Important Notes
- Keep GOOGLE_CLIENT_SECRET secure (never expose to frontend)
- Use environment variables (never hardcode credentials)
- Regularly rotate JWT_SECRET in production
- Monitor Google OAuth quota and usage in Google Cloud Console

## Support
For issues or questions, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [google-auth-library Documentation](https://www.npmjs.com/package/google-auth-library)
