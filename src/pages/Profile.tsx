/**
 * Profile Page
 * Current user profile display and editing
 */
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usersApi } from '../api/index';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, Save, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import RoleBadge from '../components/RoleBadge';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-primary-text">Loading profile...</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await usersApi.updateProfile(formData);
      await refreshUser();
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await usersApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setSuccess('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setIsChangingPassword(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dark">My Profile</h1>
        <p className="text-sm text-primary-text mt-1">Manage your account settings and preferences</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Profile Information">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                    {user.full_name
                      ? user.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark">{user.full_name || user.username}</h3>
                    <p className="text-sm text-primary-text">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stroke">
                  <div>
                    <p className="text-xs text-primary-text mb-1">Username</p>
                    <p className="text-sm font-medium text-dark">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-text mb-1">Phone</p>
                    <p className="text-sm font-medium text-dark">{user.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-text mb-1">Department</p>
                    <p className="text-sm font-medium text-dark">{user.department || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-text mb-1">Account Status</p>
                    <p className="text-sm font-medium text-dark">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="mt-4">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Phone</label>
                  <Input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Department</label>
                  <Input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter your department"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: user.full_name || '',
                        phone: user.phone || '',
                        department: user.department || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Change Password */}
          <Card title="Change Password">
            {!isChangingPassword ? (
              <div>
                <p className="text-sm text-primary-text mb-4">
                  Update your password to keep your account secure.
                </p>
                <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, current_password: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new_password: e.target.value })
                    }
                    placeholder="Enter new password"
                    required
                  />
                  <p className="text-xs text-primary-text mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirm_password: e.target.value })
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        confirm_password: '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Roles & Permissions */}
        <div className="space-y-6">
          <Card title="Roles">
            <div className="space-y-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <RoleBadge key={role} role={role} className="mr-2 mb-2" />
                ))
              ) : (
                <p className="text-sm text-primary-text">No roles assigned</p>
              )}
            </div>
          </Card>

          <Card title="Account Information">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-primary-text">Account Created</p>
                <p className="text-dark font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-primary-text">Last Updated</p>
                <p className="text-dark font-medium">
                  {new Date(user.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-primary-text">Email Verified</p>
                <p className="text-dark font-medium">{user.is_verified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-primary-text">Superuser</p>
                <p className="text-dark font-medium">{user.is_superuser ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

