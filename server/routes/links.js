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
      links: user.links || []
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
    const { title, url, description, backgroundColor, textColor } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        error: 'Title and URL are required'
      });
    }

    const newLink = {
      title: title.trim(),
      url: url.trim(),
      description: description?.trim() || '',
      backgroundColor: backgroundColor || '#3B82F6',
      textColor: textColor || '#FFFFFF',
      isActive: true,
      clicks: 0,
      order: 0
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { links: newLink } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const addedLink = user.links[user.links.length - 1];

    res.status(201).json({
      success: true,
      link: addedLink
    });
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add link'
    });
  }
});

// Update link
router.put('/:linkId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { linkId } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId, 'links._id': linkId },
      { $set: { 'links.$': { ...updateData, _id: linkId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }

    const updatedLink = user.links.find(link => link._id.toString() === linkId);

    res.json({
      success: true,
      link: updatedLink
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

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { links: { _id: linkId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

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

    // Reorder links based on provided order
    const reorderedLinks = linkIds.map((id, index) => {
      const link = user.links.find(l => l._id.toString() === id);
      if (link) {
        link.order = index;
        return link;
      }
      return null;
    }).filter(Boolean);

    user.links = reorderedLinks;
    await user.save();

    res.json({
      success: true,
      links: user.links
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
   