'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModernMenu, ModernNavbar } from "@/components";
import Image from "next/image";
import Link from "next/link";

function isTokenExpired(token: string): boolean {
  try {
    // Decode the JWT payload (middle part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;

    // Replace URL-safe characters and decode base64 string
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true; // treat errors as expired token
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

useEffect(() => {
  
  // const token = localStorage.getItem("jwt_token");

  // if (!token || isTokenExpired(token)) {
  //   localStorage.removeItem("jwt_token"); // remove expired token
  //   router.replace("/Job_portail/Home");
  //   setHasToken(false);
  // } else {
  //   setHasToken(true);
  // }
  
  // Just allow access unconditionally
  setHasToken(true);
  setAuthChecked(true);
}, [router]);


  if (!authChecked) {
    // Show loading spinner or nothing until auth is checked
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasToken) {
    // Redirect triggered, do not render anything
    return null;
  }

  // Render protected dashboard layout
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/wamb.png" alt="logo" width={250} height={40} className="rounded-lg" />
          </Link>
          <div className="flex-1 flex justify-center">
            <ModernMenu />
          </div>
          <div className="flex items-center gap-4">
            <ModernNavbar />
          </div>
        </div>
      </header>

      <main className="pt-35 px-6 pb-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
