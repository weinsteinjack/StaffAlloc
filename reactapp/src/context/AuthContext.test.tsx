import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { AuthProvider, useAuth } from './AuthContext';

const mockEmployees = [
  {
    id: 1,
    full_name: 'Priya Patel',
    email: 'priya.patel@example.com',
    system_role: 'PM',
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    full_name: 'Alex Analyst',
    email: 'alex.analyst@example.com',
    system_role: 'Employee',
    is_active: true,
    created_at: '',
    updated_at: ''
  }
] as const;

vi.mock('../api/users', () => ({
  fetchEmployees: vi.fn(async () => mockEmployees)
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('signs in portfolio managers', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login({ email: mockEmployees[0].email, password: 'secret' });
    });

    expect(result.current.user?.email).toEqual(mockEmployees[0].email);
    expect(localStorage.getItem('staffalloc-auth')).toBeTruthy();
  });

  it('rejects employees without manager access', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await expect(
      act(async () => {
        await result.current.login({ email: mockEmployees[1].email, password: 'secret' });
      })
    ).rejects.toThrow(/Employee accounts are read-only/);
  });
});

