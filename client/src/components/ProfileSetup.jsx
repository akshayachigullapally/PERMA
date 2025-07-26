import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { User, Link2 } from 'lucide-react';

const ProfileSetup = ({ onComplete }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    displayName: user?.fullName || '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        onComplete(data.user);
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link2 className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">Perma</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Perma!</h1>
          <p className="text-gray-400">Let's set up your profile to get started</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
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
                  className="w-full pl-20 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="yourname"
                  required
                  pattern="^[a-zA-Z0-9_-]+$"
                  title="Username can only contain letters, numbers, hyphens, and underscores"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This will be your unique Perma URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                This is how your name will appear on your profile
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell people about yourself..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            You can always change these settings later in your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
