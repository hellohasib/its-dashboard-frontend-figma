/**
 * Permission Management Page
 * Manage system permissions (super_admin only)
 */
import React, { useState, useEffect } from 'react';
import { permissionsApi } from '../api/index';
import type { Permission, PermissionCreate, PermissionUpdate } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Search, Plus, Edit, Trash2, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<PermissionCreate>({
    name: '',
    resource: '',
    action: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadPermissions();
  }, [includeInactive]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsApi.getPermissions(includeInactive);
      setPermissions(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter((permission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      permission.name.toLowerCase().includes(searchLower) ||
      permission.resource.toLowerCase().includes(searchLower) ||
      permission.action.toLowerCase().includes(searchLower) ||
      (permission.description && permission.description.toLowerCase().includes(searchLower))
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      setError(null);
      await permissionsApi.createPermission(formData);
      setSuccess('Permission created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
      loadPermissions();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to create permission');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermission) return;

    try {
      setModalLoading(true);
      setError(null);
      const updateData: PermissionUpdate = {
        name: formData.name,
        resource: formData.resource,
        action: formData.action,
        description: formData.description,
        is_active: formData.is_active,
      };
      await permissionsApi.updatePermission(selectedPermission.id, updateData);
      setSuccess('Permission updated successfully!');
      setIsEditModalOpen(false);
      setSelectedPermission(null);
      resetForm();
      loadPermissions();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update permission');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPermission) return;

    try {
      setModalLoading(true);
      setError(null);
      await permissionsApi.deletePermission(selectedPermission.id);
      setSuccess('Permission deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedPermission(null);
      loadPermissions();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete permission');
    } finally {
      setModalLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description || '',
      is_active: permission.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      resource: '',
      action: '',
      description: '',
      is_active: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (_value: any, permission: Permission) => (
        <span className="text-sm font-mono text-primary-text">#{permission.id}</span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_value: any, permission: Permission) => (
        <span className="font-medium text-dark">{permission.name}</span>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      sortable: true,
      render: (_value: any, permission: Permission) => (
        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">{permission.resource}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (_value: any, permission: Permission) => (
        <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">{permission.action}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (_value: any, permission: Permission) => (
        <span className="text-sm text-dark">{permission.description || '-'}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (_value: any, permission: Permission) => (
        permission.is_active ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        )
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (_value: any, permission: Permission) => (
        <span className="text-sm text-primary-text whitespace-nowrap">
          {formatDate(permission.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, permission: Permission) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(permission)}
            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Permission"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(permission)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Permission"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-dark">Permission Management</h1>
              <p className="text-sm text-primary-text mt-1">
                Manage system permissions (Super Admin Only)
              </p>
            </div>
          </div>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Permission
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-[#E9FFEF] border border-[#409261] rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#409261] flex-shrink-0" />
          <p className="text-sm text-[#409261]">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-[#FFE9E6] border border-[#FF746A] rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF746A] flex-shrink-0" />
          <p className="text-sm text-[#FF746A]">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search permissions by name, resource, action, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
            />
            <span className="text-sm text-dark">Show Inactive</span>
          </label>
        </div>
      </Card>

      {/* Permissions Table */}
      <Card title={`Permissions (${filteredPermissions.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary-text">Loading permissions...</p>
            </div>
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-primary-text">No permissions found</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredPermissions} />
        )}
      </Card>

      {/* Create Permission Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !modalLoading && setIsCreateModalOpen(false)}
        title="Create New Permission"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Permission Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., user:read"
              required
              disabled={modalLoading}
            />
            <p className="text-xs text-primary-text mt-1">Unique identifier for the permission</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Resource *</label>
            <Input
              type="text"
              value={formData.resource}
              onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
              placeholder="e.g., user, camera, anpr"
              required
              disabled={modalLoading}
            />
            <p className="text-xs text-primary-text mt-1">The resource this permission applies to</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Action *</label>
            <Input
              type="text"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              placeholder="e.g., read, write, delete, manage"
              required
              disabled={modalLoading}
            />
            <p className="text-xs text-primary-text mt-1">The action allowed on the resource</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of what this permission allows"
              rows={3}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={modalLoading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                disabled={modalLoading}
              />
              <span className="text-sm text-dark">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={modalLoading}>
              {modalLoading ? 'Creating...' : 'Create Permission'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Permission Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !modalLoading && setIsEditModalOpen(false)}
        title="Edit Permission"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Permission Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={modalLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Resource *</label>
            <Input
              type="text"
              value={formData.resource}
              onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
              required
              disabled={modalLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Action *</label>
            <Input
              type="text"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              required
              disabled={modalLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={modalLoading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                disabled={modalLoading}
              />
              <span className="text-sm text-dark">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={modalLoading}>
              {modalLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !modalLoading && setIsDeleteModalOpen(false)}
        title="Delete Permission"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              Are you sure you want to delete the permission <strong>{selectedPermission?.name}</strong>?
            </p>
            <p className="text-xs text-red-600 mt-2">
              This action cannot be undone. The permission will be removed from all roles.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={modalLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {modalLoading ? 'Deleting...' : 'Delete Permission'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PermissionManagement;

