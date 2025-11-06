import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * useAuth Hook
 * Provides easy access to authentication context
 *
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
