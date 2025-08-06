



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
    | 'RECRUITER'
    | 'ENTERPRISE'
    | 'ADMIN';
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
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

// Helper function to decode JWT and extract the email from the 'sub' claim
function decodeJWTEmail(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.sub || null;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
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

      const email = decodeJWTEmail(token);
      if (!email) {
        console.error('Failed to extract email from JWT');
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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

      // Save token and email inside localStorage
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('email', email);

      // Set token and email cookies (Secure flag only in production)
      document.cookie = `jwt_token=${data.token}; path=/; ${secureCookieFlag}SameSite=Lax`;
      document.cookie = `email=${email}; path=/; ${secureCookieFlag}SameSite=Lax`;

      toast.success('Login successful!');
      // router.refresh();

      // Decode email from token for next call
      const jwtEmail = decodeJWTEmail(data.token);
      if (!jwtEmail) {
        toast.error('Failed to extract user info from token');
        return false;
      }

      // Fetch user profile from API
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

      // Extract role from user data (support multiple possible fields)
      let role: string | null = null;
      if (userData.role) {
        role = userData.role;
      } else if (Array.isArray(userData.roles) && userData.roles.length > 0) {
        role = userData.roles[0];
      } else if (userData.userRole) {
        role = userData.userRole;
      } else if (userData.authority) {
        role = userData.authority;
      }

      // Normalize role to uppercase and remove "ROLE_" prefix if present
      let normalizedRole: string | null = null;
      if (role) {
        normalizedRole = String(role).toUpperCase();
        if (normalizedRole.startsWith('ROLE_')) {
          normalizedRole = normalizedRole.replace('ROLE_', '');
        }
      }

      if (normalizedRole) {
        // Save role to localStorage and cookie
        localStorage.setItem('user_role', normalizedRole);
        // Removed Secure flag temporarily here for easier testing if needed
        document.cookie = `user_role=${normalizedRole}; path=/; SameSite=Lax`;
      }

      // Redirect based on role
      switch (normalizedRole) {
        case 'ADMIN':
          router.push('/Job/Admin');
          break;
        case 'TECHNICIAN':
          router.push('/Job/Technician');
          break;
        case 'JOB_SEEKER':
        case 'JOBSEEKER': // Cover possible format difference
          router.push('/Job/JobSeeker');
          break;
        case 'ENTERPRISE':
          router.push('/Job/Enterprise');
          break;
        case 'RECRUITER':
          router.push('/Job/Recruiter');
          break;
        default:
          toast.warning(`Unknown user role: ${role || 'null'}. Redirecting to home.`);
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

  // Register
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

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      // Removed all localStorage.removeItem calls here
      setUser(null);
      toast.info('Logged out.');
      router.push('/');
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
      } else if (user) {
        setUser({ ...user, isEmailVerified: true });
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
      if (data.user) setUser(data.user);
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













































// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';
// import { fetchWithAuth } from '@/fetchWithAuth';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   // Roles are normalized uppercase for consistency
//   role:
//     | 'JOB_SEEKER'
//     | 'TECHNICIAN'
//     | 'RECRUITER'
//     | 'ENTERPRISE'
//     | 'ADMIN';
//   isEmailVerified: boolean;
//   avatar?: string;
//   createdAt: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
//   logout: () => Promise<void>;
//   forgotPassword: (email: string) => Promise<void>;
//   resetPassword: (token: string, newPassword: string) => Promise<void>;
//   verifyEmail: (token: string) => Promise<void>;
//   resendVerification: (email: string) => Promise<void>;
//   updateProfile: (updates: Partial<User>) => Promise<void>;
//   changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
// }

// function isError(error: unknown): error is Error {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'message' in error &&
//     typeof (error as Record<string, unknown>).message === 'string'
//   );
// }

// async function safeParseJSON(response: Response): Promise<any | null> {
//   const text = await response.text();
//   if (!text) return null;
//   try {
//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// }

// // Helper function to decode JWT and extract the email from the 'sub' claim
// function decodeJWTEmail(token: string): string | null {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     const payload = JSON.parse(jsonPayload);
//     return payload.sub || null;
//   } catch (error) {
//     console.error('Failed to decode JWT:', error);
//     return null;
//   }
// }

// // Conditional Secure flag for cookies (only in production)
// const secureCookieFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1/auth';

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Check authentication status when app loads
//   const checkAuthStatus = async (): Promise<void> => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         setUser(null);
//         setIsLoading(false);
//         return;
//       }

//       const email = decodeJWTEmail(token);
//       if (!email) {
//         console.error('Failed to extract email from JWT');
//         localStorage.removeItem('jwt_token');
//         localStorage.removeItem('email');
//         localStorage.removeItem('user_role');
//         setUser(null);
//         setIsLoading(false);
//         return;
//       }

//       // NOTE: Make sure this endpoint is correct and does not duplicate /auth/auth
//       const response = await fetchWithAuth(`${API_BASE_URL}/verify-user`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       } else {
//         console.error('Failed to verify user during auth check');
//         localStorage.removeItem('jwt_token');
//         localStorage.removeItem('email');
//         localStorage.removeItem('user_role');
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('jwt_token');
//       localStorage.removeItem('email');
//       localStorage.removeItem('user_role');
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     void checkAuthStatus();
//   }, []);

//   // Login function: saves JWT, email, and role (in localStorage and cookies)
//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/authenticate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await safeParseJSON(response);

//       if (!response.ok || !data?.token) {
//         toast.error(data?.message || 'Login failed. Please check your credentials.');
//         return false;
//       }

//       // Save token and email inside localStorage
//       localStorage.setItem('jwt_token', data.token);
//       localStorage.setItem('email', email);

//       // Set token and email cookies (Secure flag only in production)
//       document.cookie = `jwt_token=${data.token}; path=/; ${secureCookieFlag}SameSite=Lax`;
//       document.cookie = `email=${email}; path=/; ${secureCookieFlag}SameSite=Lax`;

//       toast.success('Login successful!');

//       // Decode email from token for next call
//       const jwtEmail = decodeJWTEmail(data.token);
//       if (!jwtEmail) {
//         toast.error('Failed to extract user info from token');
//         return false;
//       }

//       // Fetch user profile from API
//       const userResponse = await fetchWithAuth('http://localhost:8088/api/v1/sharedPlus/me', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: jwtEmail }),
//       });

//       if (!userResponse.ok) {
//         toast.error('Failed to fetch user data');
//         return false;
//       }

//       const userData = await userResponse.json();
//       setUser(userData);

//       // Extract role from user data (support multiple possible fields)
//       let role: string | null = null;
//       if (userData.role) {
//         role = userData.role;
//       } else if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//         role = userData.roles[0];
//       } else if (userData.userRole) {
//         role = userData.userRole;
//       } else if (userData.authority) {
//         role = userData.authority;
//       }

//       // Normalize role to uppercase and remove "ROLE_" prefix if present
//       let normalizedRole: string | null = null;
//       if (role) {
//         normalizedRole = String(role).toUpperCase();
//         if (normalizedRole.startsWith('ROLE_')) {
//           normalizedRole = normalizedRole.replace('ROLE_', '');
//         }
//       }

//       if (normalizedRole) {
//         // Save role to localStorage and cookie
//         localStorage.setItem('user_role', normalizedRole);
//         // document.cookie = `user_role=${normalizedRole}; path=/; ${secureCookieFlag}SameSite=Lax`;
//         document.cookie = `user_role=${normalizedRole}; path=/; SameSite=Lax`;

//       }

//       // Redirect based on role
//       switch (normalizedRole) {
//         case 'ADMIN':
//           router.push('/Job/Admin');
//           break;
//         case 'TECHNICIAN':
//           router.push('/Job/Technician');
//           break;
//         case 'JOB_SEEKER':
//         case 'JOBSEEKER': // Cover possible format difference
//           router.push('/Job/JobSeeker');
//           break;
//         case 'ENTERPRISE':
//           router.push('/Job/Enterprise');
//           break;
//         case 'RECRUITER':
//           router.push('/Job/Recruiter');
//           break;
//         default:
//           toast.warning(`Unknown user role: ${role || 'null'}. Redirecting to home.`);
//           router.push('/');
//           break;
//       }

//       return true;
//     } catch (error: unknown) {
//       if (isError(error)) {
//         toast.error(error.message);
//         throw error;
//       }
//       toast.error('An unexpected error occurred during login.');
//       throw new Error('An unexpected error occurred during login.');
//     }
//   };

//   // Register
//   const register = async (
//     email: string,
//     password: string,
//     name: string,
//     role: string
//   ): Promise<boolean> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, name, role }),
//       });

//       const data = await safeParseJSON(response);

//       if (!response.ok) {
//         toast.error(data?.message || 'Registration failed.');
//         return false;
//       }

//       toast.success('Registration successful! Please verify your email.');
//       return true;
//     } catch (error) {
//       toast.error('An unexpected error occurred during registration.');
//       return false;
//     }
//   };

//   // Logout
//   const logout = async (): Promise<void> => {
//     try {
//       await fetchWithAuth(`${API_BASE_URL}/logout`, { method: 'POST' });
//     } catch (error) {
//       console.error('Logout error:', error);
//       toast.error('Logout failed. Please try again.');
//     } finally {
//       localStorage.removeItem('jwt_token');
//       localStorage.removeItem('email');
//       localStorage.removeItem('user_role');
//       setUser(null);
//       toast.info('Logged out.');
//       router.push('/');
//     }
//   };

//   // Forgot password
//   const forgotPassword = async (email: string): Promise<void> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to send reset email.');
//         throw new Error(data?.message || 'Failed to send reset email.');
//       }
//       toast.success('Password reset instructions sent to your email.');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred while sending reset instructions.');
//       throw error;
//     }
//   };

//   // Reset password
//   const resetPassword = async (token: string, newPassword: string): Promise<void> => {
//     try {
//       const params = new URLSearchParams({ token, newPassword });
//       const response = await fetch(`${API_BASE_URL}/reset-password?${params.toString()}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to reset password.');
//         throw new Error(data?.message || 'Failed to reset password.');
//       }
//       toast.success('Password has been reset successfully.');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred during password reset.');
//       throw error;
//     }
//   };

//   // Verify email
//   const verifyEmail = async (token: string): Promise<void> => {
//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/verify-email`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token }),
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to verify email.');
//         throw new Error(data?.message || 'Failed to verify email.');
//       }
//       if (data.user) {
//         setUser(data.user);
//       } else if (user) {
//         setUser({ ...user, isEmailVerified: true });
//       }
//       toast.success('Email verified successfully!');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred during email verification.');
//       throw error;
//     }
//   };

//   // Resend verification email
//   const resendVerification = async (email: string): Promise<void> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/resend-verification`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to resend verification code.');
//         throw new Error(data?.message || 'Failed to resend verification code.');
//       }
//       toast.success('Verification code sent to your email.');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred while resending code.');
//       throw error;
//     }
//   };

//   // Update profile
//   const updateProfile = async (updates: Partial<User>): Promise<void> => {
//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to update profile.');
//         throw new Error(data?.message || 'Failed to update profile.');
//       }
//       if (data.user) setUser(data.user);
//       toast.success('Profile updated successfully.');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred while updating profile.');
//       throw error;
//     }
//   };

//   // Change password
//   const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/change-password`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });
//       const data = await safeParseJSON(response);
//       if (!response.ok) {
//         toast.error(data?.message || 'Failed to change password.');
//         throw new Error(data?.message || 'Failed to change password.');
//       }
//       toast.success('Password changed successfully.');
//     } catch (error) {
//       toast.error(isError(error) ? error.message : 'An error occurred while changing password.');
//       throw error;
//     }
//   };

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
