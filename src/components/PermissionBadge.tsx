/**
 * Permission Badge Component
 * Displays permission with color coding by resource
 */
import React from 'react';
import type { Permission, PermissionSummary } from '../types/auth';

interface PermissionBadgeProps {
  permission: Permission | PermissionSummary | string;
  className?: string;
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission, className = '' }) => {
  const getPermissionInfo = () => {
    if (typeof permission === 'string') {
      const [resource, action] = permission.split(':');
      return { resource, action, name: permission };
    }
    return {
      resource: permission.resource,
      action: permission.action,
      name: permission.name,
    };
  };

  const { resource, action, name } = getPermissionInfo();

  // Color coding by resource
  const getResourceColor = (resource: string) => {
    const colors: Record<string, string> = {
      user: 'bg-blue-100 text-blue-700',
      role: 'bg-purple-100 text-purple-700',
      anpr: 'bg-green-100 text-green-700',
      camera: 'bg-orange-100 text-orange-700',
      service: 'bg-pink-100 text-pink-700',
      report: 'bg-indigo-100 text-indigo-700',
    };
    return colors[resource.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getResourceColor(
        resource
      )} ${className}`}
      title={name}
    >
      {resource}:{action}
    </span>
  );
};

export default PermissionBadge;

