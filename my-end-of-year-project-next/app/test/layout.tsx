'use client';

import { AuthProvider } from '@/components/Job_portail/Home/components/auth/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
