import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Achievement definitions - these would typically be in a separate config file or database
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_link',
    title: 'Getting Started',
    description: 'Add your first link',
    category: 'basics',
    points: 10,
    requirement: { type: 'links_created', value: 1 },
    rarity: 'common'
  },
  {
    id: 'link_master',
    title: 'Link Master',
    description: 'Create 10 links',
    category: 'content',
    points: 50,
    requirement: { type: 'links_created', value: 10 },
    rarity: 'uncommon'
  },
  {
    id: 'first_hundred_views',
    title: 'First Impression',
    description: 'Reach 100 profile views',
    category: 'engagement',
    points: 25,
    requirement: { type: 'total_views', value: 100 },
    rarity: 'common'
  },
  {
    id: 'thousand_views',
    title: 'Popular Profile',
    description: 'Reach 1,000 profile views',
    category: 'engagement',
    points: 100,
    requirement: { type: 'total_views', value: 1000 },
    rarity: 'rare'
  },
  {
    id: 'first_hundred_clicks',
    title: 'Click Magnet',
    description: 'Get 100 total clicks',
    category: 'engagement',
    points: 50,
    requirement: { type: 'total_clicks', value: 100 },
    rarity: 'uncommon'
  },
  {
    id: 'thousand_clicks',
    title: 'Traffic Driver',
    description: 'Reach 1,000 total clicks',
    category: 'engagement',
    points: 150,
    requirement: { type: 'total_clicks', value: 1000 },
    rarity: 'rare'
  },
  {
    id: 'week_streak',
    title: 'Consistent Creator',
    description: 'Active for 7 consecutive days',
    category: 'engagement',
    points: 30,
    requirement: { type: 'streak_days', value: 7 },
    rarity: 'uncommon'
  },
  {
    id: 'month_streak',
    title: 'Dedication Master',
    description: 'Active for 30 consecutive days',
    category: 'engagement',
    points: 200,
    requirement: { type: 'streak_days', value: 30 },
    rarity: 'epic'
  },
  {
    id: 'high_ctr',
    title: 'Engagement Expert',
    description: 'Achieve 20% click-through rate',
    category: 'performance',
    points: 75,
    requirement: { type: 'click_through_rate', value: 20 },
    rarity: 'rare'
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Add links to 5 different platforms',
    category: 'content',
    points: 40,
    requirement: { type: 'platform_diversity', value: 5 },
    rarity: 'uncommon'
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Join Perma in the first month',
    category: 'special',
    points: 100,
    requirement: { type: 'early_adopter', value: 1 },
    rarity: 'legendary'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete your profile 100%',
    category: 'profile',
    points: 25,
    requirement: { type: 'profile_completion', value: 100 },
    rarity: 'common'
  }
];

// Helper function to check if an achievement requirement is met
const checkAchievementRequirement = (requirement, userStats, user) => {
  const linkCount = user.links?.length || 0;
  const totalViews = userStats.totalViews || 0;
  const totalClicks = userStats.totalClicks || 0;
  const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;
  
  switch (requirement.type) {
    case 'links_created':
      return linkCount >= requirement.value;
    case 'total_views':
      return totalViews >= requirement.value;
    case 'total_clicks':
      return totalClicks >= requirement.value;
    case 'click_through_rate':
      return clickThroughRate >= requirement.value;
    case 'streak_days':
      return (user.streakDays || 0) >= requirement.value;
    case 'platform_diversity':
      // Count unique platform types based on URL patterns
      const platforms = new Set();
      user.links?.forEach(link => {
        const url = link.url.toLowerCase();
        if (url.includes('github.com')) platforms.add('github');
        else if (url.includes('linkedin.com')) platforms.add('linkedin');
        else if (url.includes('twitter.com') || url.includes('x.com')) platforms.add('twitter');
        else if (url.includes('instagram.com')) platforms.add('instagram');
        else if (url.includes('youtube.com')) platforms.add('youtube');
        else if (url.includes('tiktok.com')) platforms.add('tiktok');
        else if (url.includes('facebook.com')) platforms.add('facebook');
        else platforms.add('other');
      });
      return platforms.size >= requirement.value;
    case 'early_adopter':
      // Check if user created account within first month of platform launch
      const platformLaunchDate = new Date('2024-01-01'); // Adjust this date
      const firstMonth = new Date(platformLaunchDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      return user.createdAt <= firstMonth;
    case 'profile_completion':
      // Calculate profile completion percentage
      let completionScore = 0;
      if (user.displayName) completionScore += 25;
      if (user.bio) completionScore += 25;
      if (user.profileImage) completionScore += 25;
      if (user.links && user.links.length > 0) completionScore += 25;
      return completionScore >= requirement.value;
    default:
      return false;
  }
};

// Helper function to calculate progress for unearned achievements
const calculateProgress = (requirement, userStats, user) => {
  const linkCount = user.links?.length || 0;
  const totalViews = userStats.totalViews || 0;
  const totalClicks = userStats.totalClicks || 0;
  const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;
  
  switch (requirement.type) {
    case 'links_created':
      return Math.min((linkCount / requirement.value) * 100, 100);
    case 'total_views':
      return Math.min((totalViews / requirement.value) * 100, 100);
    case 'total_clicks':
      return Math.min((totalClicks / requirement.value) * 100, 100);
    case 'click_through_rate':
      return Math.min((clickThroughRate / requirement.value) * 100, 100);
    case 'streak_days':
      return Math.min(((user.streakDays || 0) / requirement.value) * 100, 100);
    case 'platform_diversity':
      const platforms = new Set();
      user.links?.forEach(link => {
        const url = link.url.toLowerCase();
        if (url.includes('github.com')) platforms.add('github');
        else if (url.includes('linkedin.com')) platforms.add('linkedin');
        else if (url.includes('twitter.com') || url.includes('x.com')) platforms.add('twitter');
        else if (url.includes('instagram.com')) platforms.add('instagram');
        else if (url.includes('youtube.com')) platforms.add('youtube');
        else if (url.includes('tiktok.com')) platforms.add('tiktok');
        else if (url.includes('facebook.com')) platforms.add('facebook');
        else platforms.add('other');
      });
      return Math.min((platforms.size / requirement.value) * 100, 100);
    case 'profile_completion':
      let completionScore = 0;
      if (user.displayName) completionScore += 25;
      if (user.bio) completionScore += 25;
      if (user.profileImage) completionScore += 25;
      if (user.links && user.links.length > 0) completionScore += 25;
      return completionScore;
    default:
      return 0;
  }
};

// Get user achievements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's earned achievements
    const earnedAchievementIds = user.achievements?.map(a => a.achievementId) || [];
    
    // Process all achievements
    const achievements = ACHIEVEMENT_DEFINITIONS.map(definition => {
      const isEarned = earnedAchievementIds.includes(definition.id);
      const earnedData = user.achievements?.find(a => a.achievementId === definition.id);
      
      return {
        ...definition,
        earned: isEarned,
        earnedAt: earnedData?.earnedAt || null,
        progress: isEarned ? 100 : calculateProgress(definition.requirement, user.analytics, user)
      };
    });

    // Sort: earned first, then by rarity and points
    achievements.sort((a, b) => {
      if (a.earned !== b.earned) return b.earned - a.earned;
      
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      
      return b.points - a.points;
    });

    const totalPoints = user.achievementPoints || 0;
    const earnedCount = earnedAchievementIds.length;

    res.json({
      success: true,
      achievements,
      stats: {
        totalPoints,
        earnedCount,
        totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
        completionRate: Math.round((earnedCount / ACHIEVEMENT_DEFINITIONS.length) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements'
    });
  }
});

// Check and award new achievements
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const earnedAchievementIds = user.achievements?.map(a => a.achievementId) || [];
    const newAchievements = [];
    let totalNewPoints = 0;

    // Check each achievement
    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      if (!earnedAchievementIds.includes(definition.id)) {
        const isEarned = checkAchievementRequirement(definition.requirement, user.analytics, user);
        
        if (isEarned) {
          newAchievements.push({
            achievementId: definition.id,
            earnedAt: new Date()
          });
          totalNewPoints += definition.points;
        }
      }
    }

    // Update user with new achievements
    if (newAchievements.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $push: { achievements: { $each: newAchievements } },
        $inc: { achievementPoints: totalNewPoints }
      });
    }

    res.json({
      success: true,
      newAchievements: newAchievements.map(a => {
        const definition = ACHIEVEMENT_DEFINITIONS.find(d => d.id === a.achievementId);
        return {
          ...definition,
          earnedAt: a.earnedAt
        };
      }),
      pointsEarned: totalNewPoints
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check achievements'
    });
  }
});

// Update user streak (called when user is active)
router.post('/update-streak', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    
    // Check if user was active yesterday
    let newStreakDays = user.streakDays || 0;
    
    if (lastActive) {
      const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change
        return res.json({
          success: true,
          streakDays: newStreakDays
        });
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreakDays += 1;
      } else {
        // Streak broken, reset to 1
        newStreakDays = 1;
      }
    } else {
      // First day
      newStreakDays = 1;
    }

    await User.findByIdAndUpdate(userId, {
      streakDays: newStreakDays,
      lastActiveDate: today
    });

    res.json({
      success: true,
      streakDays: newStreakDays
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update streak'
    });
  }
});

export default router;
