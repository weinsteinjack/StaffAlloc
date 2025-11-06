import api from './client';
import type {
  EmployeeTimeline,
  PortfolioDashboard,
  ProjectDashboard,
  UtilizationByRoleResponse
} from '../types/api';

export async function fetchPortfolioDashboard(): Promise<PortfolioDashboard> {
  const { data } = await api.get<PortfolioDashboard>('/reports/portfolio-dashboard');
  return data;
}

export async function fetchProjectDashboard(projectId: number): Promise<ProjectDashboard> {
  const { data } = await api.get<ProjectDashboard>(`/reports/project-dashboard/${projectId}`);
  return data;
}

export interface TimelineFilters {
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
}

export async function fetchEmployeeTimeline(
  employeeId: number,
  filters: TimelineFilters = {}
): Promise<EmployeeTimeline> {
  const { data } = await api.get<EmployeeTimeline>(`/reports/employee-timeline/${employeeId}`, {
    params: filters
  });
  return data;
}

export async function fetchUtilizationByRole(
  year: number,
  month: number
): Promise<UtilizationByRoleResponse> {
  const { data } = await api.get<UtilizationByRoleResponse>('/reports/utilization-by-role', {
    params: { year, month }
  });
  return data;
}

export async function exportPortfolioToExcel(): Promise<Blob> {
  const { data } = await api.get<Blob>('/reports/export/portfolio', { responseType: 'blob' });
  return data;
}

export async function exportProjectToExcel(projectId: number): Promise<Blob> {
  const { data } = await api.get<Blob>(`/reports/export/project/${projectId}`, {
    responseType: 'blob'
  });
  return data;
}

