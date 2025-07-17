
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setTokens, clearTokens, getAuthToken } from '../services/api';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'coordinator' | 'staff';
  email: string;
  fullName: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = getAuthToken();
      const storedUser = localStorage.getItem('betul_abla_user');
      
      if (token && storedUser) {
        // Validate stored user data
        const userData = JSON.parse(storedUser);
        
        // Verify token is still valid by making a profile request
        const isValid = await validateToken();
        
        if (isValid) {
          setUser(userData);
        } else {
          // Token is invalid, clear everything
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const response = await authAPI.getProfile();
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authAPI.refreshToken();
      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, data.refresh);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login(username, password);
      
      if (response.ok) {
        const data = await response.json();
        
        // Store tokens
        setTokens(data.access, data.refresh);
        
        // Get user profile
        const profileResponse = await authAPI.getProfile();
        
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          const user: User = {
            id: userData.id,
            username: userData.username,
            role: userData.role,
            email: userData.email,
            fullName: userData.full_name || `${userData.first_name} ${userData.last_name}`.trim(),
            isActive: userData.is_active
          };
          
          // Check if user is active
          if (!user.isActive) {
            handleLogout();
            return { success: false, message: 'Your account has been deactivated. Please contact an administrator.' };
          }
          
          setUser(user);
          localStorage.setItem('betul_abla_user', JSON.stringify(user));
          
          return { success: true };
        } else {
          return { success: false, message: 'Failed to fetch user profile. Please try again.' };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.detail || errorData.message || 'Invalid username or password.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    clearTokens();
  };

  const logout = () => {
    handleLogout();
  };

  const contextValue: AuthContextType = {
    user, 
    login, 
    logout, 
    isLoading, 
    isAuthenticated,
    refreshToken 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
