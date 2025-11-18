/**
 * User Status Badge Component
 * Displays user status (Active/Inactive/Locked)
 */
import React from 'react';
import type { User } from '../types/auth';
import StatusBadge from './StatusBadge';

interface UserStatusBadgeProps {
  user: User;
  className?: string;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ user, className = '' }) => {
  if (!user.is_active) {
    return <StatusBadge status="inactive" className={className} />;
  }

  // Check if user is locked (would need additional field in User type)
  // For now, just show active/inactive
  return <StatusBadge status="active" className={className} />;
};

export default UserStatusBadge;

