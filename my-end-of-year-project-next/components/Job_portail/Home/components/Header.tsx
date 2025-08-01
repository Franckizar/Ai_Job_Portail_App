import { useState } from 'react';
import { Search, Bell, User, Menu, LogOut, Settings, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "./auth/AuthContext";
import { useRouter } from "./AppRouter";

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { navigateTo, currentView } = useRouter();

  const handleNavigation = (view: 'home' | 'jobs' | 'profile') => {
    navigateTo(view);
  };

  return (
    <>
      <header className="border-b bg-zinc-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('home')}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-medium">J</span>
                </div>
                <span className="text-xl font-medium text-black">JobPortal</span>
              </button>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => handleNavigation('jobs')}
                  className={`transition-colors ${
                    currentView === 'jobs' 
                      ? 'text-primary font-medium text-black' 
                      : 'text-foreground hover:text-primary text-black'
                  }`}
                >
                  Find Jobs
                </button>
                <button 
                  href="#" 
                  className="text-foreground hover:text-primary transition-colors text-black"
                >
                  Companies
                </button>
                <button 
                  href="#" 
                  className="text-foreground hover:text-primary transition-colors text-black"
                >
                  Salaries
                </button>
                <button 
                  href="#" 
                  className="text-foreground hover:text-primary transition-colors text-black"
                >
                  Resources
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm">
                        <p className="font-medium">{user?.profile?.full_name || user?.username}</p>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        My Applications
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {user?.role === 'recruiter' && (
                    <Button>
                      Post a Job
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="hidden sm:flex text-black"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In
                  </Button>
                  
                  <Button onClick={() => setShowAuthModal(true)} 
                    className='text-black'>
                    Get Started
                  </Button>
                </>
              )}
              
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}