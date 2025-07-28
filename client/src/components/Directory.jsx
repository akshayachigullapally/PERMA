import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
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

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        // Since we don't have a public directory endpoint, let's create some mock data
        // In a real implementation, you'd have an endpoint like /api/directory
        setProfiles([
          {
            username: 'sarah_dev',
            displayName: 'Sarah Johnson',
            bio: 'Full-stack developer passionate about React and Node.js',
            profileImage: null,
            totalViews: 1250,
            totalClicks: 892,
            linkCount: 8,
            createdAt: '2024-01-15',
            isVerified: true
          },
          {
            username: 'mike_designer',
            displayName: 'Mike Chen',
            bio: 'UI/UX Designer creating beautiful digital experiences',
            profileImage: null,
            totalViews: 2100,
            totalClicks: 1456,
            linkCount: 12,
            createdAt: '2024-02-01',
            isVerified: false
          },
          {
            username: 'alex_creator',
            displayName: 'Alex Rivera',
            bio: 'Content creator, photographer, and digital nomad',
            profileImage: null,
            totalViews: 3200,
            totalClicks: 2100,
            linkCount: 15,
            createdAt: '2024-01-20',
            isVerified: true
          },
          {
            username: 'lisa_startup',
            displayName: 'Lisa Park',
            bio: 'Startup founder & entrepreneur in the fintech space',
            profileImage: null,
            totalViews: 1800,
            totalClicks: 1200,
            linkCount: 10,
            createdAt: '2024-02-10',
            isVerified: true
          },
          {
            username: 'dev_carlos',
            displayName: 'Carlos Martinez',
            bio: 'Software engineer at a Fortune 500 company',
            profileImage: null,
            totalViews: 950,
            totalClicks: 675,
            linkCount: 6,
            createdAt: '2024-02-15',
            isVerified: false
          },
          {
            username: 'emily_writer',
            displayName: 'Emily Thompson',
            bio: 'Technical writer and blogger about web development',
            profileImage: null,
            totalViews: 1400,
            totalClicks: 980,
            linkCount: 9,
            createdAt: '2024-01-25',
            isVerified: false
          }
        ]);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles.filter(profile =>
      profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort profiles
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.totalViews - a.totalViews);
        break;
      case 'most_clicks':
        filtered.sort((a, b) => b.totalClicks - a.totalClicks);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, sortBy]);

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

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-2 sm:mr-3">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-white">{profiles.length}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Total Profiles</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center">
            <div className="p-2 bg-green-500/20 rounded-lg mr-2 sm:mr-3">
              <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-white">
                {profiles.reduce((sum, p) => sum + p.totalViews, 0).toLocaleString()}
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
                {profiles.reduce((sum, p) => sum + p.linkCount, 0)}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">Total Links</p>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
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
                      {profile.displayName}
                    </h3>
                    <p className="text-blue-400 text-xs sm:text-sm font-mono mb-2 truncate">
                      @{profile.username}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                      {profile.bio}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {profile.totalViews.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">Views</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <FireIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {profile.totalClicks.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">Clicks</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                      </div>
                      <p className="text-white font-semibold text-sm">
                        {profile.linkCount}
                      </p>
                      <p className="text-gray-400 text-xs">Links</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No profiles found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a public profile!'}
            </p>
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
