const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// ==========================================
// MONGODB CONNECTION (Serverless-optimized)
// ==========================================
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGO_URI;
  
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined');
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    cachedConnection = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
    console.log('MongoDB connected successfully');
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

// ==========================================
// USER SCHEMA (Inline for serverless)
// ==========================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  Password: { type: String, required: function() { return !this.googleId; } },
  phone: { type: String },
  avatar: { type: String },
  googleId: { type: String, sparse: true },
  authProvider: { type: String, default: 'email', enum: ['email', 'google'] },
  preferences: {
    currency: { type: String, default: '₹', enum: ['₹', '$', '€', '£'] },
    monthlyBudget: { type: Number, default: 0 },
    monthStart: { type: Number, default: 1, min: 1, max: 31 },
    defaultPaymentMethod: { type: String, default: 'upi', enum: ['cash', 'credit card', 'debit card', 'upi', 'net banking'] },
    theme: { type: String, default: 'light', enum: ['light', 'dark'] },
    dashboardLayout: { type: String, default: 'detailed', enum: ['compact', 'detailed'] },
    notifications: { type: Boolean, default: true }
  },
  isDeleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// Use existing model or create new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ==========================================
// GOOGLE TOKEN VERIFICATION
// ==========================================
async function verifyGoogleToken(credential) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  if (!GOOGLE_CLIENT_ID) {
    console.error('GOOGLE_CLIENT_ID is not defined');
    throw new Error('GOOGLE_CLIENT_ID environment variable is not defined');
  }

  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log('Google token verified for:', payload.email);
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Invalid Google token');
  }
}

// ==========================================
// JWT GENERATION
// ==========================================
function generateJWT(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ==========================================
// GET CORS ORIGIN
// ==========================================
function getCorsOrigin(requestOrigin) {
  // Use FRONTEND_URL from env if available
  const frontendUrl = process.env.FRONTEND_URL;
  
  const allowedOrigins = [
    frontendUrl,
    'https://financial-dashboard-wwwp.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean);

  if (allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Return the FRONTEND_URL or first allowed origin
  return frontendUrl || allowedOrigins[0];
}

// ==========================================
// MAIN HANDLER
// ==========================================
module.exports = async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOrigin = getCorsOrigin(origin);

  // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // --- HANDLE PREFLIGHT ---
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }

  // --- ONLY ALLOW POST ---
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed' 
    });
  }

  console.log('Google auth request received');

  try {
    // Get credential from request body
    const { credential } = req.body;

    if (!credential) {
      console.error('No credential provided in request body');
      return res.status(400).json({ 
        success: false, 
        message: 'Google credential is required' 
      });
    }

    console.log('Verifying Google token...');
    
    // Verify Google token
    const googleUser = await verifyGoogleToken(credential);
    console.log('Google user verified:', googleUser.email);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('MongoDB connected');

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { googleId: googleUser.googleId },
        { email: googleUser.email }
      ]
    });

    if (user) {
      console.log('Existing user found:', user.email);
      // Update existing user with Google info
      user.googleId = googleUser.googleId;
      user.authProvider = 'google';
      if (googleUser.avatar && !user.avatar) {
        user.avatar = googleUser.avatar;
      }
      if (googleUser.name && !user.name) {
        user.name = googleUser.name;
      }
      await user.save();
    } else {
      console.log('Creating new user:', googleUser.email);
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
        authProvider: 'google',
        preferences: {
          currency: '₹',
          monthlyBudget: 0,
          monthStart: 1,
          defaultPaymentMethod: 'upi',
          theme: 'light',
          dashboardLayout: 'detailed',
          notifications: true
        }
      });
    }

    console.log('Generating JWT...');
    // Generate JWT
    const token = generateJWT(user);

    // Set HttpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `token=${token}`,
      'HttpOnly',
      isProduction ? 'Secure' : '',
      'SameSite=None',
      'Path=/',
      `Max-Age=${7 * 24 * 60 * 60}`,
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieOptions);

    // Prepare user response (exclude sensitive data)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      preferences: user.preferences,
      authProvider: user.authProvider,
    };

    console.log('Google auth successful for:', user.email);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Google auth error:', error.message);
    console.error('Full error:', error);
    
    // Handle specific errors
    if (error.message === 'Invalid Google token') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired Google token. Please try again.' 
      });
    }

    if (error.message.includes('environment variable')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error. Please contact support.' 
      });
    }

    if (error.message.includes('duplicate key')) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email already exists.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed. Please try again.',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};
