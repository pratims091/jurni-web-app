// @ts-nocheck
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LocationSearchStep } from './LocationSearchStep';
import { BudgetDurationStep } from './BudgetDurationStep';
import { ActivitiesSelectionStep } from './ActivitiesSelectionStep';
import { EnhancedHotelsStep } from './EnhancedHotelsStep';
import { EnhancedFlightsStep } from './EnhancedFlightsStep';
import { SignupLoginStep } from './SignupLoginStep';
import { TripMembersStep } from './TripMembersStep';
import { BookingSummary } from './BookingSummary';
import { FinalItinerary } from './FinalItinerary';
import { format } from 'date-fns';

export interface BookingStep {
  step: 'location' | 'budget-duration' | 'activities' | 'hotels' | 'flights' | 'summary' | 'confirmation' | 'auth' | 'members' | 'saved';
  // Location data
  locationInfo?: any;
  // Budget & Duration data
  budgetDurationData?: any;
  // Activities data
  activitiesData?: any;
  // Hotels data
  hotelsData?: any;
  // Flights data
  flightsData?: any;
  // Auth data
  authData?: any;
  // Members data
  membersData?: any;
}

export const TravelBookingFlow = () => {
  const [bookingState, setBookingState] = useState<BookingStep>({ step: 'location' });
  const { toast } = useToast();

  const handleLocationNext = (locationInfo) => {
    setBookingState({ ...bookingState, locationInfo, step: 'budget-duration' });
  };

  const handleBudgetNext = (budgetDurationData) => {
    setBookingState({ ...bookingState, budgetDurationData, step: 'activities' });
  };

  const handleActivitiesNext = (activitiesData) => {
    setBookingState({ ...bookingState, activitiesData, step: 'hotels' });
  };
  
  const selectHotel = (hotel: Hotel) => {
    setBookingState({ ...bookingState, selectedHotel: hotel, step: 'flights' });
    toast({
      title: "Hotel Booked",
      description: `${hotel.name} reserved successfully!`,
    });
  };

  const skipHotel = () => {
    setBookingState({ ...bookingState, skipHotel: true, step: 'flights' });
    toast({
      title: "Hotel Skipped",
      description: "You can book accommodation on your own.",
    });
  };

  const selectFlight = (flight: Flight) => {
    setBookingState({ ...bookingState, selectedFlight: flight, step: 'summary' });
    toast({
      title: "Flight Booked",
      description: `${flight.airline} flight reserved successfully!`,
    });
  };

  const skipFlight = () => {
    setBookingState({ ...bookingState, skipFlight: true, step: 'summary' });
    toast({
      title: "Flight Skipped",
      description: "You can book transportation on your own.",
    });
  };

  const goToPreviousStep = () => {
    const steps = ['location', 'budget-duration', 'activities', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);
    if (currentIndex > 0) {
      setBookingState({ ...bookingState, step: steps[currentIndex - 1] as BookingStep['step'] });
    }
  };

  const goToNextStep = () => {
    const steps = ['location', 'budget-duration', 'activities', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);
    if (currentIndex < steps.length - 1) {
      setBookingState({ ...bookingState, step: steps[currentIndex + 1] as BookingStep['step'] });
    }
  };

  const renderStepIndicator = () => {
    const steps = ['location', 'budget-duration', 'activities', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index <= currentIndex 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-0.5 mx-2
                ${index < currentIndex ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderSummary = () => {
    const getTotalCost = () => {
      let total = 0;
      const days = bookingState.budgetDurationData?.startDate && bookingState.budgetDurationData?.endDate 
        ? Math.ceil((bookingState.budgetDurationData.endDate.getTime() - bookingState.budgetDurationData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 1;
      
      if (bookingState.selectedHotel) {
        total += bookingState.selectedHotel.price * days;
      }
      if (bookingState.selectedFlight) {
        total += bookingState.selectedFlight.price;
      }
      if (bookingState.activitiesData) {
        total += bookingState.activitiesData.totalCost;
      }
      
      return total;
    };

    return (
      <BookingSummary
        bookingState={bookingState}
        onStartOver={() => setBookingState({ step: 'location' })}
        onConfirm={() => setBookingState({ ...bookingState, step: 'confirmation' })}
        totalCost={getTotalCost()}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {bookingState.step !== 'confirmation' && renderStepIndicator()}
        
        {bookingState.step === 'location' && <LocationSearchStep onNext={handleLocationNext} initialData={bookingState.locationInfo} />}
        {bookingState.step === 'budget-duration' && <BudgetDurationStep onNext={handleBudgetNext} onBack={goToPreviousStep} destination={bookingState.locationInfo.destination} initialData={bookingState.budgetDurationData} />}
        {bookingState.step === 'activities' && <ActivitiesSelectionStep onNext={handleActivitiesNext} onBack={goToPreviousStep} />}
        {bookingState.step === 'hotels' && <EnhancedHotelsStep onNext={selectHotel} onSkip={skipHotel} onBack={goToPreviousStep} destination={bookingState.locationInfo.destination} budget={bookingState.budgetDurationData.budget} duration={bookingState.budgetDurationData.endDate ? Math.ceil((bookingState.budgetDurationData.endDate.getTime() - bookingState.budgetDurationData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1} travelers={bookingState.locationInfo.travelers.length} />}
        {bookingState.step === 'flights' && <EnhancedFlightsStep onNext={selectFlight} onSkip={skipFlight} onBack={goToPreviousStep} />}
        {bookingState.step === 'summary' && renderSummary()}
        {bookingState.step === 'confirmation' && <FinalItinerary {...bookingState} onStartOver={() => setBookingState({ step: 'location' })} onConfirm={() => toast({ title: 'Trip Saved!' })} />}
      </div>
    </div>
  );
};