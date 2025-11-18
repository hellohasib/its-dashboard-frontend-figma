/**
 * Service Detail Page
 * View and edit service details
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesApi } from '../api/index';
import type { Service, ServiceCreate, ServiceUpdate } from '../types/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const serviceId = isNew ? null : parseInt(id || '0', 10);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServiceCreate | ServiceUpdate>({
    name: '',
    description: '',
    base_url: '',
  });

  useEffect(() => {
    if (!isNew && serviceId) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getService(serviceId!);
      setService(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        base_url: data.base_url,
        is_active: data.is_active,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isNew) {
        const newService = await servicesApi.createService(formData as ServiceCreate);
        navigate(`/services/${newService.id}`);
      } else if (serviceId) {
        const updatedService = await servicesApi.updateService(serviceId, formData as ServiceUpdate);
        setService(updatedService);
        setSuccess('Service updated successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-text">Loading service...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/services')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-dark">
            {isNew ? 'Create New Service' : service ? `Edit Service: ${service.name}` : 'Service Detail'}
          </h1>
          <p className="text-sm text-primary-text mt-1">
            {isNew ? 'Add a new system service' : 'Manage service details and configuration'}
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
            <Card title="Service Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Service Name</label>
                  <Input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Base URL</label>
                  <Input
                    type="text"
                    value={formData.base_url || ''}
                    onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                    placeholder="https://api.example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter service description"
                    className="w-full px-4 py-2 border border-stroke rounded-lg text-sm text-dark placeholder-primary-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            {!isNew && (
              <Card title="Service Status">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData as ServiceUpdate).is_active ?? true}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked } as ServiceUpdate)
                    }
                    className="w-4 h-4 text-primary border-stroke rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-dark">Active</span>
                </label>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {service && (
              <Card title="Service Information">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-primary-text mb-1">Status</p>
                    <p className={`text-dark font-medium ${service.is_active ? 'text-[#409261]' : 'text-[#FF746A]'}`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-text mb-1">Created</p>
                    <p className="text-dark font-medium">
                      {new Date(service.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-text mb-1">Last Updated</p>
                    <p className="text-dark font-medium">
                      {new Date(service.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/services')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !formData.name || !formData.base_url}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : isNew ? 'Create Service' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceDetail;

