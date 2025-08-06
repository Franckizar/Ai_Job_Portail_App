import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, User, Menu, LogOut, X, Briefcase, DollarSign, BookOpen, Building, Search } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "./auth/AuthContext";

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Next.js navigation function
  const navigate = (url: string) => {
    router.push(url);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 🎯 NEXT.JS ROUTES - Just copy and paste to add new routes!
  // These match your Next.js app directory structure
  const navigationItems = [
    { 
      key: 'jobs', 
      label: 'Find Jobs', 
      icon: Briefcase,
      href: '/Job_portail/Find_Jobs'  // → app/Job_portail/jobs/page.js
    },
    { 
      key: 'companies', 
      label: 'Companies', 
      icon: Building,
      href: '/Job_portail/Companies'  // → app/Job_portail/companies/page.js
    },
    { 
      key: 'salaries', 
      label: 'Salaries', 
      icon: DollarSign,
      href: '/Job_portail/salaries'  // → app/Job_portail/salaries/page.js
    },
    { 
      key: 'resources', 
      label: 'Resources', 
      icon: BookOpen,
      href: '/Job_portail/resources'  // → app/Job_portail/resources/page.js
    },
    {
      key: 'resources', 
      label: 'Max', 
      // icon: BookOpen,
      href: '/Job_portail/max'  // → app/Job_portail/resources/page.js
    },
    // 📝 TO ADD A NEW ROUTE: Copy this template
    // { 
    //   key: 'blog', 
    //   label: 'Blog', 
    //   icon: FileText,
    //   href: '/Job_portail/blog'  // → app/Job_portail/blog/page.js
    // },
  ];

  // Check if current page is active using Next.js pathname
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <header className="border-b bg-zinc-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/Job_portail/Home"
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-medium">J</span>
                </div>
                <span className="text-xl font-medium text-black">JobPortal</span>
              </Link>
              
              {/* Desktop Navigation - Hidden on small screens */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 font-medium'  // 🎨 ACTIVE COLOR: Change this
                        : 'text-zinc-500 hover:text-blue-500'  // 🎨 INACTIVE COLOR: Change this
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              
              {/* Auth Buttons - Hidden on small screens */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3 bg-black" >
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* User Menu - Hidden on small screens */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3 ">
                  <Button variant="ghost" size="icon" className="relative ">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ">2</span>
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
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {user?.role === 'recruiter' && (
                    <Link href="/Job_portail/post-job">
                      <Button>Post a Job</Button>
                    </Link>
                  )}
                </div>
              )}
              
              {/* Mobile Menu Button - Only visible on small screens */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden bg-black"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 📱 MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              
              {/* Navigation Links */}
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
                      <IconComponent className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Auth Section */}
              <div className="mt-6 pt-4 border-t">
                {!isAuthenticated ? (
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
                ) : (
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
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50"
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notifications (2)</span>
                    </button>
                    {user?.role === 'recruiter' && (
                      <Link href="/Job_portail/post-job" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full mt-2">Post a Job</Button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}