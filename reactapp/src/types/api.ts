export type ProjectStatus = 'Planning' | 'Active' | 'Closed' | 'On Hold';

export interface UserSummary {
  id: number;
  full_name: string;
  email: string;
}

export type SystemRole = 'Admin' | 'Director' | 'PM' | 'Employee';

export interface Role {
  id: number;
  name: string;
  description?: string | null;
}

export interface RoleInput {
  name: string;
  description?: string | null;
}

export type RoleUpdateInput = Partial<RoleInput>;

export interface LCAT {
  id: number;
  name: string;
  description?: string | null;
}

export interface LCATInput {
  name: string;
  description?: string | null;
}

export type LCATUpdateInput = Partial<LCATInput>;

export interface Project {
  id: number;
  name: string;
  code: string;
  client?: string | null;
  start_date: string;
  sprints: number;
  status: ProjectStatus;
  manager_id?: number | null;
  manager?: UserSummary | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectListItem extends Project {}

export interface MonthlyHourOverride {
  id: number;
  project_id: number;
  year: number;
  month: number;
  overridden_hours: number;
}

export interface Allocation {
  id: number;
  project_assignment_id: number;
  year: number;
  month: number;
  allocated_hours: number;
}

export interface ProjectAssignment {
  id: number;
  project_id: number;
  user_id: number;
  role_id: number;
  lcat_id: number;
  funded_hours: number;
  created_at: string;
  updated_at: string;
  project: Project;
  user: UserSummary;
  role: Role;
  lcat: LCAT;
  allocations?: Allocation[];
}

export interface ProjectAssignmentWithAllocations extends ProjectAssignment {
  allocations: Allocation[];
}

export interface ProjectWithDetails extends Project {
  assignments: ProjectAssignment[];
  monthly_hour_overrides: MonthlyHourOverride[];
}

export interface User extends UserSummary {
  system_role: SystemRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeListItem extends User {}

export interface UserCreateInput {
  email: string;
  full_name: string;
  password: string;
  system_role: SystemRole;
  is_active?: boolean;
}

export interface UserWithAssignments extends User {
  assignments: ProjectAssignment[];
}

export interface UserAllocationSummaryItem {
  year: number;
  month: number;
  total_hours: number;
}

export interface ProjectCreateInput {
  name: string;
  code: string;
  client?: string | null;
  start_date: string;
  sprints: number;
}

export interface ProjectAssignmentCreateInput {
  project_id: number;
  user_id: number;
  role_id: number;
  lcat_id: number;
  funded_hours: number;
}

export interface AllocationInput {
  project_assignment_id: number;
  year: number;
  month: number;
  allocated_hours: number;
}

export interface MonthlyHourOverrideInput {
  project_id: number;
  year: number;
  month: number;
  overridden_hours: number;
}

export interface OverAllocatedEmployee {
  user_id: number;
  full_name: string;
  total_hours: number;
  fte_percentage: number;
  role?: string | null;
  projects?: Array<{
    project_id: number;
    project_name: string;
    allocated_hours: number;
  }>;
}

export interface BenchEmployee extends OverAllocatedEmployee {
  available_hours?: number;
}

export interface PortfolioDashboard {
  total_projects: number;
  total_employees: number;
  overall_utilization_pct: number;
  fte_by_role: Record<string, number>;
  over_allocated_employees: OverAllocatedEmployee[];
  bench_employees: BenchEmployee[];
}

export interface BurnDownDataPoint {
  label: string;
  planned_hours?: number;
  actual_hours?: number;
  sprint_index?: number;
  date?: string;
}

export interface ProjectDashboard {
  project_id: number;
  project_name: string;
  total_funded_hours: number;
  total_allocated_hours: number;
  utilization_pct: number;
  burn_down_data: BurnDownDataPoint[];
}

export interface EmployeeTimelineEntry {
  year: number;
  month: number;
  total_hours: number;
  allocations?: Array<{
    assignment_id?: number;
    project_id: number;
    project_name: string;
    allocated_hours: number;
  }>;
}

export interface EmployeeTimeline {
  employee_id: number;
  employee_name: string;
  timeline: EmployeeTimelineEntry[];
}

export interface UtilizationByRoleItem {
  role_id?: number;
  role_name?: string;
  total_hours: number;
  fte_percentage?: number;
}

export interface UtilizationByRoleResponse {
  year: number;
  month: number;
  utilization_by_role: UtilizationByRoleItem[];
  message?: string;
}

export interface ChatQueryRequest {
  query: string;
  context_limit?: number;
}

export interface ChatQueryResponse {
  query: string;
  answer: string;
  sources: string[];
}

export interface StaffingRecommendationRequestPayload {
  project_id: number;
  role_id: number;
  year: number;
  month: number;
  required_hours: number;
}

export interface StaffingRecommendationCandidate {
  user_id?: number;
  full_name?: string;
  current_fte?: number;
  skills?: string[];
  reasoning?: string;
  [key: string]: unknown;
}

export interface StaffingRecommendationResponse {
  candidates: StaffingRecommendationCandidate[];
  reasoning: string;
}

export interface ConflictsResponse {
  conflicts: Array<Record<string, unknown>>;
  message?: string;
}

export interface ForecastResponse {
  forecast_period_months: number;
  predictions: Array<Record<string, unknown>>;
  message?: string;
}

export interface BalanceSuggestionsResponse {
  suggestions: Array<Record<string, unknown>>;
  message?: string;
}

export interface ReindexResponse {
  status: string;
  message: string;
}

