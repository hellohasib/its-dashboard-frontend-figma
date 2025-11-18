/**
 * User Management Page
 * List and manage all users
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../api/index';
import type { UserResponse } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import RoleBadge from '../components/RoleBadge';
import AssignRolesModal from '../components/AssignRolesModal';
import { Search, Plus, Edit, Eye, AlertCircle, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [skip]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getAllUsers(skip, limit);
      setUsers(data);
      setTotal(data.length); // In a real app, you'd get total from API
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRolesModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsRolesModalOpen(true);
  };

  const handleCloseRolesModal = () => {
    setIsRolesModalOpen(false);
    setSelectedUser(null);
  };

  const handleRolesUpdated = () => {
    loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchLower))
    );
  });

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
      render: (_value: any, user: UserResponse) => (
        <span className="text-sm font-mono text-primary-text">#{user.id}</span>
      ),
    },
    {
      key: 'username',
      label: 'Username / Email',
      sortable: true,
      render: (_value: any, user: UserResponse) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-dark">{user.username}</p>
          <p className="text-xs text-primary-text truncate">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'full_name',
      label: 'Full Name',
      sortable: true,
      render: (_value: any, user: UserResponse) => (
        <span className="text-dark whitespace-nowrap">{user.full_name || '-'}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (_value: any, user: UserResponse) => (
        <span className="text-sm text-dark whitespace-nowrap">{user.phone || '-'}</span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (_value: any, user: UserResponse) => (
        <span className="text-sm text-dark">{user.department || '-'}</span>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (_value: any, user: UserResponse) => (
        <div className="flex flex-wrap gap-1 min-w-[120px]">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => <RoleBadge key={role} role={role} />)
          ) : (
            <span className="text-xs text-primary-text">No roles</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, user: UserResponse) => (
        <div className="flex flex-col gap-1">
          {user.is_active ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              Inactive
            </span>
          )}
          {user.is_verified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              Verified
            </span>
          )}
          {user.is_superuser && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
              Superuser
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      sortable: true,
      render: (_value: any, user: UserResponse) => (
        <span className="text-sm text-primary-text whitespace-nowrap">
          {formatDate(user.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, user: UserResponse) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/users/${user.id}?view=true`)}
            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/users/${user.id}`)}
            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenRolesModal(user)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Assign Roles"
          >
            <Shield className="w-4 h-4" />
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
          <h1 className="text-2xl font-semibold text-dark">User Management</h1>
          <p className="text-sm text-primary-text mt-1">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => navigate('/users/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

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
              placeholder="Search users by username, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card title={`Users (${filteredUsers.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary-text">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-text">No users found</p>
          </div>
        ) : (
          <>
            <Table columns={columns} data={filteredUsers} />
            {/* Pagination */}
            <div className="mt-6 pt-6 border-t border-stroke flex items-center justify-between">
              <p className="text-sm text-primary-text">
                Showing <span className="font-medium">{skip + 1}</span> to{' '}
                <span className="font-medium">{Math.min(skip + limit, total)}</span> of{' '}
                <span className="font-medium">{total}</span> users
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(skip + limit)}
                  disabled={skip + limit >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Assign Roles Modal */}
      <AssignRolesModal
        isOpen={isRolesModalOpen}
        onClose={handleCloseRolesModal}
        user={selectedUser}
        onSuccess={handleRolesUpdated}
      />
    </div>
  );
};

export default UserManagement;

