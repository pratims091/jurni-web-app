import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    if (['home', 'features', 'how-it-works', 'about'].includes(section)) {
      navigate(`/#${section}`);
    } else if (section === 'booking') {
      // This can be changed to a login/signup modal or page
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigation} />
      <main className="pt-16">
        {children}
      </main>
      <Footer onNavigate={handleNavigation} />
    </div>
  );
};
