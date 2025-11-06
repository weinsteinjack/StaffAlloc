import apiClient from './api';
import type { AuthResponse, LoginCredentials, User } from '../types/api.types';

/**
 * Authentication Service
 * Handles all authentication-related API calls including login, logout, and token management
 */
export const authService = {
  /**
   * Login user with username and password
   * Stores access and refresh tokens in localStorage upon success
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // FastAPI expects form data for OAuth2 password flow
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Store tokens in localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
  },

  /**
   * Logout user by clearing tokens from localStorage
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Get the current authenticated user's information
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Check if user has a valid access token
   * Note: This only checks if token exists, not if it's valid or expired
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },
};

export default authService;
