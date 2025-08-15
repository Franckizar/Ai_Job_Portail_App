// app/ClientContent.tsx
'use client';
import { useState, useEffect } from 'react';
import Loader from "@/components/Loader";

export default function ClientContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}