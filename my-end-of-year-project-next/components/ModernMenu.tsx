'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";
import Loader from "@/components/Loader";

// Cookie reading util (same as in navbar)
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const ModernMenu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedRole = getCookieValue('user_role');
    setRole(storedRole);
    setActiveRoute(pathname);
  }, [pathname]);

  const handleNavigation = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      router.push(path);
    } catch (err) {
      setError("Failed to navigate. Please try again.");
      console.error("Navigation error:", err);
    } finally {
      // Small delay to ensure smooth transition even if navigation is fast
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleDashboardClick = () => {
    if (!role) return;
    const normalizedRole = role.toUpperCase();

    let dashboardPath = "/";
    switch (normalizedRole) {
      case "ADMIN":
        dashboardPath = "/Job/Admin";
        break;
      case "TECHNICIAN":
        dashboardPath = "/Job/Technician";
        break;
      case "JOB_SEEKER":
        dashboardPath = "/Job/Job_Seeker";
        break;
      case "ENTERPRISE":
        dashboardPath = "/Job/Enterprise";
        break;
      case "PERSONAL_EMPLOYER":
        dashboardPath = "/Job/PersonalEmployer";
        break;
    }

    handleNavigation(dashboardPath);
  };

  const menuItems = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Dashboard",
      href: "",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: handleDashboardClick,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "User",
      href: "/Job/User",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/User"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Pending User",
      href: "/Job/Users",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/User"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Jobs",
      href: "/Job/sjobs",
      visible: ["ADMIN"],
      // onClick: () => handleNavigation("/Job/jobs"),
      onClick: () => handleNavigation("/Job/sjobs"),
      // onClick: () => handleNavigation("/Job/testy"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Applications",
      href: "/Job/Applications",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/Applications"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Payments",
      href: "/Job/Payments",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/Payments"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Subscriptions",
      href: "/Job/Subscriptions",
      visible: ["TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/Subscriptions"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Applications",
      href: "/Job/list/dashL",
      visible: ["JOB_SEEKER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Posts",
      href: "/Job/list/dashL",
      visible: [ "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Subscriptions",
      href: "/Job/list/dashL",
      visible: ["JOB_SEEKER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Favorite",
      href: "/Job/list/dashL",
      visible: ["JOB_SEEKER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Jobs",
      href: "/Job/list/PERSONAL_EMPLOYER_JOB",
      visible: ["PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "JobRecommendations",
      href: "/Job/JobRecommendations",
      visible: ["TECHNICIAN", "JOB_SEEKER",],
      onClick: () => handleNavigation("/Job/JobRecommendations"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "connections",
      href: "/Job/connection",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/connection"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "chat",
      href: "/Job/chat",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/chat"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Test A",
      href: "/Job/list/dash",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dash"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Jobs",
      href: "/Job/list/dash",
      visible: ["PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dash"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Applications",
      href: "/Job/list/dash",
      visible: ["PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dash"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Test B",
      href: "/Job/list/dashL",
      visible: ["TECHNICIAN"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
  ];

  if (!role) return null;

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const normalizedRole = role.toUpperCase();

  // Filter menu by user role
  const visibleItems = menuItems.filter(item => item.visible.includes(normalizedRole));

  return (
    <>
      <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
        {visibleItems.map((item, index) => {
          const isActive =
            item.href
              ? activeRoute === item.href
              : (item.label === "Dashboard" && [
                  "/Job/Admin",
                  "/Job/Technician",
                  "/Job/Job_Seeker",
                  "/Job/Enterprise",
                  "/Job/PersonalEmployer",
                ].includes(activeRoute));

          return (
            <button
              key={`${item.label}-${item.href}-${index}`}
              onClick={item.onClick || (() => item.href && handleNavigation(item.href))}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/80"}
                  `}
              disabled={loading}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default ModernMenu;