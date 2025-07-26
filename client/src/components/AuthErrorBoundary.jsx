import React from 'react';
import { Link } from 'react-router-dom';

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-red-400 text-xl font-bold mb-4">Authentication Error</h2>
              <p className="text-gray-300 mb-6">
                There was an issue with the authentication process. Please try again.
              </p>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go Home
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
