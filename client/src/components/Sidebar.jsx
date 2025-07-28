import React from 'react';
import { 
  HomeIcon,
  ChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
  TrophyIcon,
  DocumentIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'QR Codes', href: '/qr-codes', icon: QrCodeIcon },
    { name: 'Directory', href: '/directory', icon: UserGroupIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Resume Builder', href: '/resume', icon: DocumentIcon },
    { name: 'Enterprise', href: '/enterprise', icon: BuildingOfficeIcon },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 sm:w-72 glass-effect transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 lg:w-64 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden flex-shrink-0">
          <span className="text-white font-bold text-lg sm:text-xl">Menu</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <nav className="mt-6 lg:mt-4 px-2 sm:px-4">
            <div className="space-y-1 sm:space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`
                    group flex items-center px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 transition-colors
                      ${isActive(item.href) ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="mt-6 sm:mt-8 px-2 sm:px-4">
            <div className="bg-white/10 rounded-lg p-3 sm:p-4">
              <h3 className="text-white font-medium text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-300">Total Links</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-300">This Month</span>
                  <span className="text-green-400 font-medium">+2,341</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-300">Profile Views</span>
                  <span className="text-blue-400 font-medium">1,284</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="mt-4 sm:mt-6 px-2 sm:px-4 pb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 sm:p-4">
              <h3 className="text-white font-bold text-xs sm:text-sm mb-2">Upgrade to Pro</h3>
              <p className="text-white/80 text-xs mb-2 sm:mb-3 leading-relaxed">
                Get advanced analytics, custom domains, and more
              </p>
              <button className="w-full bg-white text-purple-600 font-medium text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-md hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
