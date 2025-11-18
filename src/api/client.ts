/**
 * API Client with Axios
 * Handles authentication, token refresh, and error handling
 */
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, TOKEN_REFRESH_THRESHOLD } from '../config/api';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens, isTokenExpiringSoon } from '../utils/token';
import type { TokenResponse } from '../types/auth';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        clearTokens();
        processQueue(error, null);
        isRefreshing = false;
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post<TokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        setAccessToken(access_token);
        if (new_refresh_token) {
          setRefreshToken(new_refresh_token);
        }

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        // Only redirect if we're not already on the login page
        clearTokens();
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // For other errors, log them but don't redirect automatically
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

// Function to check and refresh token proactively
export const checkAndRefreshToken = async (): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return;
  }

  // Check if token is expiring soon
  if (isTokenExpiringSoon(accessToken, TOKEN_REFRESH_THRESHOLD)) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return;
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token: new_refresh_token } = response.data;
      setAccessToken(access_token);
      if (new_refresh_token) {
        setRefreshToken(new_refresh_token);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Don't clear tokens here, let the interceptor handle it
    }
  }
};

export default apiClient;

