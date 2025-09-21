import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Plane, LogOut, User } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  onNavigate: (section: string) => void;
}

interface UserData {
  name: string;
  email: string;
}

type NavItem = {
  label: string;
  value: string;
  isExternal?: boolean;
  path?: string;
};

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('travel_current_user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        setCurrentUser(null);
      }
    }

    const handleStorageChange = () => {
        const user = localStorage.getItem('travel_current_user');
        if (user) {
            try {
                setCurrentUser(JSON.parse(user));
            } catch (e) {
                console.error("Failed to parse user data:", e);
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null)
        }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('travel_current_user');
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signup');
  }

  const navItems: NavItem[] = [
    { label: t('home'), value: 'home' },
    { label: t('features'), value: 'features' },
    { label: t('how_it_works'), value: 'how-it-works' },
    { label: t('dashboard'), value: 'dashboard', isExternal: true, path: '/dashboard' },
    { label: t('about'), value: 'about' },
  ];

  const handleNavClick = (item: NavItem) => {
    if (!item.isExternal) {
      onNavigate(item.value);
    }
    setIsOpen(false);
  };

  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {currentUser?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{currentUser?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          My Trips
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderAuthButtons = () => (
    <>
      <Button variant="ghost" onClick={handleSignIn}>
        {t('sign_in')}
      </Button>
      <Button variant="travel" onClick={() => onNavigate('booking')}>
        {t('start_planning')}
      </Button>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick({ label: 'home', value: 'home' })}
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold">TravelPlan</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.value}
                  to={item.path || '/'}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item)}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {currentUser ? renderUserMenu() : renderAuthButtons()}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                    item.isExternal ? (
                        <Link
                          key={item.value}
                          to={item.path || '/'}
                          className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                            key={item.value}
                            onClick={() => handleNavClick(item)}
                            className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                        >
                            {item.label}
                        </button>
                      )
                ))}
                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex justify-center">
                    <LanguageSwitcher />
                  </div>
                  {currentUser ? (
                    <div className="flex flex-col space-y-2">
                        <p className="text-center font-semibold">{currentUser.name}</p>
                        <Button variant="outline" onClick={() => { handleLogout(); setIsOpen(false); }}>Logout</Button>
                    </div>
                  ) : (
                    <>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                                handleSignIn();
                                setIsOpen(false);
                            }}
                        >
                            {t('sign_in')}
                        </Button>
                        <Button 
                            variant="travel" 
                            className="w-full"
                            onClick={() => {
                                onNavigate('booking');
                                setIsOpen(false);
                            }}
                        >
                            {t('start_planning')}
                        </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};