import express from 'express';
import verifyFirebaseToken from '../middleware/firebaseAuth.js';

const router = express.Router();

// Test Firebase token verification
router.get('/firebase-test', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    message: 'Firebase token verification successful',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      email_verified: req.user.email_verified,
      name: req.user.name
    }
  });
});

// Test protected route with Firebase
router.get('/protected', verifyFirebaseToken, (req, res) => {
  res.json({
    message: "You accessed a Firebase-protected route!",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

export default router;
