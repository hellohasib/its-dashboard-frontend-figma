/**
 * Role management API endpoints
 */
import apiClient from './client';
import type {
  Role,
  RoleListItem,
  RoleCreate,
  RoleUpdate,
  PermissionSummary,
  RoleServiceAccess,
  RoleServiceAccessUpdate,
} from '../types/auth';

export const rolesApi = {
  /**
   * Get all roles
   */
  getRoles: async (skip: number = 0, limit: number = 100): Promise<RoleListItem[]> => {
    const response = await apiClient.get<RoleListItem[]>('/roles/', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRole: async (roleId: number): Promise<Role> => {
    const response = await apiClient.get<Role>(`/roles/${roleId}`);
    return response.data;
  },

  /**
   * Create new role
   */
  createRole: async (data: RoleCreate): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles/', data);
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (roleId: number, data: RoleUpdate): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${roleId}`, data);
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (roleId: number): Promise<void> => {
    await apiClient.delete(`/roles/${roleId}`);
  },

  /**
   * Get all permissions
   */
  getPermissions: async (includeInactive: boolean = false): Promise<PermissionSummary[]> => {
    const response = await apiClient.get<PermissionSummary[]>('/roles/permissions', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  /**
   * Update role service access
   */
  updateRoleServiceAccess: async (
    roleId: number,
    serviceId: number,
    data: RoleServiceAccessUpdate
  ): Promise<RoleServiceAccess> => {
    const response = await apiClient.patch<RoleServiceAccess>(
      `/roles/${roleId}/services/${serviceId}`,
      data
    );
    return response.data;
  },
};

