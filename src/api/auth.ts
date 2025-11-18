/**
 * Authentication API endpoints
 */
import apiClient from './client';
import type { LoginRequest, TokenResponse, RefreshTokenRequest, UserRegister, UserResponse } from '../types/auth';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    console.log('authApi.login called:', { 
      username: credentials.username, 
      url: `${apiClient.defaults.baseURL}/auth/login` 
    });
    try {
      const response = await apiClient.post<TokenResponse>('/auth/login', credentials);
      console.log('Login API response received:', { 
        hasToken: !!response.data.access_token,
        tokenType: response.data.token_type 
      });
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData: UserRegister): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    } as RefreshTokenRequest);
    return response.data;
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Logout from all devices
   */
  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout-all');
  },
};

