import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  TrophyIcon,
  DocumentIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Inline ProfileDropdown component
const ProfileDropdown = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSettingsClick = () => {
    if (onClose) onClose();
  };

  const handleSignOut = () => {
    signOut();
    navigate('/'); // Navigate to home page
    if (onClose) onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50">
      <div className="py-2">
        <Link
          to="/settings"
          onClick={handleSettingsClick}
          className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-200 group"
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-300 transition-colors" />
          <span className="font-medium">Settings</span>
        </Link>
        
        <div className="border-t border-white/10 my-1"></div>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const { isSignedIn, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
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
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              Perma
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isSignedIn && (
          <>
            <nav className="mt-6">
              <div className="px-6 space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden
                      ${isActive(item.href)
                        ? 'bg-white/15 text-white shadow-lg border border-white/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-5 w-5 transition-colors
                        ${isActive(item.href) ? 'text-purple-300' : 'text-gray-400 group-hover:text-purple-300'}
                      `}
                    />
                    {item.name}
                    {isActive(item.href) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r"></div>
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Quick Stats */}
            <div className="mt-8 px-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-2 text-purple-300" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Total Links</span>
                    <span className="text-white font-semibold bg-white/10 px-2 py-1 rounded-lg">8</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">This Month</span>
                    <span className="text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded-lg">+2,341</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Profile Views</span>
                    <span className="text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded-lg">1,284</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Upgrade Banner */}
            <div className="mt-6 px-6">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl p-5 border border-white/20 shadow-lg">
                <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </h3>
                <p className="text-white/90 text-xs mb-4 leading-relaxed">
                  Get advanced analytics, custom domains, and more
                </p>
                <button className="w-full bg-white text-purple-600 font-semibold text-sm py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg">
                  Upgrade Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                  Perma
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Only show if signed in */}
            {isSignedIn && (
              <nav className="hidden lg:flex items-center space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden ${
                      isActive(item.href)
                        ? 'bg-white/15 text-white shadow-lg shadow-purple-500/10 border border-white/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 transition-all duration-200 ${
                      isActive(item.href) 
                        ? 'text-purple-300' 
                        : 'text-gray-400 group-hover:text-purple-300'
                    }`} />
                    <span className="text-sm">{item.name}</span>
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    )}
                  </Link>
                ))}
              </nav>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  <div className="relative" ref={profileRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-2 border-white/20"
                    >
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (user?.displayName || user?.username || 'U')[0].toUpperCase()
                      )}
                    </button>
                    <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/sign-in"
                    className="text-white/90 hover:text-white transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 border border-white/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
