import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plane, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const { t } = useTranslation();
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
              <span className="text-xl font-bold">Jurni</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('footer_description')}
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
            <h3 className="text-lg font-semibold">{t('quick_links')}</h3>
            <div className="space-y-3">
              {[
                { label: t('home'), value: 'home' },
                { label: t('features'), value: 'features' },
                { label: t('how_it_works'), value: 'how-it-works' },
                { label: t('about_us'), value: 'about' },
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
            <h3 className="text-lg font-semibold">{t('support')}</h3>
            <div className="space-y-3">
              {[
                t('help_center'),
                t('travel_insurance'),
                t('booking_support'),
                t('cancellation_policy'),
                t('travel_guidelines'),
              ].map((item) => (
                <div key={item} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('stay_updated')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('newsletter_prompt')}
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder={t('enter_your_email')}
                className="bg-background"
              />
              <Button variant="travel" className="w-full">
                {t('subscribe')}
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
              <p className="font-medium">{t('head_office')}</p>
              <p className="text-sm text-muted-foreground">{t('head_office_address')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">{t('phone_support')}</p>
              <p className="text-sm text-muted-foreground">{t('phone_support_number')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">{t('email_support')}</p>
              <p className="text-sm text-muted-foreground">{t('email_support_address')}</p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Jurni. {t('all_rights_reserved')}
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <button className="hover:text-primary transition-colors">{t('privacy_policy')}</button>
            <button className="hover:text-primary transition-colors">{t('terms_of_service')}</button>
            <button className="hover:text-primary transition-colors">{t('cookie_policy')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};