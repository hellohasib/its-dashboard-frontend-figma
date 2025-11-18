/**
 * Assign Roles Modal Component
 * Modal for assigning and revoking user roles
 */
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import RoleBadge from './RoleBadge';
import { usersApi, rolesApi } from '../api/index';
import type { UserResponse, RoleListItem } from '../types/auth';
import { Save, AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface AssignRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onSuccess: () => void;
}

const AssignRolesModal: React.FC<AssignRolesModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [availableRoles, setAvailableRoles] = useState<RoleListItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadRoles();
      setSelectedRoles(user.roles || []);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, user]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const roles = await rolesApi.getRoles();
      setAvailableRoles(Array.isArray(roles) ? roles : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load roles');
      setAvailableRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      await usersApi.updateUserRoles(user.id, selectedRoles);
      setSuccess('Roles updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update roles');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    const originalRoles = user?.roles || [];
    if (selectedRoles.length !== originalRoles.length) return true;
    return !selectedRoles.every((role) => originalRoles.includes(role));
  };

  const getRoleChanges = () => {
    const originalRoles = user?.roles || [];
    const added = selectedRoles.filter((role) => !originalRoles.includes(role));
    const removed = originalRoles.filter((role) => !selectedRoles.includes(role));
    return { added, removed };
  };

  const changes = getRoleChanges();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Roles" size="lg">
      <div className="space-y-6">
        {/* User Info */}
        {user && (
          <div className="bg-gray-50 rounded-lg p-4 border border-stroke">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark">{user.username}</h3>
                <p className="text-sm text-primary-text">{user.email}</p>
                {user.full_name && (
                  <p className="text-sm text-primary-text mt-1">{user.full_name}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="p-3 bg-[#FFE9E6] border border-[#FF746A] rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF746A] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#FF746A]">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-[#E9FFEF] border border-[#409261] rounded-lg flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#409261] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#409261]">{success}</p>
          </div>
        )}

        {/* Roles List */}
        <div>
          <h4 className="text-sm font-medium text-dark mb-3">Select Roles</h4>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-primary-text">Loading roles...</p>
              </div>
            </div>
          ) : availableRoles.length === 0 ? (
            <p className="text-sm text-primary-text py-4 text-center">No roles available</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableRoles.map((role) => {
                const isSelected = selectedRoles.includes(role.name);
                const wasOriginal = user?.roles?.includes(role.name);
                const isNew = isSelected && !wasOriginal;
                const isRemoved = !isSelected && wasOriginal;

                return (
                  <label
                    key={role.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-primary'
                        : 'border-stroke hover:bg-gray-50'
                    } ${isNew ? 'ring-2 ring-green-500' : ''} ${
                      isRemoved ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRole(role.name)}
                      className="mt-1 w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                      disabled={saving}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <RoleBadge role={role.name} isSystem={role.is_system} />
                        {isNew && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            Adding
                          </span>
                        )}
                        {isRemoved && (
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            Removing
                          </span>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-xs text-primary-text">{role.description}</p>
                      )}
                      {!role.is_active && (
                        <p className="text-xs text-orange-600 mt-1">⚠️ This role is inactive</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        {hasChanges() && (
          <div className="bg-blue-50 rounded-lg p-4 border border-primary">
            <h4 className="text-sm font-medium text-dark mb-2">Changes Summary</h4>
            <div className="space-y-2 text-sm">
              {changes.added.length > 0 && (
                <div>
                  <span className="text-green-700 font-medium">Adding ({changes.added.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {changes.added.map((role) => (
                      <span
                        key={role}
                        className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {changes.removed.length > 0 && (
                <div>
                  <span className="text-red-700 font-medium">Removing ({changes.removed.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {changes.removed.map((role) => (
                      <span
                        key={role}
                        className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-stroke">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges() || loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignRolesModal;

