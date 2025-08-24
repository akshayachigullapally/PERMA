import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import admin from 'firebase-admin';

const router = express.Router();

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Sign up
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Email, password, and username are required' });
    }

    console.log('Checking for existing user...');
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email, existingUser.username);
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Creating user...');
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      username,
      displayName: username
    });

    console.log('Saving user to database...');
    await user.save();

    console.log('Generating JWT token...');
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    console.log('Signup successful for user:', user.username);
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.json({
      message: 'Sign in successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Token verified',
      user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { idToken, displayName, email, photoURL } = req.body;

    // Verify the ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email: firebaseEmail } = decodedToken;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: firebaseEmail },
        { googleId: uid }
      ]
    });

    if (user) {
      // Update user's Google ID if not set
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
      }
    } else {
      // Create a new user
      const username = firebaseEmail.split('@')[0] + '_' + Date.now();
      
      user = new User({
        email: firebaseEmail,
        googleId: uid,
        username,
        displayName: displayName || username,
        profileImage: photoURL,
        isEmailVerified: true // Google accounts are pre-verified
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.json({
      message: 'Google sign in successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Firebase Login/Register (handles both new and existing users)
router.post('/firebase-login', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const idToken = authHeader && authHeader.split(' ')[1];

    if (!idToken) {
      return res.status(401).json({ message: 'Firebase ID token required' });
    }

    // Verify the ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email: firebaseEmail, name, picture } = decodedToken;

    console.log('Firebase token verified for:', firebaseEmail);

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: firebaseEmail },
        { googleId: uid }
      ]
    });

    if (user) {
      // Update user's Google ID if not set
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
      }
    } else {
      // Create a new user
      const baseUsername = firebaseEmail.split('@')[0];
      let username = baseUsername;
      
      // Ensure username is unique
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }
      
      user = new User({
        email: firebaseEmail,
        googleId: uid,
        username,
        displayName: name || username,
        profileImage: picture,
        isEmailVerified: true // Firebase accounts are pre-verified
      });

      await user.save();
      console.log('New user created from Firebase auth:', username);
    }

    // Generate JWT token for our backend
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.json({
      message: 'Firebase authentication successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: 'Firebase authentication failed' });
  }
});

export default router;
