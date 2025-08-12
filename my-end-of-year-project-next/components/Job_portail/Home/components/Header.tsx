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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const tokenCookie = getCookieValue('jwt_token');
    const roleCookie = getCookieValue('user_role');
    setToken(tokenCookie);
    setRole(roleCookie);
  }, []);

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

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `jwt_token=; path=/; max-age=0`;
      document.cookie = `user_role=; path=/; max-age=0`;
    }
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const isAuthenticated = isClient && !!token && !!role;
  const showAuthButtons = isClient && !isAuthenticated;

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="container mx-auto px-4 py-3"> {/* Increased padding from px-4 to px-6 */}
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8"> {/* Changed space-x-8 to gap-8 */}
              <Link href="/Job_portail/Home" className="flex items-center gap-2"> {/* Changed space-x-2 to gap-2 */}
                <div className="w-8 h-8 bg-[var(--color-lamaSkyDark)] rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--color-text-primary)]">JobLama</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6"> {/* Changed space-x-6 to gap-6 */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md ${
                      isActive(item.href)
                        ? 'text-[var(--color-lamaSkyDark)] font-medium bg-[var(--color-lamaSkyLight)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSkyLight)]'
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3"> {/* Changed space-x-3 to gap-3 */}
              {!isClient ? (
                <div className="flex gap-3"> {/* Changed space-x-3 to gap-3 */}
                  <div className="w-20 h-9 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                  <div className="w-24 h-9 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                </div>
              ) : showAuthButtons ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthModal(true)}
                    className="border-[var(--color-lamaSkyDark)] text-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSkyLight)]"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]"
                  >
                    Get Started
                  </Button>
                </>
              ) : isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon" className="relative text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)]">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-[var(--color-lamaRedDark)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)]">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]"
                    >
                      <div className="px-3 py-2 text-sm border-b border-[var(--color-border-light)]">
                        <p className="font-medium text-[var(--color-text-primary)]">{user?.profile?.full_name || user?.username}</p>
                        <p className="text-[var(--color-text-tertiary)]">{user?.email}</p>
                      </div>
                      <DropdownMenuItem className="text-[var(--color-text-primary)] hover:bg-[var(--color-lamaSkyLight)]">
                        <Link href="/Job_portail/profile" className="flex items-center w-full gap-2"> {/* Changed space-x-2 to gap-2 */}
                          <User className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--color-text-primary)] hover:bg-[var(--color-lamaSkyLight)]">
                        <Link href="/Job_portail/applications" className="flex items-center w-full gap-2"> {/* Changed space-x-2 to gap-2 */}
                          <Briefcase className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
                          My Applications
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[var(--color-border-light)]" />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-[var(--color-lamaRedDark)] hover:bg-[var(--color-lamaRedLight)]"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {role?.toLowerCase() === 'recruiter' && (
                    <Link href="/Job_portail/post-job">
                      <Button className="bg-[var(--color-lamaPurpleDark)] hover:bg-[var(--color-lamaPurple)]">
                        Post a Job
                      </Button>
                    </Link>
                  )}
                </>
              ) : null}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)]"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-bg-primary)] border-t border-[var(--color-border-light)] shadow-lg">
            <div className="container mx-auto px-6 py-2"> {/* Increased padding from px-4 to px-6 */}
              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive(item.href)
                          ? 'bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)] font-medium'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaSkyLight)]'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border-light)]">
                {!isClient ? (
                  <div className="space-y-2">
                    <div className="h-10 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                    <div className="h-10 bg-[var(--color-bg-secondary)] rounded animate-pulse"></div>
                  </div>
                ) : showAuthButtons ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-[var(--color-lamaSkyDark)] text-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSkyLight)]"
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]"
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
                    <div className="px-4 py-2 text-sm border-b border-[var(--color-border-light)]">
                      <p className="font-medium text-[var(--color-text-primary)]">{user?.profile?.full_name || user?.username}</p>
                      <p className="text-[var(--color-text-tertiary)]">{user?.email}</p>
                    </div>
                    <Link
                      href="/Job_portail/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-lamaSkyLight)]"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-lamaSkyLight)]">
                      <Bell className="h-5 w-5" />
                      <span>Notifications (2)</span>
                    </button>
                    {role?.toLowerCase() === 'recruiter' && (
                      <Link 
                        href="/Job_portail/post-job" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block mt-2"
                      >
                        <Button className="w-full bg-[var(--color-lamaPurpleDark)] hover:bg-[var(--color-lamaPurple)]">
                          Post a Job
                        </Button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-lamaRedDark)] hover:bg-[var(--color-lamaRedLight)]"
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