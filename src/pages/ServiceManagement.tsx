/**
 * Service Management Page
 * List and manage all services
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../api/index';
import type { Service } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import { Search, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const ServiceManagement: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicesApi.getServices(false);
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: number, serviceName: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
      return;
    }

    try {
      await servicesApi.deleteService(serviceId);
      await loadServices();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message || 'Failed to delete service');
    }
  };

  const filteredServices = Array.isArray(services) ? services.filter((service) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      service.name.toLowerCase().includes(searchLower) ||
      service.base_url.toLowerCase().includes(searchLower) ||
      (service.description && service.description.toLowerCase().includes(searchLower))
    );
  }) : [];

  const columns = [
    {
      key: 'name',
      label: 'Service Name',
      render: (_value: any, service: Service) => (
        <div>
          <p className="font-medium text-dark">{service.name}</p>
          {service.description && (
            <p className="text-xs text-primary-text">{service.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'base_url',
      label: 'Base URL',
      render: (_value: any, service: Service) => (
        <span className="text-sm text-dark font-mono">{service.base_url}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, service: Service) => (
        <span className={`text-sm ${service.is_active ? 'text-[#409261]' : 'text-[#FF746A]'}`}>
          {service.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, service: Service) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/services/${service.id}`)}
            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Service"
          >
            <Edit className="w-4 h-4" />
          </button>
            <button
              onClick={() => handleDelete(service.id, service.name)}
              className="p-2 text-[#FF746A] hover:bg-[#FFE9E6] rounded-lg transition-colors"
              title="Delete Service"
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
          <h1 className="text-2xl font-semibold text-dark">Service Management</h1>
          <p className="text-sm text-primary-text mt-1">Manage system services and their access</p>
        </div>
        <Button onClick={() => navigate('/services/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
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
          placeholder="Search services by name, URL, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Services Table */}
      <Card title={`Services (${filteredServices.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary-text">Loading services...</p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-text">No services found</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredServices} />
        )}
      </Card>
    </div>
  );
};

export default ServiceManagement;

