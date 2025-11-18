/**
 * Authentication and Authorization TypeScript interfaces
 */

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  phone: string | null;
  department: string | null;
  roles: string[];
  created_at: string;
  updated_at: string;
}

// UserResponse is the same as User (API response format)
export type UserResponse = User;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserRegister {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  department?: string;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
  department?: string;
}

export interface AdminUserUpdate {
  full_name?: string;
  phone?: string;
  department?: string;
  notes?: string;
  is_active?: boolean;
  is_verified?: boolean;
  roles?: string[];
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

export interface UserRolesUpdate {
  roles: string[];
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionSummary {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  is_active: boolean;
}

export interface PermissionCreate {
  name: string;
  resource: string;
  action: string;
  description?: string;
  is_active?: boolean;
}

export interface PermissionUpdate {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
  is_active?: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface RoleListItem {
  id: number;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
  permission_ids?: number[];
  is_system?: boolean;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permission_ids?: number[];
  is_active?: boolean;
}

export interface RoleServiceAccess {
  role_id: number;
  service_id: number;
  can_access: boolean;
  notes?: string;
}

export interface RoleServiceAccessUpdate {
  can_access: boolean;
  notes?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  base_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  name: string;
  description?: string;
  base_url: string;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  base_url?: string;
  is_active?: boolean;
}

