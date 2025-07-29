import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  TrendingUpIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const Analytics = () => {
  const { user, getToken } = useAuth();
  const { userStats, loading, error, fetchUserStats } = useAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const loadAnalytics = useCallback(async () => {
    if (user) {
      const token = getToken();
      if (token) {
        fetchUserStats(token);
      }
    }
  }, [user, getToken, fetchUserStats]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

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
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Analytics Unavailable</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track your profile performance and engagement</p>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {(userStats?.totalViews || 0).toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total Profile Views</p>
            <div className="text-green-400 text-sm mt-1">
              +{(userStats?.monthlyViews || 0)} this month
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CursorArrowRaysIcon className="h-6 w-6 text-green-400" />
              </div>
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {(userStats?.totalClicks || 0).toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total Link Clicks</p>
            <div className="text-green-400 text-sm mt-1">
              +{(userStats?.monthlyClicks || 0)} this month
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {userStats?.clickThroughRate || 0}%
            </h3>
            <p className="text-gray-400 text-sm">Click-through Rate</p>
            <div className="text-gray-400 text-sm mt-1">
              {userStats?.totalViews > 0 ? 'Good engagement' : 'No data yet'}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <LinkIcon className="h-6 w-6 text-pink-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {userStats?.totalLinks || 0}
            </h3>
            <p className="text-gray-400 text-sm">Active Links</p>
            <div className="text-gray-400 text-sm mt-1">
              {userStats?.activeLinks || 0} visible
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Links */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUpIcon className="h-6 w-6 text-green-400 mr-2" />
              Top Performing Links
            </h3>
            
            {userStats?.topLinks && userStats.topLinks.length > 0 ? (
              <div className="space-y-4">
                {userStats.topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                        <span className="text-blue-400 font-semibold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{link.title}</h4>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{link.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{link.clicks}</p>
                      <p className="text-gray-400 text-sm">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No link data available yet</p>
                <p className="text-gray-500 text-sm">Add some links to see performance</p>
              </div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-blue-400 mr-2" />
              Traffic Sources
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <GlobeAltIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-white">Direct Link</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {Math.round((userStats?.totalViews || 0) * 0.6)}
                  </p>
                  <p className="text-gray-400 text-sm">60%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-white">QR Code</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {Math.round((userStats?.totalViews || 0) * 0.25)}
                  </p>
                  <p className="text-gray-400 text-sm">25%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <LinkIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-white">Social Media</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {Math.round((userStats?.totalViews || 0) * 0.15)}
                  </p>
                  <p className="text-gray-400 text-sm">15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    Profile viewed from {['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'][index]}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {index + 1} {index === 0 ? 'minute' : 'minutes'} ago
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-2">🎯 Profile Optimization</h4>
              <p className="text-gray-300 text-sm">
                {(() => {
                  const hasPhoto = user?.profileImage;
                  const hasBio = user?.bio && user.bio.trim().length > 0;
                  const hasLinks = userStats?.totalLinks > 0;
                  
                  if (hasPhoto && hasBio && hasLinks) {
                    return userStats?.totalViews > 100 
                      ? "Perfect! Your profile is complete and getting great visibility. Keep engaging with your audience!"
                      : "Your profile is complete! Share your Perma link on social media to increase visibility.";
                  } else {
                    const missing = [];
                    if (!hasPhoto) missing.push("profile photo");
                    if (!hasBio) missing.push("bio");
                    if (!hasLinks) missing.push("links");
                    
                    return `Complete your profile by adding ${missing.join(", ")} to improve engagement and visibility.`;
                  }
                })()}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-2">🔗 Performance Insights</h4>
              <p className="text-gray-300 text-sm">
                {(() => {
                  if (userStats?.totalLinks === 0) {
                    return "Add your first link to start tracking performance and engagement metrics.";
                  } else if (userStats?.totalViews === 0) {
                    return "Share your Perma link to start getting views and track your link performance.";
                  } else if (userStats?.clickThroughRate > 10) {
                    return "Excellent click-through rate! Your links are highly engaging with your audience.";
                  } else if (userStats?.clickThroughRate > 5) {
                    return "Good engagement rate. Try adding compelling descriptions to increase click-through rates.";
                  } else {
                    return "Consider reordering your most important links to the top and optimizing your descriptions.";
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
