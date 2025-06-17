
import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    email: 'admin@betulabla.org',
    fullName: 'Administrator',
    isActive: true
  },
  {
    id: '2',
    username: 'coordinator',
    role: 'coordinator',
    email: 'coordinator@betulabla.org',
    fullName: 'Field Coordinator',
    isActive: true
  },
  {
    id: '3',
    username: 'staff',
    role: 'staff',
    email: 'staff@betulabla.org',
    fullName: 'Staff Member',
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('betul_abla_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your Django backend
    const foundUser = mockUsers.find(u => u.username === username && u.isActive);
    
    if (foundUser && password === 'password123') { // Mock password check
      setUser(foundUser);
      localStorage.setItem('betul_abla_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('betul_abla_user');
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
