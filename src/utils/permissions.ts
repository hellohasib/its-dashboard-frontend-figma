/**
 * Permission and role checking utilities
 */
import type { User, Permission } from '../types/auth';

/**
 * Check if user has a specific permission
 * Note: This is a simplified check. In production, you should fetch
 * the actual permissions from the API or include them in the user object.
 * For now, we check based on roles (superuser has all, admin has most).
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }
  
  // Superusers have all permissions
  if (user.is_superuser) {
    return true;
  }
  
  // Admin role typically has most permissions
  if (user.roles.includes('admin')) {
    // Admin has most permissions except superuser-only ones
    if (permission.includes('role:') && permission.includes('delete')) {
      // Only superuser can delete system roles
      return false;
    }
    return true;
  }
  
  // For other roles, you would check against actual permissions
  // This requires fetching permissions from the API or including them in user object
  // For now, return false for specific permission checks
  return false;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) {
    return false;
  }
  
  return user.roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles) {
    return false;
  }
  
  return roles.some(role => user.roles.includes(role));
};

/**
 * Check if user is superuser
 */
export const isSuperuser = (user: User | null): boolean => {
  return user?.is_superuser ?? false;
};

/**
 * Check if user is admin (has admin role or is superuser)
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.is_superuser || hasRole(user, 'admin');
};

/**
 * Group permissions by resource
 */
export const groupPermissionsByResource = (permissions: Permission[]): Record<string, Permission[]> => {
  return permissions.reduce((acc, permission) => {
    const resource = permission.resource;
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

/**
 * Format permission name for display
 */
export const formatPermissionName = (permission: Permission | string): string => {
  if (typeof permission === 'string') {
    return permission.replace(':', ' - ').replace(/([A-Z])/g, ' $1').trim();
  }
  return `${permission.resource} - ${permission.action}`;
};

