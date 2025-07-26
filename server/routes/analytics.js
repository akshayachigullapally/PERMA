import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get overall platform stats (for homepage)
router.get('/platform-stats', async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total links across all users
    const totalLinksResult = await User.aggregate([
      { $unwind: '$links' },
      { $count: 'totalLinks' }
    ]);
    const totalLinks = totalLinksResult[0]?.totalLinks || 0;
    
    // Get total clicks across all users
    const totalClicksResult = await User.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$analytics.totalClicks' } } }
    ]);
    const totalClicks = totalClicksResult[0]?.totalClicks || 0;
    
    // Get total views across all users
    const totalViewsResult = await User.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$analytics.totalViews' } } }
    ]);
    const totalViews = totalViewsResult[0]?.totalViews || 0;
    
    // Calculate average links per user
    const avgLinksPerUser = totalUsers > 0 ? Math.round(totalLinks / totalUsers) : 0;
    
    // Calculate click-through rate (clicks per view)
    const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;
    
    // Get monthly growth (users created in last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousUsers = await User.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    
    const monthlyGrowth = previousUsers > 0 
      ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100)
      : recentUsers > 0 ? 100 : 0;
    
    // Get pro conversion rate (users with pro subscription)
    const proUsers = await User.countDocuments({ 'subscription.type': 'pro' });
    const proConversionRate = totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0;
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalLinks,
        totalClicks,
        totalViews,
        avgLinksPerUser,
        clickThroughRate,
        monthlyGrowth,
        proConversionRate
      }
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platform statistics'
    });
  }
});

// Get user analytics (for authenticated users)
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
    
    // Calculate additional metrics
    const totalLinks = user.links.length;
    const activeLinks = user.links.filter(link => link.isActive).length;
    const totalLinkClicks = user.links.reduce((sum, link) => sum + link.clicks, 0);
    
    // Calculate top performing links
    const topLinks = user.links
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(link => ({
        id: link._id,
        title: link.title,
        clicks: link.clicks,
        url: link.url
      }));
    
    // Get click-through rate for this user
    const userClickThroughRate = user.analytics.totalViews > 0 
      ? Math.round((user.analytics.totalClicks / user.analytics.totalViews) * 100)
      : 0;
    
    res.json({
      success: true,
      analytics: {
        ...user.analytics,
        totalLinks,
        activeLinks,
        totalLinkClicks,
        clickThroughRate: userClickThroughRate,
        topLinks
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics'
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
    
    // For now, return basic link stats
    // In a more advanced implementation, you'd store click timestamps
    res.json({
      success: true,
      performance: {
        linkId: link._id,
        title: link.title,
        totalClicks: link.clicks,
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
