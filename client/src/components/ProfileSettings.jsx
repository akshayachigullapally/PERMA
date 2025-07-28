import { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { X, User, Link2, Palette, Globe, Save, Camera, Upload } from 'lucide-react';

const ProfileSettings = ({ userProfile, onClose, onUpdate }) => {
  const { user } = useUser();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    theme: userProfile?.theme || 'dark',
    isPublic: userProfile?.isPublic !== false,
    profileImage: userProfile?.profileImage || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('http://localhost:5000/api/users/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, profileImage: data.profileImage }));
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'light':
        root.classList.remove('dark');
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-primary', '#1f2937');
        root.style.setProperty('--text-secondary', '#6b7280');
        break;
      case 'dark':
        root.classList.add('dark');
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#1f2937');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#d1d5db');
        break;
      case 'auto': {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.style.setProperty('--bg-primary', '#111827');
          root.style.setProperty('--bg-secondary', '#1f2937');
          root.style.setProperty('--text-primary', '#ffffff');
          root.style.setProperty('--text-secondary', '#d1d5db');
        } else {
          root.classList.remove('dark');
          root.style.setProperty('--bg-primary', '#ffffff');
          root.style.setProperty('--bg-secondary', '#f8fafc');
          root.style.setProperty('--text-primary', '#1f2937');
          root.style.setProperty('--text-secondary', '#6b7280');
        }
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Apply the theme immediately
        applyTheme(formData.theme);
        onUpdate(data.user);
        onClose();
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Profile Picture */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-400">
                    Upload a photo to personalize your profile. Max size: 5MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Link2 className="w-4 h-4 inline mr-2" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  perma.in/
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-20 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all"
                  placeholder="yourname"
                  required
                  pattern="^[a-zA-Z0-9_-]+$"
                  title="Username can only contain letters, numbers, hyphens, and underscores"
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none placeholder-gray-400 transition-all"
                placeholder="Tell people about yourself..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Preferences</h3>
            
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                <Palette className="w-4 h-4 inline mr-2" />
                Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: '☀️', description: 'Clean and bright' },
                  { value: 'dark', label: 'Dark', icon: '🌙', description: 'Easy on the eyes' },
                  { value: 'auto', label: 'Auto', icon: '🔄', description: 'Follows system' }
                ].map((theme) => (
                  <label
                    key={theme.value}
                    className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.theme === theme.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={formData.theme === theme.value}
                      onChange={(e) => {
                        setFormData({ ...formData, theme: e.target.value });
                        applyTheme(e.target.value);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{theme.icon}</span>
                      <span className="font-medium text-white">{theme.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{theme.description}</span>
                    {formData.theme === theme.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white font-medium mb-1">
                    <Globe className="w-4 h-4" />
                    Public Profile
                  </div>
                  <p className="text-sm text-gray-400">
                    Allow others to view your profile and links. When disabled, only you can see your profile.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
