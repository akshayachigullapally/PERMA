import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  PlusIcon, 
  LinkIcon, 
  EyeIcon, 
  ShareIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  UserIcon,
  GlobeAltIcon,
  CursorArrowRaysIcon,
  TrashIcon,
  PencilIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SortableLink from './SortableLink';
import AddLinkModal from './AddLinkModal';
import LoadingSpinner from './LoadingSpinner';
import QRCodeGenerator from './QRCodeGenerator';

const ComprehensiveDashboard = () => {
  const { user: authUser, getToken: authGetToken, loading: authLoading } = useAuth();
  const { userStats } = useAnalytics();
  
  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLinkForQR, setSelectedLinkForQR] = useState(null);
  const [error, setError] = useState(null);

  // Memoize getToken to prevent unnecessary re-renders
  const getToken = useCallback(() => {
    return authGetToken();
  }, [authGetToken]);

  // Debug logging (remove in production)
  // console.log('Dashboard render:', { authUser, authLoading, loading });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reusable function to fetch links
  const refreshLinks = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);
      } else {
        throw new Error('Failed to fetch links');
      }
    } catch (err) {
      console.error('Error fetching links:', err);
      setError('Failed to load links');
    }
  }, [getToken]);

  // Load data on component mount
  useEffect(() => {
    const fetchUserProfile = async (token) => {
      try {
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      }
    };

    const fetchLinksData = async (token) => {
      try {
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLinks(data.links || []);
        } else {
          throw new Error('Failed to fetch links');
        }
      } catch (err) {
        console.error('Error fetching links:', err);
        setError('Failed to load links');
      }
    };

    const fetchUserAnalytics = async (token) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/user-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Analytics data loaded successfully
          await response.json();
        } else {
          throw new Error('Failed to fetch user stats');
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };

    const loadData = async () => {
      // Wait for auth to finish loading first
      if (authLoading) {
        return;
      }
      
      if (!authUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        await Promise.all([
          fetchUserProfile(token),
          fetchLinksData(token),
          fetchUserAnalytics(token)
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authUser, authLoading, getToken]);

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex(link => link._id === active.id);
      const newIndex = links.findIndex(link => link._id === over.id);
      
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Update order on server
      try {
        const token = getToken();
        const linkIds = newLinks.map(link => link._id);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/links/reorder`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ linkIds })
        });

        if (!response.ok) {
          throw new Error('Failed to reorder links');
        }

        toast.success('Links reordered successfully');
      } catch (err) {
        console.error('Error reordering links:', err);
        toast.error('Failed to reorder links');
        // Revert the change
        refreshLinks();
      }
    }
  };

  // Add new link
  const handleAddLink = async (linkData) => {
    try {
      // Create a new link with a unique ID and default values
      const newLink = {
        ...linkData,
        id: Date.now().toString(),
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: true
      };

      // Add the link to local state
      setLinks(prev => [...prev, newLink]);
      setIsAddModalOpen(false);
      toast.success('Link added successfully');
      
      console.log('New link added:', newLink); // Debug log
    } catch (err) {
      console.error('Error adding link:', err);
      toast.error('Failed to add link');
    }
  };

  // Edit link
  const handleEditLink = async (linkId, linkData) => {
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkData)
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(prev => prev.map(link => 
          link._id === linkId ? data.link : link
        ));
        setEditingLink(null);
        toast.success('Link updated successfully');
      } else {
        throw new Error('Failed to update link');
      }
    } catch (err) {
      console.error('Error updating link:', err);
      toast.error('Failed to update link');
    }
  };

  // Delete link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLinks(prev => prev.filter(link => link._id !== linkId));
        toast.success('Link deleted successfully');
      } else {
        throw new Error('Failed to delete link');
      }
    } catch (err) {
      console.error('Error deleting link:', err);
      toast.error('Failed to delete link');
    }
  };

  // Toggle link visibility
  const handleToggleVisibility = async (linkId, isActive) => {
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(prev => prev.map(link => 
          link._id === linkId ? data.link : link
        ));
        toast.success(`Link ${!isActive ? 'shown' : 'hidden'} successfully`);
      } else {
        throw new Error('Failed to toggle link visibility');
      }
    } catch (err) {
      console.error('Error toggling link visibility:', err);
      toast.error('Failed to toggle link visibility');
    }
  };

  // Copy profile URL
  const handleCopyProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${userProfile?.username}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success('Profile URL copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy profile URL');
    });
  };

  // Copy link URL
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  // Share profile
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${userProfile?.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${userProfile?.displayName || userProfile?.username}'s Profile`,
        url: profileUrl,
      }).catch(console.error);
    } else {
      handleCopyProfile();
    }
  };

  // Generate QR Code
  const handleGenerateQR = (link) => {
    setSelectedLinkForQR(link);
    setShowQRModal(true);
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white mb-4">Please sign in to access your dashboard</div>
          <button 
            onClick={() => window.location.href = '/signin'} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {userProfile?.displayName || userProfile?.username}
                </h1>
                <p className="text-gray-400">
                  {userProfile?.bio || 'Manage your links and track performance'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleShareProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Share Profile</span>
              </button>
              <button
                onClick={handleCopyProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <EyeIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Profile Views</p>
                  <p className="text-xl font-bold text-white">
                    {userStats?.totalViews?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CursorArrowRaysIcon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Clicks</p>
                  <p className="text-xl font-bold text-white">
                    {userStats?.totalClicks?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Links</p>
                  <p className="text-xl font-bold text-white">
                    {links.filter(link => link.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Click Rate</p>
                  <p className="text-xl font-bold text-white">
                    {userStats?.clickThroughRate || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Links</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>

          {links.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {links.map((link) => (
                    <SortableLink
                      key={link._id}
                      link={link}
                      onEdit={(linkData) => handleEditLink(link._id, linkData)}
                      onDelete={() => handleDeleteLink(link._id)}
                      onToggleVisibility={() => handleToggleVisibility(link._id, link.isActive)}
                      onCopy={() => handleCopyLink(link.url)}
                      onGenerateQR={() => handleGenerateQR(link)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No links yet</h3>
              <p className="text-gray-400 mb-6">Start building your link collection</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Add Your First Link
              </button>
            </div>
          )}
        </div>

        {/* Profile Preview */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Profile Preview</h3>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">
                {window.location.origin}/profile/{userProfile?.username}
              </span>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-white font-medium">
                  {userProfile?.displayName || userProfile?.username}
                </h4>
                <p className="text-gray-400 text-sm">@{userProfile?.username}</p>
              </div>
            </div>
            
            {userProfile?.bio && (
              <p className="text-gray-300 text-sm mb-4">{userProfile.bio}</p>
            )}
            
            <div className="space-y-2">
              {links.filter(link => link.isActive).slice(0, 3).map((link) => (
                <div key={link._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: link.backgroundColor || '#3B82F6' }}
                    ></div>
                    <span className="text-white text-sm">{link.title}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{link.clicks} clicks</span>
                </div>
              ))}
              {links.filter(link => link.isActive).length > 3 && (
                <div className="text-center py-2">
                  <span className="text-gray-400 text-sm">
                    +{links.filter(link => link.isActive).length - 3} more links
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLink}
        editingLink={editingLink}
        onEdit={handleEditLink}
      />

      {showQRModal && selectedLinkForQR && (
        <QRCodeGenerator
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedLinkForQR(null);
          }}
          link={selectedLinkForQR}
        />
      )}
    </div>
  );
};

export default ComprehensiveDashboard;
