import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { isSignedIn, user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'QR Codes', href: '/qr-codes', icon: QrCodeIcon },
    { name: 'Directory', href: '/directory', icon: UserGroupIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Resume Builder', href: '/resume', icon: DocumentIcon },
    { name: 'Enterprise', href: '/enterprise', icon: BuildingOfficeIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl gradient-text">Perma</span>
            </Link>
          </div>

          {/* Desktop Navigation - Only show if signed in */}
          {isSignedIn && (
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <span className="hidden sm:block text-white font-medium">
                  {user?.displayName || user?.username || 'User'}
                </span>
                <div className="relative group">
                  <button className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-in"
                  className="text-white hover:text-gray-200 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only show if signed in */}
        {isMobileMenuOpen && isSignedIn && (
          <div className="lg:hidden border-t border-white/20 pt-4 pb-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Quick Stats */}
            <div className="mt-6 px-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-medium text-sm mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Total Links</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">This Month</span>
                    <span className="text-green-400 font-medium">+2,341</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Profile Views</span>
                    <span className="text-blue-400 font-medium">1,284</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Upgrade Banner */}
            <div className="mt-4 px-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
                <h3 className="text-white font-bold text-sm mb-2">Upgrade to Pro</h3>
                <p className="text-white/80 text-xs mb-3">
                  Get advanced analytics, custom domains, and more
                </p>
                <button className="w-full bg-white text-purple-600 font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
