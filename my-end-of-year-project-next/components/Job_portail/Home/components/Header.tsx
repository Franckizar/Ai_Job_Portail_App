'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  User,
  Menu,
  LogOut,
  X,
  Briefcase,
  Home,
} from 'lucide-react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { AuthModal } from './auth/AuthModal';
import { useAuth } from './auth/AuthContext';

// Utility to get cookie value by name
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null; // SSR guard
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Hydration-safe state
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Fix hydration by ensuring client-side only operations happen after mount
  useEffect(() => {
    setIsClient(true);
    // Only access cookies on client side
    const tokenCookie = getCookieValue('jwt_token');
    const roleCookie = getCookieValue('user_role');
    setToken(tokenCookie);
    setRole(roleCookie);
  }, []);

  // Navigation items
  const navigationItems = [
    {
      key: 'Home',
      label: 'Home',
      icon: Home,
      href: '/Job_portail/Home',
    },
    {
      key: 'jobs',
      label: 'Find Jobs',
      icon: Briefcase,
      href: '/Job_portail/Find_Jobs',
    },
    {
      key: 'About_Us',
      label: 'About Us',
      href: '/Job_portail/About_Us',
    },
  ];

  const isActive = (href: string) => pathname === href;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      // Clear cookies on logout
      document.cookie = `jwt_token=; path=/; max-age=0`;
      document.cookie = `user_role=; path=/; max-age=0`;
    }

    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  // Only show auth state after client hydration
  const isAuthenticated = isClient && !!token && !!role;
  const showAuthButtons = isClient && !isAuthenticated;

  return (
    <>
      <header className="border-b bg-zinc-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/Job_portail/Home" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-medium">J</span>
                </div>
                <span className="text-xl font-medium text-black">JobPortal</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 font-medium'
                        : 'text-zinc-500 hover:text-blue-500'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Section */}
            <div className="flex items-center space-x-4">
              {/* Always render the same structure, but conditionally show content */}
              <div className="hidden md:flex items-center space-x-3">
                {!isClient ? (
                  // Loading state to prevent hydration mismatch
                  <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
                ) : showAuthButtons ? (
                  // Auth buttons for non-authenticated users
                  <>
                    <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                      Sign In
                    </Button>
                    <Button onClick={() => setShowAuthModal(true)}>Get Started</Button>
                  </>
                ) : isAuthenticated ? (
                  // User menu for authenticated users
                  <>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                      </span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <User className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="px-3 py-2 text-sm border-b">
                          <p className="font-medium">{user?.profile?.full_name || user?.username}</p>
                          <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <DropdownMenuItem>
                          <Link href="/Job_portail/profile" className="flex items-center w-full">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/Job_portail/applications" className="flex items-center w-full">
                            <Briefcase className="h-4 w-4 mr-2" />
                            My Applications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {role?.toLowerCase() === 'recruiter' && (
                      <Link href="/Job_portail/post-job">
                        <Button>Post a Job</Button>
                      </Link>
                    )}
                  </>
                ) : null}
              </div>

              {/* Mobile menu toggle button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Navigation links */}
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Auth section */}
              <div className="mt-6 pt-4 border-t">
                {!isClient ? (
                  <div className="w-full h-20 bg-gray-200 animate-pulse rounded"></div>
                ) : showAuthButtons ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2 text-sm border-b">
                      <p className="font-medium">{user?.profile?.full_name || user?.username}</p>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/Job_portail/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50">
                      <Bell className="h-5 w-5" />
                      <span>Notifications (2)</span>
                    </button>
                    {role?.toLowerCase() === 'recruiter' && (
                      <Link href="/Job_portail/post-job" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full mt-2">Post a Job</Button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </header>

      {isClient && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}