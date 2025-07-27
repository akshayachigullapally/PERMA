import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const QRCodeGenerator = ({ isOpen, onClose, link }) => {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQRCode = useCallback(async () => {
    if (!canvasRef.current || !link) return;

    setLoading(true);
    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, link.url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Get data URL for download
      const dataUrl = canvas.toDataURL('image/png');
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  }, [link]);

  useEffect(() => {
    if (isOpen && link) {
      generateQRCode();
    }
  }, [isOpen, link, generateQRCode]);

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const downloadLink = document.createElement('a');
    downloadLink.href = qrDataUrl;
    downloadLink.download = `${link.title || 'qr-code'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success('QR code downloaded');
  };

  const copyQRCode = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      
      toast.success('QR code copied to clipboard');
    } catch (error) {
      console.error('Error copying QR code:', error);
      toast.error('Failed to copy QR code');
    }
  };

  const shareQRCode = async () => {
    if (!qrDataUrl || !navigator.share) {
      copyQRCode();
      return;
    }

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${link.title || 'qr-code'}.png`, { type: 'image/png' });

      await navigator.share({
        title: `QR Code for ${link.title}`,
        text: `QR Code for ${link.title} - ${link.url}`,
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      copyQRCode();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Link Info */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-1">{link?.title}</h3>
          <p className="text-gray-400 text-sm break-all">{link?.url}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={downloadQRCode}
            disabled={loading || !qrDataUrl}
            className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-300">Download</span>
          </button>

          <button
            onClick={copyQRCode}
            disabled={loading || !qrDataUrl}
            className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardDocumentIcon className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-300">Copy</span>
          </button>

          <button
            onClick={shareQRCode}
            disabled={loading || !qrDataUrl}
            className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShareIcon className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-300">Share</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm">
            Scan this QR code with any camera app to quickly access the link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
