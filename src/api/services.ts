/**
 * Service management API endpoints
 */
import apiClient from './client';
import type { Service, ServiceCreate, ServiceUpdate } from '../types/auth';

export const servicesApi = {
  /**
   * Get all services
   */
  getServices: async (includeInactive: boolean = false): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services/', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  /**
   * Get service by ID
   */
  getService: async (serviceId: number): Promise<Service> => {
    const response = await apiClient.get<Service>(`/services/${serviceId}`);
    return response.data;
  },

  /**
   * Create new service
   */
  createService: async (data: ServiceCreate): Promise<Service> => {
    const response = await apiClient.post<Service>('/services/', data);
    return response.data;
  },

  /**
   * Update service
   */
  updateService: async (serviceId: number, data: ServiceUpdate): Promise<Service> => {
    const response = await apiClient.put<Service>(`/services/${serviceId}`, data);
    return response.data;
  },

  /**
   * Delete service
   */
  deleteService: async (serviceId: number): Promise<void> => {
    await apiClient.delete(`/services/${serviceId}`);
  },
};

