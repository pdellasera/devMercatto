import apiService from './api';
import { LoginCredentials, AuthResponse, User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Store tokens
        apiService.setAuthToken(response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails, clear local storage
      console.warn('Logout API call failed, clearing local storage anyway');
    } finally {
      // Clear all auth data
      apiService.removeAuthToken();
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data) {
        apiService.setAuthToken(response.data.token);
        return response.data.token;
      } else {
        throw new Error(response.message || 'Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!apiService.isAuthenticated()) {
        return null;
      }

      const response = await apiService.get<User>('/auth/me');
      
      if (response.success && response.data) {
        // Update stored user info
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<User>('/auth/profile', userData);
      
      if (response.success && response.data) {
        // Update stored user info
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  getToken(): string | null {
    return apiService.getAuthToken();
  }
}

export const authService = new AuthService();
export default authService;
