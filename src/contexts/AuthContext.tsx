/**
 * Authentication Context
 * Provides global authentication state and functions
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, UserResponse, LoginRequest, TokenResponse } from '../types/auth';
import { authApi, usersApi } from '../api/index';
import { setAccessToken, setRefreshToken, getAccessToken, clearTokens, TOKEN_STORAGE_KEYS } from '../utils/token';
import { checkAndRefreshToken } from '../api/client';
import { hasPermission, hasRole, isSuperuser, isAdmin } from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isSuperuser: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem(TOKEN_STORAGE_KEYS.USER);
        const token = getAccessToken();
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await usersApi.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(currentUser));
          } catch (err) {
            // Token invalid, clear everything
            clearTokens();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Check and refresh token every 5 minutes
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 5 * 60 * 1000);

    // Also check immediately
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      // Don't clear error at start - let previous errors persist until we know the result

      console.log('AuthContext.login: Starting login process...');
      const tokenResponse: TokenResponse = await authApi.login(credentials);
      console.log('AuthContext.login: Token received, storing...');
      
      // Clear any previous errors ONLY on successful login
      setError(null);
      
      // Store tokens
      setAccessToken(tokenResponse.access_token);
      setRefreshToken(tokenResponse.refresh_token);

      // Fetch user profile
      console.log('AuthContext.login: Fetching user profile...');
      const userResponse: UserResponse = await usersApi.getCurrentUser();
      console.log('AuthContext.login: User profile received:', { 
        id: userResponse.id, 
        username: userResponse.username,
        roles: userResponse.roles 
      });
      
      // Store user
      setUser(userResponse);
      localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(userResponse));
      console.log('AuthContext.login: Login complete, user authenticated');
    } catch (err: any) {
      console.error('AuthContext.login: Error occurred:', err);
      console.error('AuthContext.login: Error response:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      // Extract error message from various possible formats
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          // FastAPI typically returns errors in .detail
          if (typeof err.response.data.detail === 'string') {
            errorMessage = err.response.data.detail;
          } else if (Array.isArray(err.response.data.detail)) {
            // Sometimes FastAPI returns array of validation errors
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
      
      console.log('AuthContext.login: Setting error message:', errorMessage);
      // Set error - it will persist until cleared
      setError(errorMessage);
      clearTokens();
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      clearTokens();
      setUser(null);
      setError(null);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch (err) {
      console.error('Error during logout all:', err);
    } finally {
      clearTokens();
      setUser(null);
      setError(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userResponse = await usersApi.getCurrentUser();
      setUser(userResponse);
      localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(userResponse));
    } catch (err) {
      console.error('Error refreshing user:', err);
      // If refresh fails, user might be logged out
      clearTokens();
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkPermission = useCallback((permission: string): boolean => {
    return hasPermission(user, permission);
  }, [user]);

  const checkRole = useCallback((role: string): boolean => {
    return hasRole(user, role);
  }, [user]);

  const checkAnyRole = useCallback((roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);

  const checkSuperuser = useCallback((): boolean => {
    return isSuperuser(user);
  }, [user]);

  const checkAdmin = useCallback((): boolean => {
    return isAdmin(user);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    logoutAll,
    refreshUser,
    clearError,
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
    isSuperuser: checkSuperuser,
    isAdmin: checkAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

