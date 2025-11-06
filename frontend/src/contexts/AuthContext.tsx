import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types/api.types';

/**
 * Authentication Context Type
 * Defines the shape of the authentication context
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

/**
 * Create the Authentication Context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state and provides it to all child components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check if user already has a token (from previous session)
      if (authService.isAuthenticated()) {
        try {
          // Try to fetch current user info to validate token
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Token might be expired or invalid, clear it
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   * Authenticates user and updates state
   */
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err; // Re-throw so the login page can handle it
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * Clears authentication state and tokens
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
