import apiClient from './api';
import type { Allocation, AllocationWithDetails, AllocationsQueryParams } from '../types/api.types';

/**
 * Allocations Service
 * Handles all allocation-related API calls
 */
export const allocationsService = {
  /**
   * Get all allocations with optional filtering
   */
  async getAllocations(params?: AllocationsQueryParams): Promise<AllocationWithDetails[]> {
    const response = await apiClient.get<AllocationWithDetails[]>('/allocations', { params });
    return response.data;
  },

  /**
   * Get allocations for a specific employee
   */
  async getEmployeeAllocations(employeeId: number): Promise<Allocation[]> {
    const response = await apiClient.get<Allocation[]>(`/employees/${employeeId}/allocations`);
    return response.data;
  },

  /**
   * Get allocations for a specific project
   */
  async getProjectAllocations(projectId: number): Promise<Allocation[]> {
    const response = await apiClient.get<Allocation[]>(`/projects/${projectId}/allocations`);
    return response.data;
  },

  /**
   * Create a new allocation
   */
  async createAllocation(data: Partial<Allocation>): Promise<Allocation> {
    const response = await apiClient.post<Allocation>('/allocations', data);
    return response.data;
  },

  /**
   * Update an existing allocation
   */
  async updateAllocation(id: number, data: Partial<Allocation>): Promise<Allocation> {
    const response = await apiClient.put<Allocation>(`/allocations/${id}`, data);
    return response.data;
  },

  /**
   * Delete an allocation
   */
  async deleteAllocation(id: number): Promise<void> {
    await apiClient.delete(`/allocations/${id}`);
  },
};

export default allocationsService;
