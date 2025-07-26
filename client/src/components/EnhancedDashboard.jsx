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
  UserIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SortableLink from './SortableLink';
import AddLinkModal from './AddLinkModal';
import LoadingSpinner from './LoadingSpinner';

const EnhancedDashboard = () => {
  const { user: authUser, getToken } = useAuth();
  const { userStats, loading: analyticsLoading, fetchUserStats } = useAnalytics();
  
  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/users/profile', {
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
  }, [getToken]);

  // Fetch user links
  const fetchLinks = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/links', {
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
    const loadDashboard = async () => {
      setLoading(true);
      try {
        if (authUser) {
          const token = getToken();
          await Promise.all([
            fetchUserProfile(),
            fetchLinks(),
            fetchUserStats(token)
          ]);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [authUser, getToken, fetchUserProfile, fetchLinks, fetchUserStats]);

  // Handle drag and drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item._id === active.id);
      const newIndex = links.findIndex((item) => item._id === over.id);
      
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Update order on server
      try {
        const token = getToken();
        const linkIds = newLinks.map(link => link._id);
        
        await fetch('http://localhost:5000/api/links/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ linkIds })
        });
        
        toast.success('Link order updated!');
      } catch (err) {
        console.error('Error updating link order:', err);
        toast.error('Failed to update link order');
        // Revert on error
        fetchLinks();
      }
    }
  };

  // Copy profile link
  const copyPermaLink = () => {
    const permaLink = `https://perma.in/${userProfile?.username || 'username'}`;
    navigator.clipboard.writeText(permaLink);
    toast.success('Perma link copied to clipboard!');
  };

  // Add new link
  const addLink = async (newLink) => {
    try {
      const token = getToken();
      
      const response = await fetch('http://localhost:5000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLink)
      });

      if (response.ok) {
        const data = await response.json();
        setLinks([...links, data.link]);
        setIsAddModalOpen(false);
        toast.success('Link added successfully!');
        
        // Refresh analytics
        fetchUserStats(token);
      } else {
        throw new Error('Failed to add link');
      }
    } catch (err) {
      console.error('Error adding link:', err);
      toast.error('Failed to add link');
    }
  };

  // Delete link
  const deleteLink = async (linkId) => {
    try {
      const token = getToken();
      
      const response = await fetch(`http://localhost:5000/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLinks(links.filter(link => link._id !== linkId));
        toast.success('Link deleted successfully!');
        
        // Refresh analytics
        fetchUserStats(token);
      } else {
        throw new Error('Failed to delete link');
      }
    } catch (err) {
      console.error('Error deleting link:', err);
      toast.error('Failed to delete link');
    }
  };

  // Toggle link visibility
  const toggleLinkVisibility = async (linkId) => {
    try {
      const token = getToken();
      const link = links.find(l => l._id === linkId);
      
      const response = await fetch(`http://localhost:5000/api/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !link.isActive })
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(links.map(l => l._id === linkId ? data.link : l));
        toast.success(`Link ${link.isActive ? 'hidden' : 'shown'} successfully!`);
      } else {
        throw new Error('Failed to update link');
      }
    } catch (err) {
      console.error('Error updating link:', err);
      toast.error('Failed to update link');
    }
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
          <div className="text-red-400 text-xl mb-4">{error}</div>
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {userProfile?.profileImage ? (
              <img src={userProfile.profileImage} alt={userProfile.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {userProfile?.displayName || authUser?.username || 'User'}
          </h1>
          <p className="text-gray-200 mb-4">
            {userProfile?.bio || 'Add a bio to tell people about yourself'}
          </p>
          
          {/* Perma Link */}
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-300" />
              <span className="text-white font-mono">
                perma.in/{userProfile?.username || 'set-username'}
              </span>
              <button 
                onClick={copyPermaLink}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <ChartBarIcon className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-white font-semibold">Total Clicks</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {analyticsLoading ? '...' : (userStats?.totalClicks || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <EyeIcon className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-white font-semibold">Profile Views</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {analyticsLoading ? '...' : (userStats?.totalViews || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <LinkIcon className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-white font-semibold">Active Links</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {links.filter(l => l.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links Management */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Links</h2>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:transform hover:scale-105">
              <QrCodeIcon className="h-5 w-5" />
              <span>Generate QR</span>
            </button>
            <button 
              onClick={copyPermaLink}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:transform hover:scale-105"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share Profile</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 btn-primary text-white px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Links */}
        {links.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {links.map((link) => (
                  <SortableLink
                    key={link._id}
                    id={link._id}
                    link={link}
                    onDelete={deleteLink}
                    onToggleVisibility={toggleLinkVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12">
            <LinkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No links yet</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first link</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add Your First Link
            </button>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      {userStats && (
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Click-through Rate</h3>
              <p className="text-2xl font-bold text-blue-400">{userStats.clickThroughRate || 0}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Total Links</h3>
              <p className="text-2xl font-bold text-green-400">{userStats.totalLinks || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Monthly Clicks</h3>
              <p className="text-2xl font-bold text-purple-400">{userStats.monthlyClicks || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Monthly Views</h3>
              <p className="text-2xl font-bold text-pink-400">{userStats.monthlyViews || 0}</p>
            </div>
          </div>

          {/* Top Performing Links */}
          {userStats.topLinks && userStats.topLinks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Performing Links</h3>
              <div className="space-y-2">
                {userStats.topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-400 w-6">#{index + 1}</span>
                      <span className="text-white font-medium">{link.title}</span>
                    </div>
                    <span className="text-blue-400 font-semibold">{link.clicks} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Link Modal */}
      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addLink}
      />
    </div>
  );
};

export default EnhancedDashboard;
