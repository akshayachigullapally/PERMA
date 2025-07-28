import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophyIconSolid,
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    earnedCount: 0,
    totalAchievements: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);

        // First check for new achievements
        await api.achievements.checkAchievements();

        // Then fetch all achievements
        const response = await api.achievements.getAchievements();

        if (response.success) {
          setAchievements(response.achievements);
          setStats(response.stats);
        } else {
          throw new Error(response.error || 'Failed to fetch achievements');
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const retryFetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // First check for new achievements
      await api.achievements.checkAchievements();

      // Then fetch all achievements
      const response = await api.achievements.getAchievements();

      if (response.success) {
        setAchievements(response.achievements);
        setStats(response.stats);
      } else {
        throw new Error(response.error || 'Failed to fetch achievements');
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400 border-gray-400',
      uncommon: 'text-green-400 border-green-400',
      rare: 'text-blue-400 border-blue-400',
      epic: 'text-purple-400 border-purple-400',
      legendary: 'text-yellow-400 border-yellow-400'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBg = (rarity) => {
    const colors = {
      common: 'bg-gray-500/20',
      uncommon: 'bg-green-500/20',
      rare: 'bg-blue-500/20',
      epic: 'bg-purple-500/20',
      legendary: 'bg-yellow-500/20'
    };
    return colors[rarity] || colors.common;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      basics: LinkIcon,
      content: SparklesIcon,
      engagement: HandThumbUpIcon,
      performance: ChartBarIcon,
      profile: UserGroupIcon,
      special: TrophyIcon
    };
    return icons[category] || TrophyIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Unable to load achievements</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(achievements.map(a => a.category))];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
            <TrophyIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mr-2 sm:mr-3" />
            Achievements
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track your progress and unlock rewards
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrophyIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {stats.earnedCount}
            </h3>
            <p className="text-gray-400 text-sm">Achievements Earned</p>
            <div className="text-green-400 text-sm mt-1">
              {stats.earnedCount}/{stats.totalAchievements} completed
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <StarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {stats.totalPoints.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Achievement Points</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {stats.completionRate}%
            </h3>
            <p className="text-gray-400 text-sm">Completion Rate</p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map(category => {
              const CategoryIcon = getCategoryIcon(category);
              const categoryAchievements = achievements.filter(a => a.category === category);
              const earnedInCategory = categoryAchievements.filter(a => a.earned).length;
              
              return (
                <div key={category} className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                  <CategoryIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium text-sm sm:text-base capitalize mb-1">
                    {category}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {earnedInCategory}/{categoryAchievements.length}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement) => {
            // Map backend icon names to actual icon components
            const IconComponent = achievement.earned ? TrophyIconSolid : TrophyIcon;
            
            return (
              <div
                key={achievement.id}
                className={`bg-gray-800 rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 ${
                  achievement.earned
                    ? `${getRarityColor(achievement.rarity)} ${getRarityBg(achievement.rarity)} hover:scale-105`
                    : 'border-gray-700 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${achievement.earned ? getRarityBg(achievement.rarity) : 'bg-gray-700'}`}>
                    <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${
                      achievement.earned ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      achievement.earned ? getRarityBg(achievement.rarity) : 'bg-gray-700'
                    } ${achievement.earned ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-gray-400'}`}>
                      {achievement.rarity}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {achievement.points} pts
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className={`text-base sm:text-lg font-semibold mb-1 ${
                    achievement.earned ? 'text-white' : 'text-gray-300'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {achievement.description}
                  </p>
                </div>

                {achievement.earned ? (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getRarityColor(achievement.rarity).split(' ')[0]}`}>
                      ✓ Completed
                    </span>
                    {achievement.earnedAt && (
                      <span className="text-gray-400 text-xs">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(achievement.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-8 sm:mt-12 text-center bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-xl p-6 sm:p-8">
          <TrophyIcon className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Keep Building Your Legacy!
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Every link you create, every view you generate, and every click you earn 
            brings you closer to unlocking new achievements. Keep growing your presence!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add New Link
            </button>
            <button 
              onClick={() => window.location.href = '/settings'}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
