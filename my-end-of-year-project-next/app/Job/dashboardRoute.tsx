'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    let role = null;

    if (token) {
      try {
        const decoded = jwtDecode<{ role: string | string[] }>(token);

        if (Array.isArray(decoded.role)) {
          role = decoded.role[0].toUpperCase();
        } else {
          role = decoded.role?.toUpperCase();
        }
      } catch (e) {
        console.error("Invalid token:", e);
      }
    }

    const dashboardRoute = {
      ADMIN: "/Admin",
      TECHNICIAN: "/Technician",
      JOBSEEKER: "/JobSeeker",
      ENTERPRISE: "/Enterprise",
    }[role || ""] || "/";

    router.replace(dashboardRoute);
  }, [router]);

  return null;
}
