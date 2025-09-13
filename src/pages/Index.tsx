import { useState, useRef } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TravelBookingFlow } from '@/components/travel/TravelBookingFlow';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'booking'>('landing');
  
  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

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
      'pricing': pricingRef,
      'about': aboutRef,
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
          <TravelBookingFlow />
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
        
        <div ref={pricingRef}>
          <PricingSection />
        </div>
        
        <div ref={aboutRef}>
          <AboutSection />
        </div>
      </main>

      <Footer onNavigate={handleNavigation} />
    </div>
  );
};

export default Index;
