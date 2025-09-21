import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { EnhancedTravelBookingFlow } from '@/components/travel/EnhancedTravelBookingFlow';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'booking'>('landing');
  
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
          let userId = localStorage.getItem('user_id');
          if (!userId) {
            userId = uuidv4();
            localStorage.setItem('user_id', userId);
          }
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/travel-planner/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          });
          const data = await response.json();
          if (data.session_id) {
            localStorage.setItem('session_id', data.session_id);
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };
    initSession();
  }, []);

  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (section: string) => {
    if (section === 'booking') {
      setCurrentView('booking');
      return;
    }

    setCurrentView('landing');

    const refs = {
      'home': heroRef,
      'features': featuresRef,
      'how-it-works': howItWorksRef,
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleStartBooking = () => {
    setCurrentView('booking');
  };

  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onNavigate={handleNavigation} />
        <div className="pt-16">
          <EnhancedTravelBookingFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigation} />
      
      <main>
        <div ref={heroRef}>
          <HeroSection onStartBooking={handleStartBooking} />
        </div>
        
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        
        <div ref={howItWorksRef}>
          <HowItWorksSection />
        </div>
      </main>

      <Footer onNavigate={handleNavigation} />
    </div>
  );
};

export default Index;