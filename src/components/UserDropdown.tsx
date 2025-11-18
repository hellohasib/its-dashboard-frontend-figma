/**
 * User Dropdown Component
 * Displays user profile dropdown in header
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

const UserDropdown: React.FC = () => {
  const { user, logout, logoutAll, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to logout from all devices?')) {
      await logoutAll();
      navigate('/login');
    }
  };

  const userInitials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-dark3 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
          {userInitials}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-dark dark:text-gray-200">{user.full_name || user.username}</p>
          <p className="text-xs text-primary-text dark:text-gray-400">{user.roles[0] || 'User'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-primary-text dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark dark:border-gray-700 rounded-2xl border border-stroke shadow-lg z-50 overflow-hidden">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-stroke dark:border-gray-700">
            <p className="text-sm font-semibold text-dark dark:text-gray-200">{user.full_name || user.username}</p>
            <p className="text-xs text-primary-text dark:text-gray-400">{user.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-primary rounded-md"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-dark3 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            {hasRole('super_admin') && (
              <button
                onClick={() => {
                  navigate('/users');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-dark3 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Administration
              </button>
            )}

            <div className="border-t border-stroke dark:border-gray-700 my-1"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-dark3 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            <button
              onClick={handleLogoutAll}
              className="w-full px-4 py-2 text-left text-sm text-primary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-dark3 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout All Devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

