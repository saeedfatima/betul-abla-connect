
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and validate token
    const checkAuthState = async () => {
      const token = getAuthToken();
      const storedUser = localStorage.getItem('betul_abla_user');
      
      if (token && storedUser) {
        try {
          const response = await authAPI.getProfile();
          if (response.ok) {
            const userData = await response.json();
            const user: User = {
              id: userData.id,
              username: userData.username,
              role: userData.role,
              email: userData.email,
              fullName: userData.full_name,
              isActive: userData.is_active
            };
            setUser(user);
            localStorage.setItem('betul_abla_user', JSON.stringify(user));
          } else {
            // Token is invalid, clear storage
            clearTokens();
          }
        } catch (error) {
          console.error('Error validating token:', error);
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(username, password);
      
      if (response.ok) {
        const data = await response.json();
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
            fullName: userData.full_name,
            isActive: userData.is_active
          };
          
          setUser(user);
          localStorage.setItem('betul_abla_user', JSON.stringify(user));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
