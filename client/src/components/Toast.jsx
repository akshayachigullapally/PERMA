import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };

  const colors = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-blue-900/90 border-blue-700 text-blue-100',
    warning: 'bg-yellow-900/90 border-yellow-700 text-yellow-100'
  };

  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border backdrop-blur-sm ${colors[type]} max-w-full sm:max-w-sm`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <p className="text-xs sm:text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-current hover:opacity-70 text-lg sm:text-xl flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
