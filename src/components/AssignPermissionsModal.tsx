/**
 * Assign Permissions Modal Component
 * Modal for assigning and removing permissions from roles
 */
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import PermissionBadge from './PermissionBadge';
import { rolesApi } from '../api/index';
import type { Role, PermissionSummary, Permission } from '../types/auth';
import { Save, AlertCircle, CheckCircle, Shield, Search } from 'lucide-react';
import { groupPermissionsByResource } from '../utils/permissions';
import Input from './Input';

interface AssignPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSuccess: () => void;
}

const AssignPermissionsModal: React.FC<AssignPermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}) => {
  const [availablePermissions, setAvailablePermissions] = useState<PermissionSummary[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && role) {
      loadPermissions();
      setSelectedPermissions(role.permissions.map(p => p.id));
      setError(null);
      setSuccess(null);
      setSearchTerm('');
    }
  }, [isOpen, role]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const perms = await rolesApi.getPermissions(false);
      setAvailablePermissions(Array.isArray(perms) ? perms : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load permissions');
      setAvailablePermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const toggleAll = (permissionIds: number[]) => {
    const allSelected = permissionIds.every(id => selectedPermissions.includes(id));
    if (allSelected) {
      // Remove all
      setSelectedPermissions(selectedPermissions.filter(id => !permissionIds.includes(id)));
    } else {
      // Add all
      const newSelection = [...selectedPermissions];
      permissionIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      setSelectedPermissions(newSelection);
    }
  };

  const handleSave = async () => {
    if (!role) return;

    try {
      setSaving(true);
      setError(null);
      await rolesApi.updateRole(role.id, { permission_ids: selectedPermissions });
      setSuccess('Permissions updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    const originalIds = role?.permissions.map(p => p.id).sort() || [];
    const currentIds = [...selectedPermissions].sort();
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds);
  };

  const getPermissionChanges = () => {
    const originalIds = role?.permissions.map(p => p.id) || [];
    const added = selectedPermissions.filter(id => !originalIds.includes(id));
    const removed = originalIds.filter(id => !selectedPermissions.includes(id));
    return { added, removed };
  };

  // Filter and group permissions
  const filteredPermissions = availablePermissions.filter(p => {
    const search = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(search) ||
           p.resource.toLowerCase().includes(search) ||
           p.action.toLowerCase().includes(search);
  });

  const permissionsAsFull: Permission[] = filteredPermissions.map(p => ({
    ...p,
    created_at: '',
    updated_at: '',
  }));
  const groupedPermissions = groupPermissionsByResource(permissionsAsFull);

  const changes = getPermissionChanges();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Permissions" size="xl">
      <div className="space-y-6">
        {/* Role Info */}
        {role && (
          <div className="bg-gray-50 rounded-lg p-4 border border-stroke">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-primary-text mt-1">{role.description}</p>
                )}
                <p className="text-xs text-primary-text mt-2">
                  Currently has {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                </p>
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

        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search permissions by name, resource, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Permissions List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-dark">Select Permissions</h4>
            <p className="text-xs text-primary-text">
              {selectedPermissions.length} of {availablePermissions.length} selected
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-primary-text">Loading permissions...</p>
              </div>
            </div>
          ) : availablePermissions.length === 0 ? (
            <p className="text-sm text-primary-text py-4 text-center">No permissions available</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
                const resourceIds = resourcePermissions.map(p => p.id);
                const allSelected = resourceIds.every(id => selectedPermissions.includes(id));
                
                return (
                  <div key={resource} className="border border-stroke rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-dark capitalize">{resource}</h5>
                      <button
                        type="button"
                        onClick={() => toggleAll(resourceIds)}
                        className="text-xs text-primary hover:underline"
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {resourcePermissions.map((permission) => {
                        const isSelected = selectedPermissions.includes(permission.id);
                        const wasOriginal = role?.permissions.some(p => p.id === permission.id);
                        const isNew = isSelected && !wasOriginal;
                        const isRemoved = !isSelected && wasOriginal;

                        return (
                          <label
                            key={permission.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-blue-50 border border-primary' : 'hover:bg-gray-50 border border-transparent'
                            } ${isNew ? 'ring-1 ring-green-500' : ''} ${isRemoved ? 'ring-1 ring-red-500' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                              disabled={saving}
                            />
                            <div className="flex-1 min-w-0">
                              <PermissionBadge permission={permission} />
                              {isNew && (
                                <span className="text-xs text-green-600 ml-1">+</span>
                              )}
                              {isRemoved && (
                                <span className="text-xs text-red-600 ml-1">-</span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Changes Summary */}
        {hasChanges() && (
          <div className="bg-blue-50 rounded-lg p-4 border border-primary">
            <h4 className="text-sm font-medium text-dark mb-2">Changes Summary</h4>
            <div className="space-y-2 text-sm">
              {changes.added.length > 0 && (
                <div>
                  <span className="text-green-700 font-medium">
                    Adding {changes.added.length} permission{changes.added.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {changes.removed.length > 0 && (
                <div>
                  <span className="text-red-700 font-medium">
                    Removing {changes.removed.length} permission{changes.removed.length !== 1 ? 's' : ''}
                  </span>
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

export default AssignPermissionsModal;

