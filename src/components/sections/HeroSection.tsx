import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, DollarSign } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

interface HeroSectionProps {
  onStartBooking: () => void;
}

export const HeroSection = ({ onStartBooking }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Your Dream Trip
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover amazing destinations, book perfect accommodations, and create unforgettable memories with our intelligent travel planning platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={onStartBooking}
              variant="hero" 
              size="xl"
              className="group"
            >
              Start Planning Your Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>100+ Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Flexible Dates</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};