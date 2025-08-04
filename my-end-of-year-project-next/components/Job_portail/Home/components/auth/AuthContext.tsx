'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'job_seeker' | 'technician' | 'recruiter' | 'enterprise';
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

function isError(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as Record<string, unknown>).message === 'string';
}

async function safeParseJSON(response: Response): Promise<any | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1/auth';

  useEffect(() => {
    void checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await safeParseJSON(response);
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch (error: unknown) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Login failed. Please check your credentials.';
        toast.error(msg);
        throw new Error(msg);
      }
      if (!data || !data.token) {
        const errMsg = 'Login failed: Invalid server response.';
        toast.error(errMsg);
        throw new Error(errMsg);
      }
      localStorage.setItem('auth_token', data.token);
      toast.success('Login successful! Welcome back.');
      await checkAuthStatus();
      return true;
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An unexpected error occurred during login.');
      throw new Error('An unexpected error occurred during login.');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Registration failed.';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Registration successful! Please verify your email.');
      return true;
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An unexpected error occurred during registration.');
      throw new Error('An unexpected error occurred during registration.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error: unknown) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      toast.info('Logged out.');
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to send reset email.';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Password reset instructions sent to your email.');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred while sending reset instructions.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      const params = new URLSearchParams({ token, newPassword });
      const response = await fetch(`${API_BASE_URL}/reset-password?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to reset password.';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Password has been reset successfully.');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred during password reset.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to verify email.';
        toast.error(msg);
        throw new Error(msg);
      }
      if (user) setUser({ ...user, isEmailVerified: true });
      toast.success('Email verified successfully!');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred during email verification.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const resendVerification = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to resend verification code.';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Verification code sent to your email.');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred while resending code.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated.');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to update profile.';
        toast.error(msg);
        throw new Error(msg);
      }
      setUser(data.user);
      toast.success('Profile updated successfully.');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred while updating profile.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated.');
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        const msg = (data && data.message) || 'Failed to change password.';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Password changed successfully.');
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        throw error;
      }
      toast.error('An error occurred while changing password.');
      throw new Error('An unexpected error occurred.');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
