import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'job_seeker' | 'recruiter' | 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'test@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          username: 'Test User',
          email,
          role: role as User['role'],
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string, role: string): Promise<boolean> => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Date.now().toString(),
        username,
        email,
        role: role as User['role'],
      };
      
      setUser(userData);
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}