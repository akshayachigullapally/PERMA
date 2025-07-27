import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AddLinkModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '🔗',
  });

  const [isLoading, setIsLoading] = useState(false);

  const commonIcons = [
    '🔗', '🌐', '📧', '💼', '🐙', '🐦', '📷', '🎵', 
    '📺', '📱', '💻', '🎮', '📚', '🎨', '📊', '🏠'
  ];

  const platformSuggestions = [
    { name: 'GitHub', icon: '🐙', urlPattern: 'github.com' },
    { name: 'LinkedIn', icon: '💼', urlPattern: 'linkedin.com' },
    { name: 'Twitter', icon: '🐦', urlPattern: 'twitter.com' },
    { name: 'Instagram', icon: '📷', urlPattern: 'instagram.com' },
    { name: 'YouTube', icon: '📺', urlPattern: 'youtube.com' },
    { name: 'Portfolio', icon: '🌐', urlPattern: '' },
    { name: 'Email', icon: '📧', urlPattern: 'mailto:' },
    { name: 'Spotify', icon: '🎵', urlPattern: 'spotify.com' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate URL
    try {
      let finalFormData = { ...formData };
      
      // Add protocol if missing
      if (!finalFormData.url.startsWith('http://') && !finalFormData.url.startsWith('https://') && !finalFormData.url.startsWith('mailto:')) {
        finalFormData.url = 'https://' + finalFormData.url;
      }
      
      console.log('Submitting form data:', finalFormData); // Debug log
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onAdd(finalFormData);
      setFormData({ title: '', url: '', icon: '🔗' });
      
      console.log('Form submitted successfully'); // Debug log
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformSelect = (platform) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || platform.name,
      icon: platform.icon,
      url: platform.urlPattern ? (platform.urlPattern.includes('mailto:') ? platform.urlPattern : `https://${platform.urlPattern}/`) : prev.url
    }));
  };

  const autoDetectPlatform = (url) => {
    const platform = platformSuggestions.find(p => 
      p.urlPattern && url.toLowerCase().includes(p.urlPattern.toLowerCase())
    );
    if (platform) {
      setFormData(prev => ({
        ...prev,
        icon: platform.icon,
        title: prev.title || platform.name
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-lg sm:rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add New Link</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Platform Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Quick Add
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {platformSuggestions.map((platform) => (
                <button
                  key={platform.name}
                  type="button"
                  onClick={() => handlePlatformSelect(platform)}
                  className="flex flex-col items-center p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {platform.icon}
                  </span>
                  <span className="text-xs text-gray-600 group-hover:text-purple-600 text-center">
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., My GitHub Profile"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, url: e.target.value }));
                autoDetectPlatform(e.target.value);
              }}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl">{formData.icon}</span>
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Choose an emoji"
                maxLength={2}
              />
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center text-sm sm:text-lg hover:bg-purple-50 transition-all
                    ${formData.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
            >
              {isLoading ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;
