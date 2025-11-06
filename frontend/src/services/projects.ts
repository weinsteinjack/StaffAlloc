import apiClient from './api';
import type { Project, CreateProjectRequest, ProjectsQueryParams } from '../types/api.types';

/**
 * Projects Service
 * Handles all project-related API calls
 */
export const projectsService = {
  /**
   * Get all projects with optional filtering and pagination
   */
  async getProjects(params?: ProjectsQueryParams): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/projects', { params });
    return response.data;
  },

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  /**
   * Update an existing project
   */
  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const response = await apiClient.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  /**
   * Get project assignments (employees on project)
   */
  async getProjectAssignments(projectId: number): Promise<any[]> {
    const response = await apiClient.get(`/projects/${projectId}/assignments`);
    return response.data;
  },
};

export default projectsService;
