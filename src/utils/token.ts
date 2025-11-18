/**
 * Token utilities for JWT token management
 */
import { TOKEN_STORAGE_KEYS } from '../config/api';

// Re-export for use in AuthContext
export { TOKEN_STORAGE_KEYS };

export interface TokenData {
  sub: string;
  type: string;
  exp: number;
}

/**
 * Store access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Store refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Remove all tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.USER);
};

/**
 * Decode JWT token (base64 decode, no verification)
 */
export const decodeToken = (token: string): TokenData | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as TokenData;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  // Convert expiration timestamp (seconds) to milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
};

/**
 * Check if token will expire soon (within threshold)
 */
export const isTokenExpiringSoon = (token: string, thresholdMs: number): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;
  
  return timeUntilExpiration <= thresholdMs;
};

/**
 * Get time until token expiration in milliseconds
 */
export const getTimeUntilExpiration = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return Math.max(0, expirationTime - currentTime);
};

