'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, User, Menu, X, Briefcase, LogOut } from 'lucide-react';

import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import { AuthModal } from './auth/AuthModal';
import { useAuth } from './auth/AuthContext';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const tokenCookie = getCookieValue('jwt_token');
    const roleCookie = getCookieValue('user_role');
    setToken(tokenCookie);
    setRole(roleCookie); // preserve exact casing
  }, []);

  const navigationItems = [
    { key: 'jobs', label: 'Find Jobs', icon: Briefcase, href: '/Job_portail/Find_Jobs' },
    { key: 'about', label: 'About Us', href: '/Job_portail/About_Us' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `jwt_token=; path=/; max-age=0`;
      document.cookie = `user_role=; path=/; max-age=0`;
    }
    logout();
    router.push('/Job_portail/Home');
    setIsMobileMenuOpen(false);
  };

  const isAuthenticated = isClient && !!token && !!role;
  const showAuthButtons = isClient && !isAuthenticated;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Role-based dashboard routes and text
  const getDashboardRoute = () => {
    switch (role) {
      case 'ADMIN': return '/Job/Admin';
      case 'JOB_SEEKER': return '/Job/Job_Seeker';
      case 'TECHNICIAN': return '/Job/Technician';
      case 'ENTERPRISE': return '/Job/Enterprise';
      case 'PERSONAL_EMPLOYER': return '/Job/Personal_Employer';
      default: return '/Job/Home';
    }
  };

  const getDashboardText = () => {
    switch (role) {
      case 'ADMIN': return 'Admin Panel';
      case 'JOB_SEEKER': return 'My Dashboard';
      case 'TECHNICIAN': return 'Technician Dashboard';
      case 'ENTERPRISE': return 'Enterprise Dashboard';
      case 'PERSONAL_EMPLOYER': return 'Employer Dashboard';
      default: return 'Dashboard';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/Job_portail/Home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-lamaSkyDark)] rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--color-text-primary)]">JobLama</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)] hover:text-[var(--color-lamaSkyDark)]'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {!isClient ? (
                <div className="flex gap-3">
                  <div className="w-20 h-9 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                  <div className="w-24 h-9 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                </div>
              ) : showAuthButtons ? (
                <>
                  <Button variant="outline" onClick={() => setShowAuthModal(true)} className="border-[var(--color-lamaSkyDark)] text-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSkyLight)]">
                    Sign In
                  </Button>
                  <Button onClick={() => setShowAuthModal(true)} className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]">
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                <Button
  size="icon"
  className="relative text-[var(--color-text-primary)] opacity-100 hover:bg-[var(--color-lamaSkyLight)]"
>
  <Bell className="h-5 w-5" />
  <span className="absolute -top-1 -right-1 bg-[var(--color-lamaRedDark)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
    2
  </span>
</Button>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      size="icon"
      className="text-[var(--color-text-primary)] opacity-100 hover:bg-[var(--color-lamaSkyLight)]"
    >
      <User className="h-5 w-5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="end"
    className="w-56 border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]"
  >
    <div className="px-3 py-2 text-sm border-b border-[var(--color-border-light)]">
      <p className="font-medium text-[var(--color-text-primary)]">
        {user?.profile?.full_name || user?.name}
      </p>
      <p className="text-[var(--color-text-tertiary)]">{user?.email}</p>
    </div>
    <DropdownMenuItem>
      <Link href="/Job/Profile" className="flex items-center gap-2">
        <User className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
        Profile
      </Link>
    </DropdownMenuItem>
 {["JOB_SEEKER", "PERSONAL_EMPLOYER"].includes(role || "") && (
  <DropdownMenuItem>
    <Link
      href="/Job/Subscription"
      className="flex items-center gap-2"
    >
      <User className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
      Subscribe
    </Link>
  </DropdownMenuItem>
)}

    {/* <DropdownMenuItem>
      <Link href="/Job/Applications" className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
        My Applications
      </Link>
    </DropdownMenuItem> */}
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={handleLogout}
      className="text-[var(--color-lamaRedDark)] hover:bg-[var(--color-lamaRedLight)]"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


                 {/* Role-specific dashboard button */}
{role && (
  <Link href={getDashboardRoute()}>
    <Button
      className="bg-purple-700 text-white hover:bg-purple-500 hover:text-white font-semibold"
    >
      {getDashboardText()}
    </Button>
  </Link>
)}

                </>
              )}

              {/* Mobile toggle */}
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-[var(--color-lamaSkyLight)]" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-bg-primary)] border-t border-[var(--color-border-light)] shadow-lg">
            <div className="container mx-auto px-4 py-2">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive(item.href)
                        ? 'bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)] font-medium'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)]'
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {isClient && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
