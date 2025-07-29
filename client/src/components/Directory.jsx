import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  LinkIcon,
  FireIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Directory = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, most_clicks
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProfiles: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchPublicProfiles = async (page = 1, search = '', sort = 'recent') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.directory.getProfiles({
        page,
        limit: 20,
        search,
        sort
      });

      if (response.success) {
        setProfiles(response.profiles);
        setFilteredProfiles(response.profiles);
        setPagination(response.pagination);
      } else {
        throw new Error(response.error || 'Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError(error.message);
      setProfiles([]);
      setFilteredProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProfiles(1, '', 'recent');
  }, []);

  // Handle search and sort changes with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchPublicProfiles(1, searchTerm, sortBy);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    // This effect is now handled by the API call, so we can remove the local filtering
    setFilteredProfiles(profiles);
  }, [profiles]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Error loading directory</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchPublicProfiles(1, searchTerm, sortBy)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
            <UserGroupIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-2 sm:mr-3" />
            Community Directory
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover amazing people and their curated links
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-start">
            <span className="text-gray-400 text-xs sm:text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="most_clicks">Most Clicks</option>
            </select>
          </div>
        </div>

        {/* Stats Bar - Only show when there are profiles */}
        {filteredProfiles && filteredProfiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-2 sm:mr-3">
                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{pagination.totalProfiles || filteredProfiles.length}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Profiles</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg mr-2 sm:mr-3">
                <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {filteredProfiles.reduce((sum, p) => sum + (p.totalViews || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Views</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg mr-2 sm:mr-3">
                <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {filteredProfiles.reduce((sum, p) => sum + (p.linkCount || 0), 0)}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Links</p>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredProfiles && filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProfiles.map((profile) => (
              <Link
                key={profile.username}
                to={`/${profile.username}`}
                className="group"
              >
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt={profile.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm sm:text-base">
                            {profile.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        )}
                      </div>
                      {profile.isVerified && (
                        <div className="ml-2 p-1 bg-blue-500/20 rounded-full">
                          <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{formatDate(profile.createdAt)}</span>
                        <span className="sm:hidden">{formatDate(profile.createdAt).split(',')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                      {profile.displayName || profile.username}
                    </h3>
                    <p className="text-blue-400 text-xs sm:text-sm font-mono mb-2 truncate">
                      @{profile.username}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                      {profile.bio || 'No bio available'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {(profile.totalViews || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">Views</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <FireIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {(profile.totalClicks || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">Clicks</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-sm">
                        {profile.linkCount || 0}
                      </p>
                      <p className="text-gray-400 text-xs">Links</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <UserGroupIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              {searchTerm ? 'No profiles found' : 'No public profiles yet'}
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              {searchTerm 
                ? 'Try adjusting your search terms or explore different categories'
                : 'Be the first to create a public profile and join our community!'
              }
            </p>
            {!searchTerm && user && (
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Make Your Profile Public
              </Link>
            )}
          </div>
        )}

        {/* Call to Action */}
        {user && (
          <div className="mt-12 text-center bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Want to be featured in the directory?
            </h2>
            <p className="text-gray-300 mb-6">
              Make sure your profile is public and start sharing your Perma link!
            </p>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Update Profile Settings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
