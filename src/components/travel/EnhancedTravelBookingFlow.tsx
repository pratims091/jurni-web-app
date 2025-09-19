import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LocationSearchStep } from './LocationSearchStep';
import { BudgetDurationStep } from './BudgetDurationStep';
import { ActivitiesSelectionStep } from './ActivitiesSelectionStep';
import { DayWiseActivityPlanner } from './DayWiseActivityPlanner';
import { EnhancedHotelsStep } from './EnhancedHotelsStep';
import { EnhancedFlightsStep } from './EnhancedFlightsStep';
import { SignupLoginStep } from './SignupLoginStep';
import { TripMembersStep } from './TripMembersStep';
import { FinalItinerary } from './FinalItinerary';

type Step = 'location' | 'budget-duration' | 'activities' | 'day-planner' | 'hotels' | 'flights' | 'summary' | 'auth' | 'members' | 'saved';

interface TripData {
  locationInfo?: any;
  budgetDurationData?: any;
  activitiesData?: any;
  dayPlansData?: any;
  hotelsData?: any;
  flightsData?: any;
  authData?: any;
  membersData?: any;
}

export const EnhancedTravelBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [tripData, setTripData] = useState<TripData>({});
  const { toast } = useToast();

  const steps: Step[] = ['location', 'budget-duration', 'activities', 'day-planner', 'hotels', 'flights', 'summary', 'auth', 'members', 'saved'];
  const currentStepIndex = steps.indexOf(currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleLocationNext = (data: any) => {
    setTripData({ ...tripData, locationInfo: data });
    setCurrentStep('budget-duration');
  };

  const handleBudgetDurationNext = (data: any) => {
    setTripData({ ...tripData, budgetDurationData: data });
    setCurrentStep('activities');
  };

  const handleActivitiesNext = (data: any) => {
    setTripData({ ...tripData, activitiesData: data });
    setCurrentStep('day-planner');
  };

  const handleDayPlannerNext = (data: any) => {
    setTripData({ ...tripData, dayPlansData: data });
    setCurrentStep('hotels');
  };

  const handleHotelsNext = (data: any) => {
    setTripData({ ...tripData, hotelsData: data });
    setCurrentStep('flights');
  };

  const handleFlightsNext = (data: any) => {
    setTripData({ ...tripData, flightsData: data });
    setCurrentStep('summary');
  };

  const handleSummaryNext = () => {
    setCurrentStep('auth');
  };

  const handleAuthNext = (data: any) => {
    setTripData({ ...tripData, authData: data });
    setCurrentStep('members');
  };

  const handleMembersNext = (data: any) => {
    setTripData({ ...tripData, membersData: data });
    
    // Save complete trip to localStorage
    const completeTrip = {
      id: Date.now().toString(),
      ...tripData,
      membersData: data,
      dayPlansData: tripData.dayPlansData,
      createdAt: new Date().toISOString(),
      userEmail: tripData.authData?.user?.email
    };

    const existingTrips = JSON.parse(localStorage.getItem('saved_trips') || '[]');
    existingTrips.push(completeTrip);
    localStorage.setItem('saved_trips', JSON.stringify(existingTrips));

    toast({
      title: "Trip Saved Successfully!",
      description: "Your perfect trip has been saved to My Trips.",
    });

    setCurrentStep('saved');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'location':
        return (
          <LocationSearchStep
            onNext={handleLocationNext}
            initialData={tripData.locationInfo}
          />
        );
      
      case 'budget-duration':
        return (
          <BudgetDurationStep
            onNext={handleBudgetDurationNext}
            onBack={goToPreviousStep}
            initialData={tripData.budgetDurationData}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
          />
        );
        
        case 'activities':
        return (
          <ActivitiesSelectionStep
            onNext={handleActivitiesNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            budget={tripData.budgetDurationData?.budget || 50000}
            duration={tripData.budgetDurationData?.duration || 5}
            isFlexibleBudget={tripData.budgetDurationData?.budgetFlexible}
          />
        );
        
      case 'day-planner':
        return (
          <DayWiseActivityPlanner
            activities={tripData.activitiesData?.selectedActivities || []}
            duration={tripData.budgetDurationData?.duration || 5}
            onNext={handleDayPlannerNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
          />
        );
        
      case 'hotels':
        return (
          <EnhancedHotelsStep
            onNext={handleHotelsNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            budget={tripData.budgetDurationData?.budget || 50000}
            duration={tripData.budgetDurationData?.duration || 5}
            travelers={tripData.locationInfo?.numberOfTravelers || 2}
          />
        );
        
      case 'flights':
        return (
          <EnhancedFlightsStep
            onNext={handleFlightsNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            departureCity={tripData.locationInfo?.departureCity || 'Your City'}
            departureDate="2024-01-15"
            returnDate="2024-01-20"
            travelers={tripData.locationInfo?.numberOfTravelers || 2}
          />
        );
        
      case 'summary':
        // Calculate final cost
        const hotelCost = tripData.hotelsData?.selectedHotel ? 
          tripData.hotelsData.selectedHotel.price * (tripData.budgetDurationData?.duration || 5) : 0;
        const flightCost = tripData.flightsData?.selectedFlight?.price || 0;
        const activitiesCost = tripData.dayPlansData?.reduce((sum: number, day: any) => sum + day.totalCost, 0) || 0;
        const finalCost = hotelCost + flightCost + activitiesCost;

        return (
          <FinalItinerary 
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            duration={tripData.budgetDurationData?.duration || 5}
            budget={tripData.budgetDurationData?.budget || 50000}
            isFlexibleBudget={tripData.budgetDurationData?.budgetFlexible || false}
            finalCost={finalCost}
            dayPlans={tripData.dayPlansData || []}
            hotel={tripData.hotelsData?.selectedHotel}
            flight={tripData.flightsData?.selectedFlight}
            members={tripData.membersData?.members || []}
            userEmail={tripData.authData?.user?.email || ''}
            startDate={tripData.budgetDurationData?.startDate}
            endDate={tripData.budgetDurationData?.endDate}
            onConfirm={() => {
              handleSummaryNext();
            }}
            onStartOver={() => {
              setCurrentStep('location');
              setTripData({});
            }}
          />
        );
        
      case 'auth':
        return (
          <SignupLoginStep
            onNext={handleAuthNext}
            onBack={goToPreviousStep}
          />
        );
        
      case 'members':
        return (
          <TripMembersStep
            onNext={handleMembersNext}
            onBack={goToPreviousStep}
            totalTravelers={tripData.locationInfo?.numberOfTravelers || 2}
            userEmail={tripData.authData?.user?.email || ''}
            userName={tripData.authData?.user?.name || ''}
          />
        );
        
      case 'saved':
        return (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Trip Saved Successfully!</h2>
            <p className="text-muted-foreground">Your perfect trip has been saved and you can access it anytime from My Trips.</p>
            <button 
              onClick={() => setCurrentStep('location')} 
              className="btn btn-primary"
            >
              Plan Another Trip
            </button>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {renderCurrentStep()}
    </div>
  );
};