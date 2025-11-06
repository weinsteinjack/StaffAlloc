import apiClient from './api';
import type { Employee } from '../types/api.types';

/**
 * Employee Service
 * Handles all employee-related API calls
 */
export const employeesService = {
  /**
   * Get all employees with optional pagination
   */
  async getEmployees(params?: { skip?: number; limit?: number }): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>('/employees', { params });
    return response.data;
  },

  /**
   * Get a single employee by ID
   */
  async getEmployee(id: number): Promise<Employee> {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  /**
   * Create a new employee
   */
  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data;
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },
};

export default employeesService;
