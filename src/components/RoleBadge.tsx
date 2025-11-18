/**
 * Role Badge Component
 * Displays role with different styles for system vs custom roles
 */
import React from 'react';

interface RoleBadgeProps {
  role: string;
  isSystem?: boolean;
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, isSystem = false, className = '' }) => {
  const getRoleStyle = () => {
    if (isSystem) {
      return 'bg-primary text-white';
    }
    return 'bg-blue-50 text-primary border border-primary';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getRoleStyle()} ${className}`}
    >
      {role}
      {isSystem && (
        <span className="ml-1 text-xs opacity-75" title="System Role">
          ⭐
        </span>
      )}
    </span>
  );
};

export default RoleBadge;

