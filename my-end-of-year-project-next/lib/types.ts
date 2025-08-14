// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}