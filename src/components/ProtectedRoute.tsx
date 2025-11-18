/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePermission?: string;
  requireRole?: string;
  requireAnyRole?: string[];
  requireSuperuser?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePermission,
  requireRole,
  requireAnyRole,
  requireSuperuser,
  requireAdmin,
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole, hasAnyRole, isSuperuser, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permission requirement
  if (requirePermission && !hasPermission(requirePermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-primary-text">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-primary-text">You don't have the required role to access this page.</p>
        </div>
      </div>
    );
  }

  // Check any role requirement
  if (requireAnyRole && requireAnyRole.length > 0 && !hasAnyRole(requireAnyRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-primary-text">You don't have the required role to access this page.</p>
        </div>
      </div>
    );
  }

  // Check superuser requirement
  if (requireSuperuser && !isSuperuser()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-primary-text">Superuser access required.</p>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-primary-text">Admin access required.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

