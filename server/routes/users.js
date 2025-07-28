import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Check username availability
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }
    
    const existingUser = await User.findOne({ 
      username: username.toLowerCase() 
    });
    
    res.json({
      success: true,
      available: !existingUser
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check username availability'
    });
  }
});

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

// Upload profile picture
router.post('/profile/picture', authenticateToken, (req, res) => {
  const upload = req.app.locals.upload;
  
  upload.single('profileImage')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    try {
      const userId = req.user.userId;
      const profileImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: profileImageUrl },
        { new: true }
      ).select('-password');
      
      res.json({
        success: true,
        user,
        profileImage: profileImageUrl
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile picture'
      });
    }
  });
});

// Change password
router.put('/profile/password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
});

// Get directory of public profiles
router.get('/directory', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'recent', search = '' } = req.query;
    
    // Build search filter
    let searchFilter = { isPublic: true };
    if (search) {
      searchFilter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'popular':
        sortOptions = { 'analytics.totalViews': -1 };
        break;
      case 'most_clicks':
        sortOptions = { 'analytics.totalClicks': -1 };
        break;
      case 'recent':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(searchFilter)
      .select('username displayName bio profileImage analytics createdAt links')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Transform the data to include additional computed fields
    const profiles = users.map(user => ({
      username: user.username,
      displayName: user.displayName || user.username,
      bio: user.bio || '',
      profileImage: user.profileImage,
      totalViews: user.analytics?.totalViews || 0,
      totalClicks: user.analytics?.totalClicks || 0,
      linkCount: user.links?.length || 0,
      createdAt: user.createdAt,
      isVerified: false // You can implement verification logic later
    }));
    
    // Get total count for pagination
    const totalProfiles = await User.countDocuments(searchFilter);
    
    res.json({
      success: true,
      profiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProfiles / parseInt(limit)),
        totalProfiles,
        hasNextPage: skip + profiles.length < totalProfiles,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching directory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch directory'
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
