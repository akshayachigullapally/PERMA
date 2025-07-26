import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

const SortableLink = ({ 
  link, 
  onDelete, 
  onToggleVisibility, 
  onEdit, 
  onCopy, 
  onGenerateQR 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: link.title,
    url: link.url,
    description: link.description || ''
  });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link._id || link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    if (!editData.title.trim() || !editData.url.trim()) {
      return;
    }
    
    onEdit(editData);
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditData({
      title: link.title,
      url: link.url,
      description: link.description || ''
    });
    setIsEditing(false);
  };

  const copyLink = (e) => {
    e.stopPropagation();
    onCopy();
  };

  const openLink = (e) => {
    e.stopPropagation();
    window.open(link.url, '_blank');
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    onToggleVisibility();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleGenerateQR = (e) => {
    e.stopPropagation();
    onGenerateQR();
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
      >
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link title"
            />
          </div>
          <div>
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optional)"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer group
        hover:bg-white/15 transition-all duration-200 
        ${isDragging ? 'shadow-2xl' : 'hover:shadow-lg'}
        ${!link.isActive ? 'opacity-60' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10"
          >
            <Bars3Icon className="w-5 h-5 text-gray-400" />
          </div>

          {/* Link Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-medium truncate">{link.title}</h3>
              {!link.isActive && (
                <EyeSlashIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-400 text-sm truncate">{link.url}</p>
            {link.description && (
              <p className="text-gray-500 text-xs mt-1 truncate">{link.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <ChartBarIcon className="w-4 h-4" />
              <span>{link.clicks || 0} clicks</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={openLink}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Open link"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          
          <button
            onClick={copyLink}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Copy link"
          >
            <ClipboardDocumentIcon className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          <button
            onClick={handleGenerateQR}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Generate QR code"
          >
            <QrCodeIcon className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Edit link"
          >
            <PencilIcon className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          <button
            onClick={handleToggleVisibility}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={link.isActive ? 'Hide link' : 'Show link'}
          >
            {link.isActive ? (
              <EyeIcon className="w-4 h-4 text-gray-400 hover:text-white" />
            ) : (
              <EyeSlashIcon className="w-4 h-4 text-gray-400 hover:text-white" />
            )}
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Delete link"
          >
            <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableLink;
