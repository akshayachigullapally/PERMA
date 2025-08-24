import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get platform statistics
router.get('/platform-stats', async (req, res) => {
  try {
    // Calculate basic platform stats
    const totalUsers = await User.countDocuments();
    const totalViews = await User.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$analytics.totalViews' },
          totalClicks: { $sum: '$analytics.totalClicks' }
        }
      }
    ]);

    const stats = {
      totalUsers,
      totalViews: totalViews[0]?.totalViews || 0,
      totalClicks: totalViews[0]?.totalClicks || 0,
      avgLinksPerUser: 5,
      monthlyGrowth: 15,
      proConversionRate: 3
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platform statistics'
    });
  }
});

// Get user analytics
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('analytics links');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate additional stats
    const totalLinks = user.links?.length || 0;
    const activeLinks = user.links?.filter(link => link.isActive).length || 0;
    const totalClicks = user.links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
    const totalViews = user.analytics?.totalViews || 0;
    const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

    // Get top performing links
    const topLinks = user.links
      ?.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map(link => ({
        id: link._id,
        title: link.title,
        clicks: link.clicks || 0,
        url: link.url
      })) || [];

    const analytics = {
      totalViews,
      totalClicks,
      totalLinks,
      activeLinks,
      clickThroughRate,
      monthlyViews: user.analytics?.monthlyViews || 0,
      monthlyClicks: user.analytics?.monthlyClicks || 0,
      topLinks
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
});

// Get link performance over time (for charts)
router.get('/link-performance/:linkId', authenticateToken, async (req, res) => {
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
    
    const link = user.links.id(linkId);
    
    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }
    
    res.json({
      success: true,
      performance: {
        linkId: link._id,
        title: link.title,
        totalClicks: link.clicks || 0,
        isActive: link.isActive,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching link performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch link performance'
    });
  }
});

export default router;
  