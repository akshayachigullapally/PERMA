import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SortableLink from './SortableLink';
import AddLinkModal from './AddLinkModal';

const Dashboard = () => {
  const { user: authUser } = useAuth();
  
  const [links, setLinks] = useState([
    {
      id: '1',
      title: 'GitHub Profile',
      url: 'https://github.com/username',
      icon: '🐙',
      clicks: 1234,
      isVisible: true,
    },
    {
      id: '2',
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/username',
      icon: '💼',
      clicks: 856,
      isVisible: true,
    },
    {
      id: '3',
      title: 'Portfolio Website',
      url: 'https://myportfolio.com',
      icon: '🌐',
      clicks: 642,
      isVisible: true,
    },
    {
      id: '4',
      title: 'Twitter',
      url: 'https://twitter.com/username',
      icon: '🐦',
      clicks: 423,
      isVisible: true,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user] = useState({
    username: authUser?.username || 'user',
    displayName: authUser?.displayName || authUser?.username || 'User',
    bio: authUser?.bio || 'Full-stack developer passionate about creating amazing user experiences',
    avatar: authUser?.profileImage || null,
    totalClicks: 3155,
    profileViews: 1284,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const copyPermaLink = () => {
    const permaLink = `https://perma.in/${user.username}`;
    navigator.clipboard.writeText(permaLink);
    toast.success('Perma link copied to clipboard!');
  };

  const addLink = (newLink) => {
    const link = {
      ...newLink,
      id: Date.now().toString(),
      clicks: 0,
      isVisible: true,
    };
    setLinks(prevLinks => [...prevLinks, link]);
    setIsAddModalOpen(false);
    toast.success('Link added successfully!');
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Link deleted successfully!');
  };

  const toggleLinkVisibility = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center">
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">
                {user.displayName.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{user.displayName}</h1>
          <p className="text-gray-200 mb-4">{user.bio}</p>
          
          {/* Perma Link */}
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-300" />
              <span className="text-white font-mono">perma.in/{user.username}</span>
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
              <p className="text-2xl font-bold text-white">{user.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <EyeIcon className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-white font-semibold">Profile Views</span>
              </div>
              <p className="text-2xl font-bold text-white">{user.profileViews.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <LinkIcon className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-white font-semibold">Active Links</span>
              </div>
              <p className="text-2xl font-bold text-white">{links.filter(l => l.isVisible).length}</p>
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
            <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:transform hover:scale-105">
              <ShareIcon className="h-5 w-5" />
              <span>Share Profile</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Links */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={links} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {links.map((link) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onDelete={deleteLink}
                  onToggleVisibility={toggleLinkVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {links.length === 0 && (
          <div className="text-center py-12">
            <LinkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No links yet</h3>
            <p className="text-gray-300 mb-6">Add your first link to get started</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
            >
              Add Your First Link
            </button>
          </div>
        )}
      </div>

      {/* Add Link Modal */}
      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addLink}
      />
      </div>
    </div>
  );
};

export default Dashboard;
