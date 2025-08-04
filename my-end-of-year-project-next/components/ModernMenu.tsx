"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRoleFromLocalStorage } from "@/jwt";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Calendar,
  FileText,
  DollarSign,
  FilePlus,
} from "lucide-react";

const ModernMenu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    setActiveRoute(pathname);
  }, [pathname]);

  const handleDashboardClick = () => {
    if (!role) return;
    if (role === "admin") router.push("/Admin");
    else if (role === "doctor") router.push("/Doctor");
    else if (role === "nurse") router.push("/Nurse");
    else if (role === "patient") router.push("/Patient");
    else router.push("/");
  };

  const menuItems = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Dashboard",
      href: "",
      visible: ["admin", "doctor", "nurse", "patient"],
      onClick: handleDashboardClick,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "test",
      href: "/Job/list/dash",
      visible: ["admin", "doctor", "nurse"],
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "testI",
      href: "/Job/list/dashL",
      visible: ["admin", "doctor", "nurse"],
    },
    
    {
      icon: <Users className="w-4 h-4" />,
        label: "Dashboard",
      href: "/Job/Admin",
      visible: ["admin", "doctor", "nurse"],
    },
    // {
    //   icon: <User className="w-4 h-4" />,
    //   label: "Nurses",
    //   href: "/list/Nurses",
    //   visible: ["admin"],
    // },
    // {
    //   icon: <Calendar className="w-4 h-4" />,
    //   label: "Appointments",
    //   href: "/Appointment",
    //   visible: ["admin", "doctor", "nurse"],
    // },
    // {
    //   icon: <FileText className="w-4 h-4" />,
    //   label: "Records",
    //   href: "/Medical_Record",
    //   visible: ["admin", "doctor"],
    // },
    // {
    //   icon: <DollarSign className="w-4 h-4" />,
    //   label: "Invoices",
    //   href: "/list/Invoices",
    //   visible: ["admin", "patient"],
    // },
    // {
    //   icon: <FilePlus className="w-4 h-4" />,
    //   label: "Services",
    //   href: "/Job/list/Services",
    //   visible: ["admin", "doctor", "nurse", "patient"],
    // },
  ];

  if (!role) return null;

  const visibleItems = menuItems.filter(item => item.visible.includes(role));

  return (
    <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
      {visibleItems.map((item) => {
        const isActive = item.href ? activeRoute === item.href : 
                        (item.label === "Dashboard" && 
                         (activeRoute === "/Admin" || activeRoute === "/Doctor" || 
                          activeRoute === "/Nurse" || activeRoute === "/Patient"));

        if (item.label === "Dashboard") {
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        } else {
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </Link>
          );
        }
      })}
    </nav>
  );
};

export default ModernMenu;