/**
 * Permission management API endpoints
 */
import apiClient from './client';
import type { Permission, PermissionCreate, PermissionUpdate } from '../types/auth';

export const permissionsApi = {
  /**
   * Get all permissions
   */
  getPermissions: async (includeInactive: boolean = false): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>('/permissions/', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  /**
   * Get permission by ID
   */
  getPermission: async (permissionId: number): Promise<Permission> => {
    const response = await apiClient.get<Permission>(`/permissions/${permissionId}`);
    return response.data;
  },

  /**
   * Create new permission
   */
  createPermission: async (data: PermissionCreate): Promise<Permission> => {
    const response = await apiClient.post<Permission>('/permissions/', data);
    return response.data;
  },

  /**
   * Update permission
   */
  updatePermission: async (permissionId: number, data: PermissionUpdate): Promise<Permission> => {
    const response = await apiClient.put<Permission>(`/permissions/${permissionId}`, data);
    return response.data;
  },

  /**
   * Delete permission
   */
  deletePermission: async (permissionId: number): Promise<void> => {
    await apiClient.delete(`/permissions/${permissionId}`);
  },
};

