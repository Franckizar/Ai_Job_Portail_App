"use client";
import { useEffect, useState } from "react";
import { getRoleFromLocalStorage } from "@/jwt";
import { useRouter } from "next/navigation";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const RoleProtectedDashboard = ({ allowedRoles, children }: Props) => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = getRoleFromLocalStorage();
    setRole(userRole);
    if (userRole && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      router.replace("/unauthorized");
    }
  }, [allowedRoles, router]);

  if (!role) return null; // Or a spinner

  return allowedRoles.map(r => r.toLowerCase()).includes(role) ? <>{children}</> : null;
};

export default RoleProtectedDashboard;
