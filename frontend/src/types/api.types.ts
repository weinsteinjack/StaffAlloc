// API Type Definitions for StaffAlloc

// User & Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  system_role: 'Admin' | 'Director' | 'PM' | 'Employee';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Employee Types
export interface Employee {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role_id?: number;
  lcat_id?: number;
  is_active: boolean;
  created_at: string;
}

// Project Types
export interface Project {
  id: number;
  code: string;
  name: string;
  client: string | null;
  start_date: string;
  sprints: number;
  status: 'Planning' | 'Active' | 'On Hold' | 'Closed';
  manager_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  code: string;
  name: string;
  client: string;
  start_date: string;
  sprints: number;
}

// Allocation Types
export interface Allocation {
  id: number;
  project_assignment_id: number;
  year: number;
  month: number;
  allocated_hours: number;
}

export interface AllocationWithDetails extends Allocation {
  project_code?: string;
  project_name?: string;
  employee_name?: string;
  employee_email?: string;
}

// Project Assignment Types
export interface ProjectAssignment {
  id: number;
  project_id: number;
  user_id: number;
  role_id: number;
  lcat_id: number;
  funded_hours: number;
  employee_name: string;
  employee_email: string;
  role_name: string;
  lcat_name: string;
  allocations: Allocation[];
}

// Role & LCAT Types
export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface LCAT {
  id: number;
  name: string;
  description?: string;
}

// Query Params
export interface ProjectsQueryParams {
  skip?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface AllocationsQueryParams {
  start_date?: string;
  end_date?: string;
  project_id?: number;
  employee_id?: number;
}

// API Error Response
export interface ApiError {
  detail: string;
  status_code?: number;
}
