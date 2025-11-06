import api from './client';
import type { LCAT, LCATInput, LCATUpdateInput, Role, RoleInput, RoleUpdateInput } from '../types/api';

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/admin/roles/');
  return data;
}

export async function createRole(payload: RoleInput): Promise<Role> {
  const { data } = await api.post<Role>('/admin/roles/', payload);
  return data;
}

export async function updateRole(roleId: number, payload: RoleUpdateInput): Promise<Role> {
  const { data } = await api.put<Role>(`/admin/roles/${roleId}`, payload);
  return data;
}

export async function deleteRole(roleId: number): Promise<void> {
  await api.delete(`/admin/roles/${roleId}`);
}

export async function fetchLCATs(): Promise<LCAT[]> {
  const { data } = await api.get<LCAT[]>('/admin/lcats/');
  return data;
}

export async function createLCAT(payload: LCATInput): Promise<LCAT> {
  const { data } = await api.post<LCAT>('/admin/lcats/', payload);
  return data;
}

export async function updateLCAT(lcatId: number, payload: LCATUpdateInput): Promise<LCAT> {
  const { data } = await api.put<LCAT>(`/admin/lcats/${lcatId}`, payload);
  return data;
}

export async function deleteLCAT(lcatId: number): Promise<void> {
  await api.delete(`/admin/lcats/${lcatId}`);
}

