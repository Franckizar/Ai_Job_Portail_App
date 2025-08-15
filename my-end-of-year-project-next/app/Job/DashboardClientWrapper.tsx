// app/DashboardClientWrapper.tsx
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModernMenu, ModernNavbar } from "@/components";
import { JobModalProvider } from "@/components/Job_portail/Home/context/JobModalContext";
import Image from "next/image";
import Link from "next/link";

export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.replace("/Job_portail/Home");
      setHasToken(false);
    } else {
      setHasToken(true);
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasToken) return null;

  return (
    <JobModalProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/wamb.png" 
                alt="logo" 
                width={250} 
                height={40} 
                className="rounded-lg"
                priority
              />
            </Link>
            <div className="flex-1 flex justify-center">
              <ModernMenu />
            </div>
            <div className="flex items-center gap-4">
              <ModernNavbar />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-[85px] px-6 pb-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </JobModalProvider>
  );
}