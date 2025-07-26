import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  UserIcon,
  EnvelopeIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const EnhancedProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    displayName: '',
    bio: '',
    email: '',
    profileImage: '',
    theme: 'dark',
    isPublic: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await user?.getToken();
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            username: data.user.username || '',
            displayName: data.user.displayName || '',
            bio: data.user.bio || '',
            email: data.user.email || '',
            profileImage: data.user.profileImage || '',
            theme: data.user.theme || 'dark',
            isPublic: data.user.isPublic !== false
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (newUsername) => {
    const cleanUsername = newUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setProfile({ ...profile, username: cleanUsername });
    
    // Debounce username check
    setTimeout(() => {
      if (cleanUsername !== profile.username) return; // User kept typing
      checkUsernameAvailability(cleanUsername);
    }, 500);
  };

  const handleSave = async () => {
    if (!profile.username || !profile.displayName) {
      toast.error('Username and display name are required');
      return;
    }

    if (profile.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setSaving(true);
    try {
      const token = await user?.getToken();
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your public profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-4">Profile Preview</h2>
              
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <CameraIcon className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {profile.displayName || 'Your Name'}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {profile.bio || 'Add a bio to tell people about yourself'}
                </p>
                <p className="text-blue-400 text-sm font-mono">
                  perma.in/{profile.username || 'username'}
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  {profile.isPublic ? (
                    <>
                      <EyeIcon className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Public Profile</span>
                    </>
                  ) : (
                    <>
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Private Profile</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-gray-400 rounded-lg focus:outline-none cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                        usernameAvailable === true 
                          ? 'border-green-500 focus:ring-green-500' 
                          : usernameAvailable === false 
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:ring-blue-500'
                      } text-white`}
                      placeholder="yourusername"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {checkingUsername ? (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : usernameAvailable === true ? (
                        <CheckIcon className="w-5 h-5 text-green-400" />
                      ) : usernameAvailable === false ? (
                        <XMarkIcon className="w-5 h-5 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-400 mt-1">Username is already taken</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This will be your public URL: perma.in/{profile.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Display Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Tell people about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Privacy Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Public Profile</h3>
                    <p className="text-gray-400 text-sm">Allow others to find and view your profile</p>
                  </div>
                  <button
                    onClick={() => setProfile({ ...profile, isPublic: !profile.isPublic })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.isPublic ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={profile.theme}
                  onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || usernameAvailable === false}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileSettings;
