/**
 * Role Management Page
 * List and manage all roles
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rolesApi } from '../api/index';
import type { RoleListItem } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import RoleBadge from '../components/RoleBadge';
import { Search, Plus, Edit, Trash2, AlertCircle, Shield } from 'lucide-react';
import AssignPermissionsModal from '../components/AssignPermissionsModal';
import type { Role } from '../types/auth';

const RoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rolesApi.getRoles(0, 100);
      setRoles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: number, roleName: string) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    try {
      await rolesApi.deleteRole(roleId);
      await loadRoles();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message || 'Failed to delete role');
    }
  };

  const handleOpenPermissionsModal = async (roleListItem: RoleListItem) => {
    try {
      // Fetch full role details with permissions
      const fullRole = await rolesApi.getRole(roleListItem.id);
      setSelectedRole(fullRole);
      setIsPermissionsModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load role details');
    }
  };

  const handleClosePermissionsModal = () => {
    setIsPermissionsModalOpen(false);
    setSelectedRole(null);
  };

  const handlePermissionsUpdated = () => {
    loadRoles();
  };

  const filteredRoles = Array.isArray(roles) ? roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      role.name.toLowerCase().includes(searchLower) ||
      (role.description && role.description.toLowerCase().includes(searchLower))
    );
  }) : [];

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      render: (_value: any, role: RoleListItem) => (
        <div>
          <div className="flex items-center gap-2">
            <RoleBadge role={role.name} isSystem={role.is_system} />
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (_value: any, role: RoleListItem) => (
        <span className="text-dark">{role.description || '-'}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (_value: any, role: RoleListItem) => (
        <span className="text-sm text-primary-text">
          {role.is_system ? 'System' : 'Custom'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, role: RoleListItem) => (
        <span className={`text-sm ${role.is_active ? 'text-[#409261]' : 'text-[#FF746A]'}`}>
          {role.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, role: RoleListItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/roles/${role.id}`)}
            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Role"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenPermissionsModal(role)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Assign Permissions"
          >
            <Shield className="w-4 h-4" />
          </button>
          {!role.is_system && (
            <button
              onClick={() => handleDelete(role.id, role.name)}
              className="p-2 text-[#FF746A] hover:bg-[#FFE9E6] rounded-lg transition-colors"
              title="Delete Role"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Role Management</h1>
          <p className="text-sm text-primary-text mt-1">Manage roles and their permissions</p>
        </div>
        <Button onClick={() => navigate('/roles/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-[#FFE9E6] border border-[#FF746A] rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF746A] flex-shrink-0" />
          <p className="text-sm text-[#FF746A]">{error}</p>
        </div>
      )}

      {/* Search */}
      <Card>
        <Input
          type="search"
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Roles Table */}
      <Card title={`Roles (${filteredRoles.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary-text">Loading roles...</p>
            </div>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-text">No roles found</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredRoles} />
        )}
      </Card>

      {/* Assign Permissions Modal */}
      <AssignPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={handleClosePermissionsModal}
        role={selectedRole}
        onSuccess={handlePermissionsUpdated}
      />
    </div>
  );
};

export default RoleManagement;

