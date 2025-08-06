"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRoleFromLocalStorage } from "@/jwt";
import Link from "next/link";
import {
  Home,
  Users,
} from "lucide-react";

const ModernMenu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedRole = getRoleFromLocalStorage();
    setRole(storedRole);
    setActiveRoute(pathname);
  }, [pathname]);

  const handleDashboardClick = () => {
    if (!role) return;

    const normalizedRole = role.toUpperCase();

    switch (normalizedRole) {
      case "ADMIN":
        router.push("/Job/Admin");
        break;
      case "DOCTOR":
        router.push("/Job/Doctor");
        break;
      case "NURSE":
        router.push("/Job/Nurse");
        break;
      case "PATIENT":
        router.push("/Job/Patient");
        break;
      default:
        router.push("/");
    }
  };

  const menuItems = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Dashboard",
      href: "",
      visible: ["ADMIN", "DOCTOR", "NURSE", "PATIENT"],
      onClick: handleDashboardClick,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Test A",
      href: "/Job/list/dash",
      visible: ["ADMIN", "DOCTOR", "NURSE"],
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Test B",
      href: "/Job/list/dashL",
      visible: ["ADMIN", "DOCTOR", "NURSE"],
    },
  ];

  if (!role) return null;

  const normalizedRole = role.toUpperCase();
  const visibleItems = menuItems.filter(item =>
    item.visible.includes(normalizedRole)
  );

  return (
    <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
      {visibleItems.map((item) => {
        const isActive = item.href
          ? activeRoute === item.href
          : (item.label === "Dashboard" &&
            ["/Job/Admin", "/Job/Doctor", "/Job/Nurse", "/Job/Patient"].includes(activeRoute));

        if (item.label === "Dashboard") {
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'}
              `}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            href={item.href}
            key={item.label}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${isActive
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'}
            `}
          >
            {item.icon}
            <span className="hidden sm:block">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default ModernMenu;
