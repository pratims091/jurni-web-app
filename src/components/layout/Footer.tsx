import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plane, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">TravelPlan</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Making dream trips accessible to everyone through intelligent planning and personalized experiences.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-3">
              {[
                { label: 'Home', value: 'home' },
                { label: 'Features', value: 'features' },
                { label: 'How It Works', value: 'how-it-works' },
                { label: 'Pricing', value: 'pricing' },
                { label: 'About Us', value: 'about' },
              ].map((link) => (
                <button
                  key={link.value}
                  onClick={() => onNavigate(link.value)}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-3">
              {[
                'Help Center',
                'Travel Insurance',
                'Booking Support',
                'Cancellation Policy',
                'Travel Guidelines',
              ].map((item) => (
                <div key={item} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to get travel tips, exclusive deals, and destination inspiration.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background"
              />
              <Button variant="travel" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Head Office</p>
              <p className="text-sm text-muted-foreground">123 Travel Street, City, Country</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">support@travelplan.com</p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © {currentYear} TravelPlan. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
            <button className="hover:text-primary transition-colors">Terms of Service</button>
            <button className="hover:text-primary transition-colors">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};