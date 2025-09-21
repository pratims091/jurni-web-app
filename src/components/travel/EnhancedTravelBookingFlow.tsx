import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LocationSearchStep } from './LocationSearchStep';
import { BudgetDurationStep } from './BudgetDurationStep';
import { ActivitiesSelectionStep } from './ActivitiesSelectionStep';
import { DayWiseActivityPlanner } from './DayWiseActivityPlanner';
import { EnhancedHotelsStep } from './EnhancedHotelsStep';
import { FlightsStep } from './FlightsStep';
import { SignupLoginStep } from './SignupLoginStep';
import { FinalItinerary } from './FinalItinerary';

type Step = 'location' | 'budget-duration' | 'activities' | 'day-planner' | 'hotels' | 'flights' | 'summary' | 'auth';

interface TripData {
  locationInfo?: any;
  budgetDurationData?: any;
  activitiesData?: any;
  dayPlansData?: any;
  hotelsData?: any;
  flightsData?: any;
  authData?: any;
}

export const EnhancedTravelBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [tripData, setTripData] = useState<TripData>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps: Step[] = ['location', 'budget-duration', 'activities', 'day-planner', 'hotels', 'flights', 'summary', 'auth'];
  const currentStepIndex = steps.indexOf(currentStep);

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

  const handleDayPlannerNext = (data: { dayPlans: any[], hotels: any[] }) => {
    const dayPlansData = {
      dayPlans: data.dayPlans,
      totalCost: data.dayPlans.reduce((total: number, day: any) => total + day.totalCost, 0),
    };
    setTripData({ ...tripData, dayPlansData, hotelsData: { hotels: data.hotels } });
    setCurrentStep('hotels');
  };

  const handleHotelsNext = (data: { selectedHotel: any, skipHotel: boolean, totalCost: number, flights: any[] }) => {
    setTripData(prevTripData => ({
        ...prevTripData,
        hotelsData: {
            ...prevTripData.hotelsData,
            selectedHotel: data.selectedHotel,
            skipHotel: data.skipHotel,
            totalCost: data.totalCost
        },
        flightsData: { flights: data.flights }
    }));
    setCurrentStep('flights');
  };

  const handleFlightsNext = (data: { selectedFlight: any, skipFlight: boolean, totalCost: number }) => {
    setTripData(prevTripData => ({
        ...prevTripData,
        flightsData: {
            ...prevTripData.flightsData,
            selectedFlight: data.selectedFlight,
            skipFlight: data.skipFlight,
            totalCost: data.totalCost
        }
    }));
    setCurrentStep('summary');
  };

  const handleSummaryNext = () => {
    const currentUser = localStorage.getItem('travel_current_user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      handleAuthNext({ user: userData, isAuthenticated: true });
    } else {
      setCurrentStep('auth');
    }
  };

  const handleAuthNext = (data: any) => {
    const updatedTripData = { ...tripData, authData: data };
    setTripData(updatedTripData);

    const completeTrip = {
      id: Date.now().toString(),
      ...updatedTripData,
      createdAt: new Date().toISOString(),
      userEmail: data?.user?.email,
      location: updatedTripData.locationInfo?.destination,
      duration: updatedTripData.budgetDurationData?.duration,
      budget: updatedTripData.budgetDurationData?.budget,
    };

    const existingTrips = JSON.parse(localStorage.getItem('saved_trips') || '[]');
    existingTrips.push(completeTrip);
    localStorage.setItem('saved_trips', JSON.stringify(existingTrips));

    toast({
      title: "Trip Saved Successfully!",
      description: "Your perfect trip has been saved to My Trips.",
    });

    navigate('/dashboard');
  };

  const renderCurrentStep = () => {
    const initialBudget = tripData.budgetDurationData?.budget || 0;
    const activitiesCost = tripData.dayPlansData?.totalCost || 0;
    const hotelCost = tripData.hotelsData?.totalCost || 0;

    switch (currentStep) {
      case 'location':
        return <LocationSearchStep onNext={handleLocationNext} initialData={tripData.locationInfo} />;
      
      case 'budget-duration':
        return (
          <BudgetDurationStep
            onNext={handleBudgetDurationNext}
            onBack={goToPreviousStep}
            initialData={tripData.budgetDurationData}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            departure={tripData.locationInfo?.departureCity || ''}
            totalTravellers={tripData.locationInfo?.travelers?.length || 1}
          />
        );
        
      case 'activities':
        return (
          <ActivitiesSelectionStep
            onNext={handleActivitiesNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            budget={initialBudget}
            duration={tripData.budgetDurationData?.duration || 5}
            activities={tripData.budgetDurationData?.activities || []}
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
            departure={tripData.locationInfo?.departureCity || ''}
            budget={tripData.budgetDurationData?.budget || 0}
            currency={tripData.budgetDurationData?.currency || 'INR'}
            totalTravellers={tripData.locationInfo?.travelers?.length || 1}
            startDate={tripData.budgetDurationData?.startDate}
            endDate={tripData.budgetDurationData?.endDate}
          />
        );
        
      case 'hotels':
        return (
          <EnhancedHotelsStep
            onNext={handleHotelsNext}
            onBack={goToPreviousStep}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            departure={tripData.locationInfo?.departureCity || ''}
            budget={initialBudget}
            currency={tripData.budgetDurationData?.currency || 'INR'}
            spent={activitiesCost}
            duration={tripData.budgetDurationData?.duration || 5}
            travelers={tripData.locationInfo?.travelers.length || 2}
            hotels={tripData.hotelsData?.hotels || []}
            initialData={tripData.hotelsData}
            startDate={tripData.budgetDurationData?.startDate}
            endDate={tripData.budgetDurationData?.endDate}
            isFlexibleBudget={tripData.budgetDurationData?.budgetFlexible}
          />
        );
        
      case 'flights':
        return (
          <FlightsStep
            onNext={handleFlightsNext}
            onBack={goToPreviousStep}
            departure={tripData.locationInfo?.departureCity || 'Your Location'}
            destination={tripData.locationInfo?.destination || 'Selected Destination'}
            travelers={tripData.locationInfo?.travelers.length || 1}
            budget={initialBudget}
            spent={activitiesCost + hotelCost}
            flights={tripData.flightsData?.flights || []}
            initialData={tripData.flightsData}
            isFlexibleBudget={tripData.budgetDurationData?.budgetFlexible}
          />
        );
        
      case 'summary':
        return (
          <FinalItinerary 
            locationInfo={tripData.locationInfo}
            budgetDurationData={tripData.budgetDurationData}
            activitiesData={tripData.dayPlansData}
            selectedHotel={tripData.hotelsData?.selectedHotel}
            selectedFlight={tripData.flightsData?.selectedFlight}
            userEmail={tripData.authData?.user?.email || ''}
            onConfirm={handleSummaryNext}
            onStartOver={() => {
              setCurrentStep('location');
              setTripData({});
            }}
          />
        );
        
      case 'auth':
        return <SignupLoginStep onNext={handleAuthNext} onBack={goToPreviousStep} />;
        
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