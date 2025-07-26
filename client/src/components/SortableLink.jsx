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
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const SortableLink = ({ link, onDelete, onToggleVisibility }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    toast.success('Link copied to clipboard!');
  };

  const openLink = (e) => {
    e.stopPropagation();
    window.open(link.url, '_blank');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        link-card rounded-xl p-4 cursor-pointer group
        ${!link.isVisible ? 'opacity-50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-grab active:cursor-grabbing"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* Link Icon */}
        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">{link.icon}</span>
        </div>

        {/* Link Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{link.title}</h3>
            {!link.isVisible && (
              <EyeSlashIcon className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
          <div className="flex items-center mt-1 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              {link.clicks.toLocaleString()} clicks
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
              CTR: {((link.clicks / 1000) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`
          flex items-center space-x-2 transition-all duration-200
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
        `}>
          <button
            onClick={copyLink}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="Copy link"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={openLink}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
            title="Open link"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(link.id);
            }}
            className={`
              p-2 rounded-lg transition-all
              ${link.isVisible 
                ? 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50' 
                : 'text-yellow-500 hover:text-gray-400 hover:bg-gray-50'
              }
            `}
            title={link.isVisible ? 'Hide link' : 'Show link'}
          >
            {link.isVisible ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeSlashIcon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit functionality
              toast.info('Edit functionality coming soon!');
            }}
            className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all"
            title="Edit link"
          >
            <PencilIcon className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this link?')) {
                onDelete(link.id);
              }
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete link"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableLink;
