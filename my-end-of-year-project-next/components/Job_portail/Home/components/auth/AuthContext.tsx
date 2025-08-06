'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/fetchWithAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'job_seeker' | 'technician' | 'recruiter' | 'enterprise' | 'admin';
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
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
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

// Helper function to decode JWT and extract email
function decodeJWTEmail(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.sub || null;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1/auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Checks current authentication status by verifying user and loading profile
  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Get stored token and extract email from it
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const email = decodeJWTEmail(token);
      if (!email) {
        console.error('Failed to extract email from JWT');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('email');
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Use fetchWithAuth to automatically attach Bearer token
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to verify user');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('email');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('email');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void checkAuthStatus();
  }, []);

  // Login function: authenticates, saves token & email, loads user, redirects
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeParseJSON(response);

      if (!response.ok || !data?.token) {
        toast.error(data?.message || 'Login failed. Please check your credentials.');
        return false;
      }

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('email', email);
      toast.success('Login successful!');

      // Extract email from JWT token instead of using the login email
      const jwtEmail = decodeJWTEmail(data.token);
      if (!jwtEmail) {
        toast.error('Failed to extract user information from token');
        return false;
      }

      console.log('JWT email extracted:', jwtEmail);

      // Load user profile using fetchWithAuth to include Bearer token and send extracted email in body
      const userResponse = await fetchWithAuth('http://localhost:8088/api/v1/sharedPlus/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: jwtEmail }),
      });

      if (!userResponse.ok) {
        toast.error('Failed to fetch user data');
        return false;
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Redirect based on user role
      const role = userData.role?.toUpperCase();

      switch (role) {
        case 'ADMIN':
          router.push('/Job/Admin');
          break;
        case 'TECHNICIAN':
          router.push('/Job/Technician');
          break;
        case 'JOB_SEEKER':
          router.push('/Job/JobSeeker');
          break;
        case 'ENTERPRISE':
          router.push('/Job/Enterprise');
          break;
        default:
          router.push('/');
          break;
      }

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
        toast.error(data?.message || 'Registration failed.');
        return false;
      }

      toast.success('Registration successful! Please verify your email.');
      return true;
    } catch (error) {
      toast.error('An unexpected error occurred during registration.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('email');
      setUser(null);
      toast.info('Logged out.');
      router.push('/'); // Redirect home on logout
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        toast.error(data?.message || 'Failed to send reset email.');
        throw new Error(data?.message || 'Failed to send reset email.');
      }
      toast.success('Password reset instructions sent to your email.');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred while sending reset instructions.');
      throw error;
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
        toast.error(data?.message || 'Failed to reset password.');
        throw new Error(data?.message || 'Failed to reset password.');
      }
      toast.success('Password has been reset successfully.');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred during password reset.');
      throw error;
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
        toast.error(data?.message || 'Failed to verify email.');
        throw new Error(data?.message || 'Failed to verify email.');
      }
      if (user) setUser({ ...user, isEmailVerified: true });
      toast.success('Email verified successfully!');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred during email verification.');
      throw error;
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
        toast.error(data?.message || 'Failed to resend verification code.');
        throw new Error(data?.message || 'Failed to resend verification code.');
      }
      toast.success('Verification code sent to your email.');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred while resending code.');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        toast.error(data?.message || 'Failed to update profile.');
        throw new Error(data?.message || 'Failed to update profile.');
      }
      setUser(data.user);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred while updating profile.');
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        toast.error(data?.message || 'Failed to change password.');
        throw new Error(data?.message || 'Failed to change password.');
      }
      toast.success('Password changed successfully.');
    } catch (error) {
      toast.error(isError(error) ? error.message : 'An error occurred while changing password.');
      throw error;
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