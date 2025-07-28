import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const AnalyticsPage = () => {
  const { user, getToken } = useAuth();
  const { userStats, loading, fetchUserStats } = useAnalytics();
  const [timeframe, setTimeframe] = useState('30d');

  const loadUserStats = useCallback(() => {
    if (user) {
      const token = getToken();
      if (token) {
        fetchUserStats(token);
      }
    }
  }, [user, getToken, fetchUserStats]);

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const StatCard = ({ title, value, change, icon, trend }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-1 truncate">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-xs sm:text-sm ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {trend === 'up' && <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
              {trend === 'down' && <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
              <span className="truncate">{change}% vs last month</span>
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg ml-2">
          {icon && React.createElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-400" })}
        </div>
      </div>
    </div>
  );

  const LinkPerformanceCard = ({ link, rank }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold text-xs sm:text-sm">#{rank}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium text-sm sm:text-base truncate">{link.title}</h4>
            <p className="text-gray-400 text-xs sm:text-sm truncate">{link.url}</p>
          </div>
        </div>
        <div className="text-right ml-2 flex-shrink-0">
          <p className="text-white font-bold text-sm sm:text-base">{link.clicks}</p>
          <p className="text-gray-400 text-xs">clicks</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track your link performance and audience engagement</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: '1y', label: '1 Year' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeframe(value)}
                className={`px-3 py-2 sm:px-4 text-sm font-medium rounded-lg transition-all ${
                  timeframe === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Views"
            value={userStats?.totalViews?.toLocaleString() || '0'}
            change={userStats?.viewsGrowth}
            trend={userStats?.viewsGrowth > 0 ? 'up' : userStats?.viewsGrowth < 0 ? 'down' : 'neutral'}
            icon={EyeIcon}
          />
          <StatCard
            title="Total Clicks"
            value={userStats?.totalClicks?.toLocaleString() || '0'}
            change={userStats?.clicksGrowth}
            trend={userStats?.clicksGrowth > 0 ? 'up' : userStats?.clicksGrowth < 0 ? 'down' : 'neutral'}
            icon={CursorArrowRaysIcon}
          />
          <StatCard
            title="Active Links"
            value={userStats?.activeLinks || '0'}
            icon={LinkIcon}
          />
          <StatCard
            title="Click Rate"
            value={`${userStats?.clickThroughRate || 0}%`}
            change={userStats?.ctrGrowth}
            trend={userStats?.ctrGrowth > 0 ? 'up' : userStats?.ctrGrowth < 0 ? 'down' : 'neutral'}
            icon={ChartBarIcon}
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Top Performing Links */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Top Performing Links</h3>
            <div className="space-y-3 sm:space-y-4">
              {userStats?.topLinks?.length > 0 ? (
                userStats.topLinks.map((link, index) => (
                  <LinkPerformanceCard key={link._id} link={link} rank={index + 1} />
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No link data available yet</p>
                  <p className="text-sm">Start sharing your links to see analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {userStats?.recentActivity?.length > 0 ? (
                userStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm truncate">{activity.description}</p>
                      <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-6 sm:py-8">
                  <CalendarDaysIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">No recent activity</p>
                  <p className="text-xs sm:text-sm">Activity will appear as users interact with your links</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Best Performing Day */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Best Performing Day</h4>
              <p className="text-xl sm:text-2xl font-bold text-blue-400">{userStats?.bestDay || 'Monday'}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Average clicks: {userStats?.avgClicksOnBestDay || '0'}</p>
            </div>

            {/* Profile Completion */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Profile Completion</h4>
              <p className="text-xl sm:text-2xl font-bold text-green-400">{userStats?.profileCompletion || '75'}%</p>
              <p className="text-gray-400 text-xs sm:text-sm">Add bio and photo to improve engagement</p>
            </div>

            {/* Average Session */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Avg. Session Duration</h4>
              <p className="text-xl sm:text-2xl font-bold text-purple-400">{userStats?.avgSessionDuration || '2m 30s'}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Time visitors spend on your profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
