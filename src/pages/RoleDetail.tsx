/**
 * Role Detail Page
 * View and edit role details with permissions
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rolesApi } from '../api/index';
import type { Role, RoleCreate, RoleUpdate, PermissionSummary, Permission } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import PermissionBadge from '../components/PermissionBadge';
import RoleBadge from '../components/RoleBadge';
import { groupPermissionsByResource } from '../utils/permissions';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

const RoleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const roleId = isNew ? null : parseInt(id || '0', 10);

  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<PermissionSummary[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<RoleCreate | RoleUpdate>({
    name: '',
    description: '',
    permission_ids: [],
  });

  useEffect(() => {
    if (!isNew && roleId) {
      loadRole();
    }
    loadPermissions();
  }, [id]);

  const loadRole = async () => {
    try {
      setLoading(true);
      const data = await rolesApi.getRole(roleId!);
      setRole(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        permission_ids: data.permissions.map((p) => p.id),
        is_active: data.is_active,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load role');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await rolesApi.getPermissions(false);
      setPermissions(data);
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isNew) {
        const newRole = await rolesApi.createRole(formData as RoleCreate);
        navigate(`/roles/${newRole.id}`);
      } else if (roleId) {
        const updatedRole = await rolesApi.updateRole(roleId, formData as RoleUpdate);
        setRole(updatedRole);
        setSuccess('Role updated successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    const currentPermissions = formData.permission_ids || [];
    if (currentPermissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permission_ids: currentPermissions.filter((p) => p !== permissionId),
      });
    } else {
      setFormData({
        ...formData,
        permission_ids: [...currentPermissions, permissionId],
      });
    }
  };

  // Convert PermissionSummary[] to Permission[] for grouping
  const permissionsAsFull: Permission[] = permissions.map(p => ({
    ...p,
    created_at: '',
    updated_at: '',
  }));
  const groupedPermissions = groupPermissionsByResource(permissionsAsFull);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-text">Loading role...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/roles')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-dark">
            {isNew ? 'Create New Role' : role ? `Edit Role: ${role.name}` : 'Role Detail'}
          </h1>
          <p className="text-sm text-primary-text mt-1">
            {isNew ? 'Create a new role with permissions' : 'Manage role details and permissions'}
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-[#FFE9E6] border border-[#FF746A] rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF746A] flex-shrink-0" />
          <p className="text-sm text-[#FF746A]">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-[#E9FFEF] border border-[#409261] rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#409261] flex-shrink-0" />
          <p className="text-sm text-[#409261]">{success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Role Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Role Name</label>
                  <Input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter role name"
                    required
                    disabled={role?.is_system}
                  />
                  {role?.is_system && (
                    <p className="text-xs text-primary-text mt-1">System roles cannot be renamed</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter role description"
                    className="w-full px-4 py-2 border border-stroke rounded-lg text-sm text-dark placeholder-primary-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card title="Permissions">
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                  <div key={resource}>
                    <h4 className="text-sm font-semibold text-dark mb-3 capitalize">{resource}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {resourcePermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={(formData.permission_ids || []).includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                          />
                          <PermissionBadge permission={permission} />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {role && (
              <Card title="Role Information">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-primary-text mb-1">Type</p>
                    <RoleBadge role={role.name} isSystem={role.is_system} />
                  </div>
                  <div>
                    <p className="text-primary-text mb-1">Status</p>
                    <p className="text-dark font-medium">
                      {role.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-text mb-1">Created</p>
                    <p className="text-dark font-medium">
                      {new Date(role.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-text mb-1">Permissions Count</p>
                    <p className="text-dark font-medium">{role.permissions.length}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/roles')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !formData.name}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : isNew ? 'Create Role' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleDetail;

