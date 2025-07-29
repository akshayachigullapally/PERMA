import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SortableLink from './SortableLink';
import AddLinkModal from './AddLinkModal';
import LoadingSpinner from './LoadingSpinner';
import QRCodeGenerator from './QRCodeGenerator';

const ComprehensiveDashboard = () => {
  const { user: authUser, getToken: authGetToken, loading: authLoading } = useAuth();
  const { userStats, fetchUserStats, loading: analyticsLoading } = useAnalytics();
  
  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLinkForQR, setSelectedLinkForQR] = useState(null);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      x: 20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

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

  // Reusable function to refresh analytics data
  const refreshAnalytics = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      await fetchUserStats(token);
    } catch (err) {
      console.error('Error refreshing analytics:', err);
    }
  }, [getToken, fetchUserStats]);

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

  // Refresh analytics data periodically to catch click updates
  useEffect(() => {
    if (!authUser || authLoading) return;

    // Initial analytics fetch
    refreshAnalytics();

    // Set up interval to refresh analytics every 30 seconds
    const analyticsInterval = setInterval(refreshAnalytics, 30000);

    // Also refresh links periodically to get updated click counts
    const linksInterval = setInterval(refreshLinks, 30000);

    return () => {
      clearInterval(analyticsInterval);
      clearInterval(linksInterval);
    };
  }, [authUser, authLoading, refreshAnalytics, refreshLinks]);

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
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Send the link data to the server to save in MongoDB
      const response = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add the new link (with server-generated ID) to local state
        setLinks(prev => [...prev, data.link]);
        setIsAddModalOpen(false);
        toast.success('Link added successfully');
        
        // Refresh analytics to get updated stats
        refreshAnalytics();
        
        console.log('New link added to database:', data.link); // Debug log
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add link');
      }
    } catch (err) {
      console.error('Error adding link:', err);
      toast.error(err.message || 'Failed to add link');
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
        
        // Refresh analytics to get updated stats
        refreshAnalytics();
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
        
        // Refresh analytics to get updated stats
        refreshAnalytics();
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
        
        // Refresh analytics to get updated stats
        refreshAnalytics();
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
    <motion.div 
      className="min-h-screen bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Welcome back, {userProfile?.displayName || userProfile?.username}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  {userProfile?.bio || 'Manage your links and track performance'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={handleShareProfile}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Share Profile</span>
              </button>
              <button
                onClick={handleCopyProfile}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20"
              variants={statsVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                  <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs sm:text-sm">Profile Views</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {userStats?.totalViews?.toLocaleString() || '0'}
                  </p>
                </div>
                <motion.button
                  onClick={refreshAnalytics}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Refresh analytics"
                  disabled={analyticsLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={analyticsLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: analyticsLoading ? 1 : 0.2, repeat: analyticsLoading ? Infinity : 0 }}
                >
                  <ArrowPathIcon className={`w-3 h-3 ${analyticsLoading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20"
              variants={statsVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                  <CursorArrowRaysIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Clicks</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {userStats?.totalClicks?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20"
              variants={statsVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                  <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Active Links</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {links.filter(link => link.isActive).length}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20"
              variants={statsVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                  <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Click Rate</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {userStats?.clickThroughRate || 0}%
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Links Section */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-bold text-white">Your Links</h2>
            <motion.button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm w-full sm:w-auto"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Link</span>
            </motion.button>
          </div>

          {links.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
                <motion.div 
                  className="space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {links.map((link, index) => (
                      <motion.div
                        key={link._id}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ delay: index * 0.1 }}
                      >
                        <SortableLink
                          link={link}
                          onEdit={(linkData) => handleEditLink(link._id, linkData)}
                          onDelete={() => handleDeleteLink(link._id)}
                          onToggleVisibility={() => handleToggleVisibility(link._id, link.isActive)}
                          onCopy={() => handleCopyLink(link.url)}
                          onGenerateQR={() => handleGenerateQR(link)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </DndContext>
          ) : (
            <motion.div 
              className="text-center py-8 sm:py-12"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No links yet</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Start building your link collection</p>
              <motion.button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors w-full sm:w-auto"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Add Your First Link
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Profile Preview */}
        <motion.div 
          className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-bold text-white">Profile Preview</h3>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-xs sm:text-sm truncate">
                {window.location.origin}/profile/{userProfile?.username}
              </span>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 sm:p-4">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-white font-medium text-sm sm:text-base">
                  {userProfile?.displayName || userProfile?.username}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">@{userProfile?.username}</p>
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
        </motion.div>
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
    </motion.div>
  );
};

export default ComprehensiveDashboard;
