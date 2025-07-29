import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Link2, User } from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/public/${username}`);
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
        } else {
          setError('Profile not found');
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleLinkClick = async (linkId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/links/${linkId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Click tracked successfully for link:', linkId);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Profile Not Found</div>
          <p className="text-gray-400">The profile you're looking for doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  const activeLinks = profile.links.filter(link => link.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link2 className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Perma</span>
            </div>
            <a 
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create your own
            </a>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          {/* Profile Image or Initials */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>

          {/* Name and Bio */}
          <h1 className="text-2xl font-bold mb-2">{profile.displayName}</h1>
          {profile.bio && (
            <p className="text-gray-400 mb-4 leading-relaxed">{profile.bio}</p>
          )}
          <p className="text-sm text-blue-400">@{profile.username}</p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {activeLinks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No links available</p>
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link._id)}
                className="block w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm text-gray-400 mt-1">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors ml-3" />
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400">Powered by Perma</span>
          </div>
          <a 
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            Create your own link-in-bio
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
