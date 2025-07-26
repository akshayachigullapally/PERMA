import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  QrCodeIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CogIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const QRCodes = () => {
  const { user, getToken } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrSettings, setQrSettings] = useState({
    size: 256,
    errorCorrection: 'M',
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    margin: 4,
    style: 'square' // square, rounded, dots
  });
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setQrUrl(`https://perma.in/${data.user.username || 'username'}`);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, getToken]);

  const generateQRUrl = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      size: `${qrSettings.size}x${qrSettings.size}`,
      data: qrUrl,
      bgcolor: qrSettings.backgroundColor.replace('#', ''),
      color: qrSettings.foregroundColor.replace('#', ''),
      qzone: qrSettings.margin.toString(),
      ecc: qrSettings.errorCorrection
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const downloadQR = () => {
    const qrImageUrl = generateQRUrl();
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `perma-qr-${userProfile?.username || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success('Profile URL copied to clipboard!');
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userProfile?.displayName || 'My'} Perma Profile`,
          text: 'Check out my Perma profile!',
          url: qrUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyQRUrl();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <QrCodeIcon className="h-8 w-8 text-blue-400 mr-3" />
            QR Code Generator
          </h1>
          <p className="text-gray-400">
            Generate custom QR codes for your Perma profile to share offline
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Preview */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">QR Code Preview</h2>
            
            <div className="text-center">
              <div className="inline-block p-6 bg-white rounded-xl mb-6">
                <img 
                  src={generateQRUrl()} 
                  alt="QR Code" 
                  className="mx-auto"
                  style={{ 
                    width: qrSettings.size, 
                    height: qrSettings.size 
                  }}
                />
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-2">Scan to visit:</p>
                <p className="text-blue-400 font-mono text-sm break-all">{qrUrl}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download
                </button>
                <button
                  onClick={copyQRUrl}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                  Copy URL
                </button>
                <button
                  onClick={shareQR}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Customization Settings */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <CogIcon className="h-6 w-6 text-gray-400 mr-2" />
              Customization
            </h2>

            <div className="space-y-6">
              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size (pixels)
                </label>
                <select
                  value={qrSettings.size}
                  onChange={(e) => setQrSettings({...qrSettings, size: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={128}>128x128</option>
                  <option value={256}>256x256</option>
                  <option value={512}>512x512</option>
                  <option value={1024}>1024x1024</option>
                </select>
              </div>

              {/* Error Correction */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Error Correction
                </label>
                <select
                  value={qrSettings.errorCorrection}
                  onChange={(e) => setQrSettings({...qrSettings, errorCorrection: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <PaintBrushIcon className="h-4 w-4 inline mr-1" />
                    Foreground
                  </label>
                  <input
                    type="color"
                    value={qrSettings.foregroundColor}
                    onChange={(e) => setQrSettings({...qrSettings, foregroundColor: e.target.value})}
                    className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background
                  </label>
                  <input
                    type="color"
                    value={qrSettings.backgroundColor}
                    onChange={(e) => setQrSettings({...qrSettings, backgroundColor: e.target.value})}
                    className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Margin: {qrSettings.margin}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={qrSettings.margin}
                  onChange={(e) => setQrSettings({...qrSettings, margin: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Usage Ideas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Business Cards</h3>
              <p className="text-gray-400 text-sm">Add your QR code to business cards for instant profile access</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Social Media</h3>
              <p className="text-gray-400 text-sm">Share on Instagram stories, LinkedIn posts, or Twitter</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Email Signature</h3>
              <p className="text-gray-400 text-sm">Include in your email signature for easy networking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodes;
