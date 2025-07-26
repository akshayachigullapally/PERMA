import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get user's links
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('links');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      links: user.links.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch links'
    });
  }
});

// Add new link
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, url, description } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        error: 'Title and URL are required'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const newLink = {
      title,
      url,
      description,
      order: user.links.length
    };
    
    user.links.push(newLink);
    await user.save();
    
    res.status(201).json({
      success: true,
      link: user.links[user.links.length - 1]
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create link'
    });
  }
});

// Update link
router.put('/:linkId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { linkId } = req.params;
    const { title, url, description, isActive } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const link = user.links.id(linkId);
    
    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }
    
    if (title) link.title = title;
    if (url) link.url = url;
    if (description !== undefined) link.description = description;
    if (isActive !== undefined) link.isActive = isActive;
    
    await user.save();
    
    res.json({
      success: true,
      link
    });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update link'
    });
  }
});

// Delete link
router.delete('/:linkId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { linkId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const linkIndex = user.links.findIndex(link => link._id.toString() === linkId);
    
    if (linkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }
    
    user.links.splice(linkIndex, 1);
    await user.save();
    
    res.json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete link'
    });
  }
});

// Reorder links
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { linkIds } = req.body;
    
    if (!Array.isArray(linkIds)) {
      return res.status(400).json({
        success: false,
        error: 'linkIds must be an array'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update order for each link
    linkIds.forEach((linkId, index) => {
      const link = user.links.id(linkId);
      if (link) {
        link.order = index;
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      links: user.links.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error reordering links:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder links'
    });
  }
});

// Track link click
router.post('/:linkId/click', async (req, res) => {
  try {
    const { linkId } = req.params;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const link = user.links.id(linkId);
    
    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }
    
    // Increment click counts
    link.clicks += 1;
    user.analytics.totalClicks += 1;
    user.analytics.monthlyClicks += 1;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track click'
    });
  }
});

export default router;
