import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { User, LoginCredentials, AuthState } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          
          if (currentUser) {
            setAuthState({
              user: currentUser,
              token,
              refreshToken: localStorage.getItem('refresh_token'),
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Token is invalid, clear auth state
            await logout();
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to initialize authentication' 
        }));
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const authResponse = await authService.login(credentials);
      
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redirect to dashboard after successful login
      navigate('/dashboard');
      
      return authResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      // Redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authService.refreshToken();
      setAuthState(prev => ({ ...prev, token: newToken }));
      return newToken;
    } catch (error) {
      await logout();
      throw error;
    }
  }, [logout]);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const updatedUser = await authService.updateProfile(userData);
      
      setAuthState(prev => ({ 
        ...prev, 
        user: updatedUser, 
        isLoading: false 
      }));
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.changePassword(currentPassword, newPassword);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    clearError,
  };
};
