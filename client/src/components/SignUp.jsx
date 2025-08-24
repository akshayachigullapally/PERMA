import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import workspaceImage from '../assets/undraw_sign-in_uva0.svg';

// Password validation function
function validatePassword(pwd, username, email) {
  if (pwd.length < 8) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  if (!/[a-z]/.test(pwd)) return false;
  if (!/[0-9]/.test(pwd)) return false;
  if (!/[^A-Za-z0-9]/.test(pwd)) return false;
  const patterns = ['password', '123456', 'qwerty', 'letmein', 'welcome', 'admin', 'user', username, email];
  for (const pattern of patterns) {
    if (pattern && pwd.toLowerCase().includes(pattern.toLowerCase())) return false;
  }
  return true;
}

// Password feedback function
function getPasswordFeedback(pwd, username, email) {
  if (pwd.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must contain at least one special character';
  const patterns = ['password', '123456', 'qwerty', 'letmein', 'welcome', 'admin', 'user', username, email];
  for (const pattern of patterns) {
    if (pattern && pwd.toLowerCase().includes(pattern.toLowerCase())) {
      return 'Password should not contain common words, personal info, or patterns';
    }
  }
  return 'Password meets all requirements';
}

const SignUp = () => {
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(password, username, email)) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const result = await signUp(email, password, username);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Or{' '}
              <Link
                to="/sign-in"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 pr-12 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) {
                      setPasswordFeedback(getPasswordFeedback(e.target.value, username, email));
                    }
                  }}
                  onBlur={() => {
                    setPasswordTouched(true);
                    setPasswordFeedback(getPasswordFeedback(password, username, email));
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-20 cursor-pointer bg-transparent border-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  )}
                </button>
                {passwordTouched && passwordFeedback && (
                  <div className={`mt-2 text-sm ${validatePassword(password, username, email) ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordFeedback}
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 pr-12 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-20 cursor-pointer bg-transparent border-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
          <div className="relative flex items-center justify-center">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-600" />
  </div>
  <div className="relative px-4 bg-gray-900 text-gray-400 text-sm">or continue with</div>
</div>

<div className="mt-4">
  <button
    type="button"
    disabled={loading}
    onClick={async () => {
      try {
        setLoading(true);
        setError('');
        const result = await signInWithGoogle();
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || 'Failed to sign in with Google');
        }
      } catch (error) {
        setError('Failed to sign in with Google');
      } finally {
        setLoading(false);
      }
    }}
    className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
  >
    {loading ? (
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing in...
      </div>
    ) : (
      <>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-5 w-5"
        />
        Continue with Google
      </>
    )}
  </button>
</div>
      
          {/* Mobile Image */}
          <div className="lg:hidden mt-8 flex justify-center">
            <img src={workspaceImage} alt="Workspace illustration" className="w-64 h-auto opacity-20" />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-purple-600 via-indigo-600 to-blue-700 items-center justify-center p-12">
        <div className="max-w-lg w-full">
          <img src={workspaceImage} alt="Workspace illustration" className="w-full h-auto drop-shadow-2xl" />
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Community!
            </h3>
            <p className="text-lg text-purple-100 leading-relaxed">
              Start building your digital presence today. Create beautiful link collections, track performance, and connect with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
