import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const qrCodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 },
    disabled: {
      scale: 1,
      opacity: 0.5
    }
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md w-full"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-white">QR Code</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </motion.button>
            </motion.div>

            {/* Link Info */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <h3 className="text-white font-medium mb-1">{link?.title}</h3>
              <p className="text-gray-400 text-sm break-all">{link?.url}</p>
            </motion.div>

            {/* QR Code */}
            <motion.div 
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white p-4 rounded-xl"
                variants={qrCodeVariants}
                whileHover={{ scale: 1.02 }}
              >
                {loading ? (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <motion.div 
                      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="grid grid-cols-3 gap-3"
              variants={itemVariants}
            >
              <motion.button
                onClick={downloadQRCode}
                disabled={loading || !qrDataUrl}
                className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover={loading || !qrDataUrl ? "disabled" : "hover"}
                whileTap={loading || !qrDataUrl ? "disabled" : "tap"}
              >
                <ArrowDownTrayIcon className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-300">Download</span>
              </motion.button>

              <motion.button
                onClick={copyQRCode}
                disabled={loading || !qrDataUrl}
                className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover={loading || !qrDataUrl ? "disabled" : "hover"}
                whileTap={loading || !qrDataUrl ? "disabled" : "tap"}
              >
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-300">Copy</span>
              </motion.button>

              <motion.button
                onClick={shareQRCode}
                disabled={loading || !qrDataUrl}
                className="flex flex-col items-center space-y-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover={loading || !qrDataUrl ? "disabled" : "hover"}
                whileTap={loading || !qrDataUrl ? "disabled" : "tap"}
              >
                <ShareIcon className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-300">Share</span>
              </motion.button>
            </motion.div>

            {/* Instructions */}
            <motion.div 
              className="mt-6 p-4 bg-white/5 rounded-lg"
              variants={itemVariants}
            >
              <p className="text-gray-400 text-sm">
                Scan this QR code with any camera app to quickly access the link.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeGenerator;
