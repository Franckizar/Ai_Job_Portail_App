// app/ClientRootWrapper.tsx
'use client';
import { useEffect } from 'react';
// import { removeGeistClasses } from '@/lib/removeGeistClasses';
import { removeGeistClasses } from '@/lib/removeGeistClasses';

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    removeGeistClasses();
  }, []);

  return <>{children}</>;
}