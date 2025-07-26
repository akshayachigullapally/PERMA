import { useState, useEffect, useCallback } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { 
  Link2, 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  ExternalLink, 
  BarChart3, 
  Settings,
  Copy,
  QrCode
} from 'lucide-react';
import ProfileSetup from './ProfileSetup';
import ProfileSettings from './ProfileSettings';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { user } = useUser();
  const { toasts, showToast, removeToast } = useToast();
  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });
  const [needsSetup, setNeedsSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        
        // Check if user needs to complete setup
        if (!data.user.username || !data.user.displayName) {
          setNeedsSetup(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [user]);

  const fetchLinks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/links', {
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchLinks();
    }
  }, [user, fetchUserProfile, fetchLinks]);

  const handleAddLink = async (e) => {
    e.preventDefault();
    
    if (!newLink.title || !newLink.url) {
      showToast('Title and URL are required', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getToken()}`
        },
        body: JSON.stringify(newLink)
      });

      if (response.ok) {
        const data = await response.json();
        setLinks([...links, data.link]);
        setNewLink({ title: '', url: '', description: '' });
        setShowAddLink(false);
        showToast('Link added successfully!', 'success');
      } else {
        showToast('Failed to add link', 'error');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      showToast('Failed to add link', 'error');
    }
  };

  const handleUpdateLink = async (linkId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getToken()}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(links.map(link => link._id === linkId ? data.link : link));
        setEditingLink(null);
        showToast('Link updated successfully!', 'success');
      } else {
        showToast('Failed to update link', 'error');
      }
    } catch (error) {
      console.error('Error updating link:', error);
      showToast('Failed to update link', 'error');
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`
        }
      });

      if (response.ok) {
        setLinks(links.filter(link => link._id !== linkId));
        showToast('Link deleted successfully!', 'success');
      } else {
        showToast('Failed to delete link', 'error');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      showToast('Failed to delete link', 'error');
    }
  };

  const copyProfileUrl = () => {
    const profileUrl = `https://perma.in/${userProfile?.username || 'yourname'}`;
    navigator.clipboard.writeText(profileUrl);
    showToast('Profile URL copied to clipboard!', 'success');
  };

  const handleProfileSetupComplete = (updatedUser) => {
    setUserProfile(updatedUser);
    setNeedsSetup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (needsSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link2 className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Perma Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Welcome, {user?.firstName}!</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Preview */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Your Perma Profile</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyProfileUrl}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <h3 className="text-xl font-semibold">{userProfile?.displayName || user?.fullName}</h3>
                  <p className="text-gray-400">{userProfile?.bio || 'Add a bio to tell people about yourself'}</p>
                  <p className="text-sm text-blue-400 mt-2">
                    perma.in/{userProfile?.username || 'set-username'}
                  </p>
                </div>
                
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No links added yet</p>
                    <button
                      onClick={() => setShowAddLink(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Your First Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {links.map((link) => (
                      <div key={link._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{link.title}</h4>
                            {link.description && (
                              <p className="text-sm text-gray-400">{link.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{link.clicks} clicks</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Links Management */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Links</h2>
                <button
                  onClick={() => setShowAddLink(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>

              {/* Add Link Form */}
              {showAddLink && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Link</h3>
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title *</label>
                      <input
                        type="text"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., My Portfolio"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL *</label>
                      <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={newLink.description}
                        onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Add Link
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddLink(false);
                          setNewLink({ title: '', url: '', description: '' });
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Link Form */}
              {editingLink && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Link</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateLink(editingLink._id, {
                      title: editingLink.title,
                      url: editingLink.url,
                      description: editingLink.description
                    });
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title *</label>
                      <input
                        type="text"
                        value={editingLink.title}
                        onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., My Portfolio"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL *</label>
                      <input
                        type="url"
                        value={editingLink.url}
                        onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={editingLink.description || ''}
                        onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Update Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLink(null)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Links List */}
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-500 cursor-move" />
                        <div>
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-gray-400">{link.url}</p>
                          {link.description && (
                            <p className="text-sm text-gray-400">{link.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{link.clicks} clicks</span>
                        <button
                          onClick={() => setEditingLink(link)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link._id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics Card */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Views</span>
                  <span className="font-semibold">{userProfile?.analytics?.totalViews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Clicks</span>
                  <span className="font-semibold">{userProfile?.analytics?.totalClicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This Month</span>
                  <span className="font-semibold">{userProfile?.analytics?.monthlyClicks || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  Customize Theme
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  Export Data
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showSettings && (
        <ProfileSettings
          userProfile={userProfile}
          onClose={() => setShowSettings(false)}
          onUpdate={(updatedUser) => {
            setUserProfile(updatedUser);
            setShowSettings(false);
          }}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
