import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, displayName, bio, profileImage, theme, isPublic } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          displayName,
          bio,
          profileImage,
          theme,
          isPublic
        }
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

// Get public user profile by username
router.get('/public/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({
      username: username.toLowerCase(),
      isPublic: true
    }).select('-password -createdAt -updatedAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Increment view count
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'analytics.totalViews': 1,
        'analytics.monthlyViews': 1
      }
    });
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

export default router;
