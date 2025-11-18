/**
 * API Configuration
 */

// Get API base URL from environment or use default
const getApiBaseUrl = (): string => {
  // In production, the frontend is served from the same container as the API
  // So we can use relative URLs
  if (import.meta.env.PROD) {
    return '/api/v1';
  }
  
  // In development, use the backend URL
  return import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Token storage keys
export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'atms_access_token',
  REFRESH_TOKEN: 'atms_refresh_token',
  USER: 'atms_user',
} as const;

// Token refresh threshold (refresh 5 minutes before expiration)
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

