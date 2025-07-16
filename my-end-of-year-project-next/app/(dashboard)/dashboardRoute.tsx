"use client";
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
        const decoded = jwtDecode<{ role: string }>(token);
        role = decoded.role?.toUpperCase();
      } catch {}
    }

    const dashboardRoute = {
      ADMIN: "/Admin",
      DOCTOR: "/Doctor",
      PATIENT: "/Patient",
    }[role || ""] || "/";

    router.replace(dashboardRoute);
  }, [router]);

  return null;
}
