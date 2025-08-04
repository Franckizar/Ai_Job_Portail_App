'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRoleFromLocalStorage } from "@/jwt";
import Link from "next/link";
import {
  Bell,
  Settings,
  LogOut,
  User,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

const ModernNavbar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const router = useRouter();

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  const isActive = (href: string): boolean => {
    // Handles exact path match or startWith for deeper paths
    return pathname === href || pathname.startsWith(href);
  };

  if (!role) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Notifications */}
      <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
        <Bell className="w-5 h-5" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {notifications}
          </span>
        )}
      </button>

      {/* Messages */}
      <Link
        href="/messages"
        className={`p-2 rounded-full transition-all duration-200 ${
          isActive('/messages')
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
      </Link>

      {/* Settings */}
      <Link
        href="/Settings"
        className={`p-2 rounded-full transition-all duration-200 ${
          isActive('/Settings')
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium capitalize">{role}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 capitalize">{role} Dashboard</p>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
            
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            
            <Link
              href="/Settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            
            <hr className="my-2 border-gray-100" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernNavbar;
