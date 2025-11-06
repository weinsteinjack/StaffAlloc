import api from './client';
import type {
  EmployeeListItem,
  User,
  UserAllocationSummaryItem,
  UserCreateInput,
  UserWithAssignments
} from '../types/api';

export async function fetchEmployees(): Promise<EmployeeListItem[]> {
  const { data } = await api.get<EmployeeListItem[]>('/employees');
  return data;
}

export async function createEmployee(payload: UserCreateInput): Promise<User> {
  const { data } = await api.post<User>('/employees', payload);
  return data;
}

export async function fetchEmployee(employeeId: number): Promise<UserWithAssignments> {
  const { data } = await api.get<UserWithAssignments>(`/employees/${employeeId}`);
  return data;
}

export async function fetchUserAllocationSummary(
  userId: number
): Promise<UserAllocationSummaryItem[]> {
  const { data } = await api.get<UserAllocationSummaryItem[]>(`/allocations/users/${userId}/summary`);
  return data;
}

