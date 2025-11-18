/**
 * User management API endpoints
 */
import apiClient from './client';
import type {
  UserResponse,
  UserUpdate,
  AdminUserUpdate,
  PasswordChange,
  UserRolesUpdate,
} from '../types/auth';

export const usersApi = {
  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UserUpdate): Promise<UserResponse> => {
    const response = await apiClient.patch<UserResponse>('/users/me', data);
    return response.data;
  },

  /**
   * Change current user password
   */
  changePassword: async (data: PasswordChange): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/users/me/change-password', data);
    return response.data;
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (skip: number = 0, limit: number = 100): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/users', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Update user (admin only)
   */
  updateUser: async (userId: number, data: AdminUserUpdate): Promise<UserResponse> => {
    const response = await apiClient.patch<UserResponse>(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Update user roles (admin only)
   */
  updateUserRoles: async (userId: number, roles: string[]): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(`/users/${userId}/roles`, {
      roles,
    } as UserRolesUpdate);
    return response.data;
  },
};

