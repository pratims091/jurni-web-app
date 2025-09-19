import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Plane } from 'lucide-react';
import { GoogleTranslate } from '@/components/ui/google-translate';

interface NavigationProps {
  onNavigate: (section: string) => void;
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Features', value: 'features' },
    { label: 'How It Works', value: 'how-it-works' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'About', value: 'about' },
  ];

  const handleNavClick = (value: string) => {
    onNavigate(value);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold">TravelPlan</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <GoogleTranslate />
            <Button 
              variant="ghost" 
              onClick={() => handleNavClick('booking')}
            >
              Sign In
            </Button>
            <Button 
              variant="travel" 
              onClick={() => handleNavClick('booking')}
            >
              Start Planning
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleNavClick(item.value)}
                    className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex justify-center">
                    <GoogleTranslate />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavClick('booking')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="travel" 
                    className="w-full"
                    onClick={() => handleNavClick('booking')}
                  >
                    Start Planning
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};