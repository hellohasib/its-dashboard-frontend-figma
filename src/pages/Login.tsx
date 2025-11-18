/**
 * Login Page
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import { LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Initialize error from sessionStorage to persist across remounts
  const [loginError, setLoginError] = useState<string | null>(() => {
    return sessionStorage.getItem('login_error');
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Persist error to sessionStorage so it survives remounts
  useEffect(() => {
    if (loginError) {
      sessionStorage.setItem('login_error', loginError);
    } else {
      sessionStorage.removeItem('login_error');
    }
  }, [loginError]);

  // Redirect if already authenticated or after successful login
  useEffect(() => {
    if (isAuthenticated) {
      // Clear error from sessionStorage on successful auth
      sessionStorage.removeItem('login_error');
      setLoginError(null);
      
      // Get the original destination or default to dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear previous error ONLY at the start of a new attempt
    setLoginError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      // Clear error on success
      setLoginError(null);
      // Navigation will happen automatically via useEffect when isAuthenticated becomes true
      // isSubmitting will be reset when component redirects/unmounts
    } catch (err: any) {
      // Extract error message from various possible locations
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response?.data) {
        // Try different common error response formats
        if (err.response.data.detail) {
          if (typeof err.response.data.detail === 'string') {
            errorMessage = err.response.data.detail;
          } else if (Array.isArray(err.response.data.detail)) {
            errorMessage = err.response.data.detail.map((e: any) => 
              e.msg || e.message || JSON.stringify(e)
            ).join(', ');
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Set error - this should persist until explicitly cleared
      setLoginError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleDismissError = () => {
    sessionStorage.removeItem('login_error');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stroke shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-dark mb-2">ATMS Login</h1>
            <p className="text-sm text-primary-text">
              Automated Traffic Management System
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-[#FFE9E6] border border-[#FF746A] rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF746A] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#FF746A]">
                  {loginError}
                </p>
              </div>
              <button
                onClick={handleDismissError}
                className="text-[#FF746A] hover:text-[#FF5744] transition-colors text-xl font-bold leading-none"
                aria-label="Dismiss error"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                disabled={isSubmitting || isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isSubmitting || isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !username || !password}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-primary-text">
              Forgot your password? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

