/**
 * RequirePermission Component
 * Conditionally renders children based on permission
 */
import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RequirePermission;

