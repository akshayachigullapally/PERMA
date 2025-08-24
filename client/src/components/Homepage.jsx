import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { Link2, ArrowRight } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import DebugInfo from './DebugInfo';

const Homepage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { platformStats, loading, error, fetchPlatformStats } = useAnalytics();

  useEffect(() => {
    fetchPlatformStats();
  }, [fetchPlatformStats]);

  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <HeroSection 
        isSignedIn={isSignedIn}
        onGetStarted={handleSignUpClick}
        onSignIn={handleSignInClick}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-gray-400">
              <p>Unable to load statistics. Showing estimated values.</p>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {platformStats?.avgLinksPerUser || 5}+
              </div>
              <div className="text-gray-400">Avg links per user</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {platformStats?.monthlyGrowth || 15}%
              </div>
              <div className="text-gray-400">Monthly growth</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                {platformStats?.proConversionRate || 3}%
              </div>
              <div className="text-gray-400">Pro conversion</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-gray-400">Accessible design</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators, developers, and professionals who trust Perma with their digital identity.
          </p>
          {!isSignedIn && (
            <button
              onClick={handleSignUpClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Create Your Perma Link
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link2 className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Perma</span>
            </div>
            <p className="text-gray-400 mb-4">Your identity. All in one link.</p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add this temporarily for debugging */}
      {import.meta.env.DEV && <DebugInfo />}
    </div>
  );
};

export default Homepage;
