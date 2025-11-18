/**
 * RequireRole Component
 * Conditionally renders children based on role
 */
import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RequireRoleProps {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface RequireAnyRoleProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  children,
  fallback = null,
}) => {
  const { hasRole } = useAuth();

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export const RequireAnyRole: React.FC<RequireAnyRoleProps> = ({
  roles,
  children,
  fallback = null,
}) => {
  const { hasAnyRole } = useAuth();

  if (hasAnyRole(roles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RequireRole;

