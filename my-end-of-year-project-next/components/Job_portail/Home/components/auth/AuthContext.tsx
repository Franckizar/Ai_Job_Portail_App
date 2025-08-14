'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/fetchWithAuth';

interface User {
  id: string;
  email: string;
  name: string;
  // Roles are normalized uppercase for consistency
  role:
    | 'JOB_SEEKER'
    | 'TECHNICIAN'
    | 'ENTERPRISE'
    | 'ADMIN'
    | 'PERSONAL_EMPLOYER'
    | 'UNKNOWN';
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  // Role-specific IDs
  adminId?: number;
  technicianId?: number;
  jobSeekerId?: number;
  enterpriseId?: number;
  personalEmployerId?: number;
  userId?: number;
  firstname?: string;
  lastname?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<boolean>;
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

// Helper function to decode JWT and extract payload
function decodeJWTPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Helper function to extract email from JWT
function decodeJWTEmail(token: string): string | null {
  const payload = decodeJWTPayload(token);
  return payload?.sub || null;
}

// Helper function to set both localStorage and cookies with role-based data
function setUserData(token: string, email: string, userData: any, jwtPayload: any): void {
  const secureCookieFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  const cookieOptions = `path=/; ${secureCookieFlag}SameSite=Lax`;

  // Set basic authentication in both localStorage and cookies
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('email', email);
  document.cookie = `jwt_token=${token}; ${cookieOptions}`;
  document.cookie = `email=${email}; ${cookieOptions}`;

  // Extract and normalize role
  let role: string | null = null;
  if (userData.role) {
    role = userData.role;
  } else if (Array.isArray(userData.roles) && userData.roles.length > 0) {
    role = userData.roles[0];
  } else if (userData.userRole) {
    role = userData.userRole;
  } else if (userData.authority) {
    role = userData.authority;
  } else if (Array.isArray(jwtPayload.roles) && jwtPayload.roles.length > 0) {
    role = jwtPayload.roles[0];
  }

  let normalizedRole: string = 'UNKNOWN';
  if (role) {
    normalizedRole = String(role).toUpperCase();
    if (normalizedRole.startsWith('ROLE_')) {
      normalizedRole = normalizedRole.replace('ROLE_', '');
    }
  }

  // Set role in both localStorage and cookies
  localStorage.setItem('user_role', normalizedRole);
  document.cookie = `user_role=${normalizedRole}; ${cookieOptions}`;

  // Set user basic info from JWT payload in both localStorage and cookies
  if (jwtPayload.firstname) {
    localStorage.setItem('user_firstname', jwtPayload.firstname);
    document.cookie = `user_firstname=${encodeURIComponent(jwtPayload.firstname)}; ${cookieOptions}`;
  }
  if (jwtPayload.lastname) {
    localStorage.setItem('user_lastname', jwtPayload.lastname);
    document.cookie = `user_lastname=${encodeURIComponent(jwtPayload.lastname)}; ${cookieOptions}`;
  }
  if (jwtPayload.userId) {
    localStorage.setItem('user_id', jwtPayload.userId.toString());
    document.cookie = `user_id=${jwtPayload.userId}; ${cookieOptions}`;
  }

  // Set role-specific IDs in both localStorage and cookies based on role
  switch (normalizedRole) {
    case 'ADMIN':
      if (jwtPayload.adminId) {
        localStorage.setItem('admin_id', jwtPayload.adminId.toString());
        document.cookie = `admin_id=${jwtPayload.adminId}; ${cookieOptions}`;
      }
      break;
    case 'TECHNICIAN':
      if (jwtPayload.technicianId) {
        localStorage.setItem('technician_id', jwtPayload.technicianId.toString());
        document.cookie = `technician_id=${jwtPayload.technicianId}; ${cookieOptions}`;
      }
      break;
    case 'JOB_SEEKER':
      if (jwtPayload.jobSeekerId) {
        localStorage.setItem('job_seeker_id', jwtPayload.jobSeekerId.toString());
        document.cookie = `job_seeker_id=${jwtPayload.jobSeekerId}; ${cookieOptions}`;
      }
      break;
    case 'ENTERPRISE':
      if (jwtPayload.enterpriseId) {
        localStorage.setItem('enterprise_id', jwtPayload.enterpriseId.toString());
        document.cookie = `enterprise_id=${jwtPayload.enterpriseId}; ${cookieOptions}`;
      }
      break;
    case 'PERSONAL_EMPLOYER':
      if (jwtPayload.personalEmployerId) {
        localStorage.setItem('personal_employer_id', jwtPayload.personalEmployerId.toString());
        document.cookie = `personal_employer_id=${jwtPayload.personalEmployerId}; ${cookieOptions}`;
      }
      break;
  }

  // Set additional user data from userData response in both localStorage and cookies
  if (userData.name) {
    localStorage.setItem('user_name', userData.name);
    document.cookie = `user_name=${encodeURIComponent(userData.name)}; ${cookieOptions}`;
  }
  if (userData.isEmailVerified !== undefined) {
    localStorage.setItem('email_verified', userData.isEmailVerified.toString());
    document.cookie = `email_verified=${userData.isEmailVerified}; ${cookieOptions}`;
  }
  if (userData.avatar) {
    localStorage.setItem('user_avatar', userData.avatar);
    document.cookie = `user_avatar=${encodeURIComponent(userData.avatar)}; ${cookieOptions}`;
  }
  if (userData.createdAt) {
    localStorage.setItem('user_created_at', userData.createdAt);
    document.cookie = `user_created_at=${encodeURIComponent(userData.createdAt)}; ${cookieOptions}`;
  }
  if (userData.id) {
    localStorage.setItem('user_account_id', userData.id);
    document.cookie = `user_account_id=${encodeURIComponent(userData.id)}; ${cookieOptions}`;
  }

  // Store complete user object as JSON in localStorage for easy access
  const completeUserData = {
    ...userData,
    firstname: jwtPayload.firstname || userData.firstname,
    lastname: jwtPayload.lastname || userData.lastname,
    userId: jwtPayload.userId || userData.userId,
    adminId: jwtPayload.adminId || userData.adminId,
    technicianId: jwtPayload.technicianId || userData.technicianId,
    jobSeekerId: jwtPayload.jobSeekerId || userData.jobSeekerId,
    enterpriseId: jwtPayload.enterpriseId || userData.enterpriseId,
    personalEmployerId: jwtPayload.personalEmployerId || userData.personalEmployerId,
    role: normalizedRole
  };
  localStorage.setItem('user_data', JSON.stringify(completeUserData));
}

// Helper function to clear all user-related data from both localStorage and cookies
function clearUserData(): void {
  const cookieOptions = `path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  
  // Clear localStorage
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('email');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_firstname');
  localStorage.removeItem('user_lastname');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('email_verified');
  localStorage.removeItem('user_avatar');
  localStorage.removeItem('user_created_at');
  localStorage.removeItem('user_account_id');
  localStorage.removeItem('user_data');
  
  // Clear role-specific IDs from localStorage
  localStorage.removeItem('admin_id');
  localStorage.removeItem('technician_id');
  localStorage.removeItem('job_seeker_id');
  localStorage.removeItem('enterprise_id');
  localStorage.removeItem('personal_employer_id');
  
  // Clear cookies
  document.cookie = `jwt_token=; ${cookieOptions}`;
  document.cookie = `email=; ${cookieOptions}`;
  document.cookie = `user_role=; ${cookieOptions}`;
  document.cookie = `user_firstname=; ${cookieOptions}`;
  document.cookie = `user_lastname=; ${cookieOptions}`;
  document.cookie = `user_id=; ${cookieOptions}`;
  document.cookie = `user_name=; ${cookieOptions}`;
  document.cookie = `email_verified=; ${cookieOptions}`;
  document.cookie = `user_avatar=; ${cookieOptions}`;
  document.cookie = `user_created_at=; ${cookieOptions}`;
  document.cookie = `user_account_id=; ${cookieOptions}`;
  
  // Clear role-specific ID cookies
  document.cookie = `admin_id=; ${cookieOptions}`;
  document.cookie = `technician_id=; ${cookieOptions}`;
  document.cookie = `job_seeker_id=; ${cookieOptions}`;
  document.cookie = `enterprise_id=; ${cookieOptions}`;
  document.cookie = `personal_employer_id=; ${cookieOptions}`;
}

// Conditional Secure flag for cookies (only in production)
const secureCookieFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1/auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status when app loads
  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Decode JWT to get role and ID
      const jwtPayload = decodeJWTPayload(token);
      if (!jwtPayload) {
        console.error('Failed to decode JWT');
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Determine role and corresponding ID from JWT payload
      let role: string | null = null;
      let roleSpecificId: number | null = null;

      if (jwtPayload.adminId) {
        role = 'ADMIN';
        roleSpecificId = jwtPayload.adminId;
      } else if (jwtPayload.technicianId) {
        role = 'TECHNICIAN';
        roleSpecificId = jwtPayload.technicianId;
      } else if (jwtPayload.jobSeekerId) {
        role = 'JOB_SEEKER';
        roleSpecificId = jwtPayload.jobSeekerId;
      } else if (jwtPayload.enterpriseId) {
        role = 'ENTERPRISE';
        roleSpecificId = jwtPayload.enterpriseId;
      } else if (jwtPayload.personalEmployerId) {
        role = 'PERSONAL_EMPLOYER';
        roleSpecificId = jwtPayload.personalEmployerId;
      }

      if (!role || !roleSpecificId) {
        console.error('Unable to determine user role or ID from token');
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetchWithAuth('http://localhost:8088/api/v1/sharedPlus/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: role,
          id: roleSpecificId
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Merge JWT payload data with user data
        const enrichedUserData = {
          ...userData,
          firstname: jwtPayload.firstname || userData.firstname,
          lastname: jwtPayload.lastname || userData.lastname,
          userId: jwtPayload.userId || userData.userId,
          adminId: jwtPayload.adminId || userData.adminId,
          technicianId: jwtPayload.technicianId || userData.technicianId,
          jobSeekerId: jwtPayload.jobSeekerId || userData.jobSeekerId,
          enterpriseId: jwtPayload.enterpriseId || userData.enterpriseId,
          personalEmployerId: jwtPayload.personalEmployerId || userData.personalEmployerId,
          role: role
        };
        
        setUser(enrichedUserData);
        
        // Update both localStorage and cookies with current data
        const email = jwtPayload.sub || localStorage.getItem('email');
        if (email) {
          setUserData(token, email, enrichedUserData, jwtPayload);
        }
      } else {
        console.error('Failed to verify user during auth check');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void checkAuthStatus();
  }, []);

  // Login function: saves JWT, email, and role (in localStorage and cookies)
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

      // Save token and email in localStorage (basic storage)
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('email', email);

      toast.success('Login successful!');

      // Decode JWT payload
      const jwtPayload = decodeJWTPayload(data.token);
      if (!jwtPayload) {
        toast.error('Failed to extract user info from token');
        return false;
      }

      // Determine role and corresponding ID from JWT payload
      let role: string | null = null;
      let roleSpecificId: number | null = null;

      if (jwtPayload.adminId) {
        role = 'ADMIN';
        roleSpecificId = jwtPayload.adminId;
      } else if (jwtPayload.technicianId) {
        role = 'TECHNICIAN';
        roleSpecificId = jwtPayload.technicianId;
      } else if (jwtPayload.jobSeekerId) {
        role = 'JOB_SEEKER';
        roleSpecificId = jwtPayload.jobSeekerId;
      } else if (jwtPayload.enterpriseId) {
        role = 'ENTERPRISE';
        roleSpecificId = jwtPayload.enterpriseId;
      } else if (jwtPayload.personalEmployerId) {
        role = 'PERSONAL_EMPLOYER';
        roleSpecificId = jwtPayload.personalEmployerId;
      }

      if (!role || !roleSpecificId) {
        toast.error('Unable to determine user role or ID from token');
        return false;
      }

      // Fetch user profile from API with role and ID
      const userResponse = await fetchWithAuth('http://localhost:8088/api/v1/sharedPlus/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: role,
          id: roleSpecificId
        }),
      });

      if (!userResponse.ok) {
        toast.error('Failed to fetch user data');
        return false;
      }

      const userData = await userResponse.json();

      // Merge JWT payload data with user data
      const enrichedUserData = {
        ...userData,
        firstname: jwtPayload.firstname || userData.firstname,
        lastname: jwtPayload.lastname || userData.lastname,
        userId: jwtPayload.userId || userData.userId,
        adminId: jwtPayload.adminId || userData.adminId,
        technicianId: jwtPayload.technicianId || userData.technicianId,
        jobSeekerId: jwtPayload.jobSeekerId || userData.jobSeekerId,
        enterpriseId: jwtPayload.enterpriseId || userData.enterpriseId,
        personalEmployerId: jwtPayload.personalEmployerId || userData.personalEmployerId,
        role: role
      };

      setUser(enrichedUserData);

      // Set all data in both localStorage and cookies
      setUserData(data.token, email, enrichedUserData, jwtPayload);

      // Redirect based on role
      switch (role) {
        case 'ADMIN':
          router.push('/Job/Admin');
          break;
        case 'TECHNICIAN':
          router.push('/Job/TECHNICIAN');
          break;
        case 'JOB_SEEKER':
          router.push('/Job/Job_Seeker');
          break;
        case 'ENTERPRISE':
          router.push('/Job/Enterprise');
          break;
        case 'PERSONAL_EMPLOYER':
          router.push('/Job/PersonalEmployer');
          break;
        default:
          toast.warning(`Unknown user role: ${role}. Redirecting to home.`);
          router.push('/Job_portail/Home');
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

  // Register
 const register = async (
  email: string,
  password: string,
  firstName: string,  // Add first name
  lastName: string,   // Add last name
  role: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password, 
        firstname: firstName,  // Send as separate fields
        lastname: lastName,
        role 
      }),
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
  // Logout
  const logout = async (): Promise<void> => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      // Clear both localStorage and cookies
      clearUserData();
      
      setUser(null);
      toast.info('Logged out.');
      router.push('/Job_portail/Home');
    }
  };

  // Forgot password
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
        toast.error(data?.message || 'Failed to send reset email.');
        throw new Error(data?.message || 'Failed to send reset email.');
      }
      toast.success('Password reset instructions sent to your email.');
    } catch (error) {
      toast.error(
        isError(error)
          ? error.message
          : 'An error occurred while sending reset instructions.'
      );
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
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
      toast.error(
        isError(error) ? error.message : 'An error occurred during password reset.'
      );
      throw error;
    }
  };

  // Verify email
  const verifyEmail = async (token: string): Promise<void> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await safeParseJSON(response);
      if (!response.ok) {
        toast.error(data?.message || 'Failed to verify email.');
        throw new Error(data?.message || 'Failed to verify email.');
      }
      if (data.user) {
        setUser(data.user);
        // Update email verified status in cookies
        const cookieOptions = `path=/; ${secureCookieFlag}SameSite=Lax`;
        document.cookie = `email_verified=true; ${cookieOptions}`;
      } else if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
        const cookieOptions = `path=/; ${secureCookieFlag}SameSite=Lax`;
        document.cookie = `email_verified=true; ${cookieOptions}`;
      }
      toast.success('Email verified successfully!');
    } catch (error) {
      toast.error(
        isError(error) ? error.message : 'An error occurred during email verification.'
      );
      throw error;
    }
  };

  // Resend verification email
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

  // Update profile
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
      if (data.user) {
        setUser(data.user);
        // Update relevant cookies
        const token = localStorage.getItem('jwt_token');
        const email = localStorage.getItem('email');
        if (token && email) {
          const jwtPayload = decodeJWTPayload(token);
          setUserData(token, email, data.user, jwtPayload);
        }
      }
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(
        isError(error) ? error.message : 'An error occurred while updating profile.'
      );
      throw error;
    }
  };

  // Change password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
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
      toast.error(
        isError(error) ? error.message : 'An error occurred while changing password.'
      );
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

//   const value: AuthContextType = {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     register,
//     logout,
//     forgotPassword,
//     resetPassword,
//     verifyEmail,
//     resendVerification,
//     updateProfile,
//     changePassword,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };