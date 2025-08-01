import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  profile?: {
    full_name: string;
    phone?: string;
    bio?: string;
    resume_url?: string;
    profile_image_url?: string;
    city?: string;
    state?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'job_seeker' | 'recruiter') => Promise<boolean>;
  register: (email: string, password: string, username: string, role: 'job_seeker' | 'recruiter') => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User['profile']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'job_seeker' | 'recruiter'): Promise<boolean> => {
    // Mock login - in real app this would call your API
    const mockUser: User = {
      user_id: 1,
      username: email.split('@')[0],
      email,
      role,
      profile: {
        full_name: role === 'job_seeker' ? 'John Doe' : 'Jane Smith',
        city: 'San Francisco',
        state: 'CA',
        bio: role === 'job_seeker' ? 'Experienced software developer' : 'HR Manager at TechCorp'
      }
    };
    setUser(mockUser);
    return true;
  };

  const register = async (email: string, password: string, username: string, role: 'job_seeker' | 'recruiter'): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      user_id: Math.floor(Math.random() * 1000),
      username,
      email,
      role,
      profile: {
        full_name: username,
      }
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (profileData: Partial<User['profile']>) => {
    if (user) {
      setUser({
        ...user,
        profile: { ...user.profile, ...profileData }
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};