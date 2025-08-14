// services/userService.ts
import { User } from '@/lib/types/userTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088/api/v1';

// Fetch all users from the backend
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/test/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Map backend fields to frontend User model
    return data.map((u: any) => ({
      id: u.id,
      name: `${u.firstname} ${u.lastname}`,
      email: u.email,
      role: u.roles[0] || 'UNKNOWN',
      active: u.enabled,
    }));
  } catch (error) {
    console.error('fetchUsers error:', error);
    return [];
  }
};
