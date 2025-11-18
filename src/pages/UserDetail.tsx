/**
 * User Detail Page
 * View and edit user details
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usersApi, rolesApi } from '../api/index';
import type { UserResponse, AdminUserUpdate, RoleListItem } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import RoleBadge from '../components/RoleBadge';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Edit, Eye } from 'lucide-react';

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const viewOnly = searchParams.get('view') === 'true';
  const isNew = id === 'new';
  const userId = isNew ? null : parseInt(id || '0', 10);

  const [user, setUser] = useState<UserResponse | null>(null);
  const [availableRoles, setAvailableRoles] = useState<RoleListItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdminUserUpdate>({
    full_name: '',
    phone: '',
    department: '',
    is_active: true,
    is_verified: false,
    roles: [],
  });

  useEffect(() => {
    if (!isNew && userId) {
      loadUser();
    }
    loadRoles();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const users = await usersApi.getAllUsers(0, 1000);
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setFormData({
          full_name: foundUser.full_name || '',
          phone: foundUser.phone || '',
          department: foundUser.department || '',
          is_active: foundUser.is_active,
          is_verified: foundUser.is_verified,
          roles: foundUser.roles || [],
        });
      } else {
        setError('User not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const roles = await rolesApi.getRoles();
      setAvailableRoles(Array.isArray(roles) ? roles : []);
    } catch (err) {
      console.error('Failed to load roles:', err);
      setAvailableRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || viewOnly) return;

    try {
      setSaving(true);
      setError(null);
      await usersApi.updateUser(userId, formData);
      setSuccess('User updated successfully!');
      await loadUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleName: string) => {
    if (viewOnly) return;
    const currentRoles = formData.roles || [];
    if (currentRoles.includes(roleName)) {
      setFormData({
        ...formData,
        roles: currentRoles.filter((r) => r !== roleName),
      });
    } else {
      setFormData({
        ...formData,
        roles: [...currentRoles, roleName],
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || loadingRoles) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-text">Loading {loading ? 'user' : 'roles'}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-dark">
              {viewOnly && <Eye className="inline w-6 h-6 mr-2" />}
              {!viewOnly && <Edit className="inline w-6 h-6 mr-2" />}
              {isNew ? 'Create New User' : user ? `${viewOnly ? 'View' : 'Edit'} User: ${user.username}` : 'User Detail'}
            </h1>
            <p className="text-sm text-primary-text mt-1">
              {isNew ? 'Create a new user account' : viewOnly ? 'View user details and permissions' : 'Manage user details and permissions'}
            </p>
          </div>
        </div>
        {viewOnly && user && (
          <Button onClick={() => navigate(`/users/${userId}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        )}
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
            <Card title="User Information">
              <div className="space-y-4">
                {user && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">ID</label>
                      <Input type="text" value={`#${user.id}`} disabled />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Username</label>
                      <Input type="text" value={user.username} disabled />
                      <p className="text-xs text-primary-text mt-1">Username cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Email</label>
                      <Input type="email" value={user.email} disabled />
                      <p className="text-xs text-primary-text mt-1">Email cannot be changed</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                    disabled={viewOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Phone</label>
                  <Input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    disabled={viewOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Department</label>
                  <Input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department"
                    disabled={viewOnly}
                  />
                </div>
              </div>
            </Card>

            <Card title="Account Status">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                    disabled={viewOnly}
                  />
                  <div>
                    <span className="text-sm font-medium text-dark">Active</span>
                    <p className="text-xs text-primary-text">User can login and access the system</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_verified ?? false}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                    disabled={viewOnly}
                  />
                  <div>
                    <span className="text-sm font-medium text-dark">Verified</span>
                    <p className="text-xs text-primary-text">Email has been verified</p>
                  </div>
                </label>

                {user?.is_superuser && (
                  <div className="flex items-center gap-3 pt-2 border-t border-stroke">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-purple-600">Superuser</span>
                      <p className="text-xs text-primary-text">Has full system access</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="User Roles">
              <div className="space-y-3">
                {!Array.isArray(availableRoles) || availableRoles.length === 0 ? (
                  <p className="text-sm text-primary-text">No roles available</p>
                ) : (
                  availableRoles.map((role) => (
                    <label
                      key={role.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        formData.roles?.includes(role.name)
                          ? 'bg-blue-50 border-primary'
                          : 'border-stroke hover:bg-gray-50'
                      } ${viewOnly ? '' : 'cursor-pointer'} transition-colors`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.roles?.includes(role.name) ?? false}
                        onChange={() => toggleRole(role.name)}
                        className="mt-0.5 w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                        disabled={viewOnly}
                      />
                      <div className="flex-1">
                        <RoleBadge role={role.name} isSystem={role.is_system} />
                        {role.description && (
                          <p className="text-xs text-primary-text mt-1">{role.description}</p>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </Card>

            {user && (
              <Card title="Account Details">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-primary-text">Created</p>
                    <p className="text-dark font-medium">{formatDate(user.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-primary-text">Last Updated</p>
                    <p className="text-dark font-medium">{formatDate(user.updated_at)}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!viewOnly && (
          <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/users')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserDetail;
