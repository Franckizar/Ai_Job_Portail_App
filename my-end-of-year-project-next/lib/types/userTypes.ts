// types/userTypes.ts
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  enabled: boolean;
  username: string;
  accountNonLocked: boolean;
  freeSubscribed?: boolean;
  standardSubscribed?: boolean;
  premiumSubscribed?: boolean;
}

export interface Role {
  id: string;
  name: string;
}