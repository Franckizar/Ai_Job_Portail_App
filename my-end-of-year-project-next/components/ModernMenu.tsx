'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, Menu, X, ChevronDown } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedRole = getCookieValue('user_role');
    setRole(storedRole);
    setActiveRoute(pathname);
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleNavigation = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      router.push(path);
    } catch (err) {
      setError("Failed to navigate. Please try again.");
      console.error("Navigation error:", err);
    } finally {
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
      label: "User Management",
      href: "/Job/User",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/User"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Pending Users",
      href: "/Job/Users",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/User"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Jobs",
      href: "/Job/sjobs",
      visible: ["ADMIN"],
      onClick: () => handleNavigation("/Job/sjobs"),
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
      label: "Applications",
      href: "/Job/ApplicationSeeker",
      visible: ["JOB_SEEKER"],
      onClick: () => handleNavigation("/Job/ApplicationSeeker"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Job Posts",
      href: "/Job/list/dashL",
      visible: ["ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "My Jobs",
      href: "/Job/list/PERSONAL_EMPLOYER_JOB",
      visible: ["PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dashL"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Recommendations",
      href: "/Job/JobRecommendations",
      visible: ["TECHNICIAN", "JOB_SEEKER"],
      onClick: () => handleNavigation("/Job/JobRecommendations"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Connections",
      href: "/Job/connection",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/connection"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Chat",
      href: "/Job/chat",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/chat"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Test",
      href: "/Job/list/dash",
      visible: ["ADMIN", "TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/list/dash"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Job Management",
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
    {
      icon: <Users className="w-4 h-4" />,
      label: "Subscriptions",
      href: "/Job/Subscriptions",
      visible: ["TECHNICIAN", "JOB_SEEKER", "ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/Subscriptions"),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "JOBS",
      href: "/Job/Subscriptions",
      visible: ["ENTERPRISE", "PERSONAL_EMPLOYER"],
      onClick: () => handleNavigation("/Job/sjobs"),
    },
  ];

  if (!role) return null;

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  const normalizedRole = role.toUpperCase();
  const visibleItems = menuItems.filter(item => item.visible.includes(normalizedRole));

  // Group items for dropdown on mobile (show first 3, rest in dropdown)
  const primaryItems = visibleItems.slice(0, 3);
  const dropdownItems = visibleItems.slice(3);

  const renderMenuItem = (item: typeof menuItems[0], index: number, isMobile = false) => {
    const isActive = item.href
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
        onClick={(e) => {
          e.stopPropagation();
          item.onClick?.();
          if (isMobile) {
            setIsMobileMenuOpen(false);
          }
        }}
        className={`relative flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 w-full ${
          isActive
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
            : "text-gray-600 hover:text-blue-600 hover:bg-white/80"
        } ${isMobile ? 'justify-start' : ''}`}
        disabled={loading}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
          {visibleItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </div>

      {/* Tablet Navigation (with dropdown) */}
      <div className="hidden md:block lg:hidden">
        <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
          {primaryItems.map((item, index) => renderMenuItem(item, index))}
          
          {dropdownItems.length > 0 && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white/80 transition-all duration-300"
              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
                  {dropdownItems.map((item, index) => (
                    <div key={index} className="px-1">
                      {renderMenuItem(item, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 bg-gray-100/80 rounded-full p-3 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-sm font-medium">Menu</span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
              <div className="p-4 space-y-2">
                {visibleItems.map((item, index) => (
                  <div key={index}>
                    {renderMenuItem(item, index, true)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ModernMenu;