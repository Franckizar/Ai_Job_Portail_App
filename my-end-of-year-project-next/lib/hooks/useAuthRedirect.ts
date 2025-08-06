// hooks/useAuthRedirect.ts
'use client';

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;

  // Add your public routes here, including Job_portail prefix:
  const publicRoutes = [
    "/", 
    "/login", 
    "/register", 
    "/Job_portail",           // allow all pages under Job_portail
    "/Job_portail/",          // (add trailing slash variant)
    "/Job_portail/Home",
  ];

  useEffect(() => {
    // Check if current route is public
    const isPublic = publicRoutes.some(route => pathname.toLowerCase().startsWith(route.toLowerCase()));

    if (!token && !isPublic) {
      // Redirect unauthenticated users from protected pages to public home
      router.replace("/Job_portail/Home");  // or "/" if you want root
    }
  }, [token, pathname, router]);
}
