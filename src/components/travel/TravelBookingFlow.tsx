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

export interface BookingStep {
  step: 'location' | 'budget-duration' | 'activities' | 'hotels' | 'flights' | 'summary' | 'auth' | 'members' | 'saved';
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

  // City options for combobox
  const cityOptions: ComboboxOption[] = [
    // Popular international cities
    { value: 'new-york', label: 'New York, USA' },
    { value: 'london', label: 'London, UK' },
    { value: 'paris', label: 'Paris, France' },
    { value: 'tokyo', label: 'Tokyo, Japan' },
    { value: 'dubai', label: 'Dubai, UAE' },
    { value: 'sydney', label: 'Sydney, Australia' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'bangkok', label: 'Bangkok, Thailand' },
    { value: 'barcelona', label: 'Barcelona, Spain' },
    { value: 'rome', label: 'Rome, Italy' },
    // Indian cities
    { value: 'mumbai', label: 'Mumbai, India' },
    { value: 'delhi', label: 'Delhi, India' },
    { value: 'bangalore', label: 'Bangalore, India' },
    { value: 'chennai', label: 'Chennai, India' },
    { value: 'kolkata', label: 'Kolkata, India' },
    { value: 'pune', label: 'Pune, India' },
    { value: 'hyderabad', label: 'Hyderabad, India' },
    { value: 'ahmedabad', label: 'Ahmedabad, India' },
    { value: 'jaipur', label: 'Jaipur, India' },
    { value: 'lucknow', label: 'Lucknow, India' },
  ];

  const validateBudget = (value: string): boolean => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0 && value.trim() !== '';
  };

  const handleBudgetSubmit = () => {
    setBudgetError(false);
    if (!validateBudget(budgetInput)) {
      setBudgetError(true);
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid numeric budget amount.",
        variant: "destructive",
      });
      return;
    }
    const budget = parseFloat(budgetInput);
    setBookingState({ ...bookingState, budget, step: 'hotels' });
    toast({
      title: "Budget Confirmed",
      description: `Budget of $${budget} has been set successfully!`,
    });
  };

  const handleFlexibleBudget = () => {
    setBookingState({ ...bookingState, budgetFlexible: true, step: 'hotels' });
    toast({
      title: "Budget Set to Flexible",
      description: "We'll suggest the best options for you!",
    });
  };

  const selectCity = (city: City) => {
    if (!departureCity.trim() || !numberOfTravelers.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in departure city and number of travelers.",
        variant: "destructive",
      });
      return;
    }
    setBookingState({ 
      ...bookingState, 
      selectedCity: city, 
      departureCity: departureCity.trim(),
      numberOfTravelers: parseInt(numberOfTravelers),
      step: 'dates' 
    });
    toast({
      title: "Destination Selected",
      description: `${city.name}, ${city.country} selected!`,
    });
  };

  const handleCustomCity = () => {
    if (!customCityInput.trim() || !departureCity.trim() || !numberOfTravelers.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields: destination, departure city, and number of travelers.",
        variant: "destructive",
      });
      return;
    }
    setBookingState({ 
      ...bookingState, 
      customCity: customCityInput.trim(),
      departureCity: departureCity.trim(),
      numberOfTravelers: parseInt(numberOfTravelers),
      step: 'dates' 
    });
    toast({
      title: "Custom Destination Added",
      description: `${customCityInput} selected!`,
    });
  };

  const selectDates = (startDate: Date, endDate: Date) => {
    setBookingState({ 
      ...bookingState, 
      startDate, 
      endDate, 
      step: 'budget' 
    });
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    toast({
      title: "Dates Selected",
      description: `${days}-day trip from ${format(startDate, 'MMM dd')} to ${format(endDate, 'MMM dd')}`,
    });
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
    const steps = ['city', 'dates', 'budget', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);
    if (currentIndex > 0) {
      setBookingState({ ...bookingState, step: steps[currentIndex - 1] as BookingStep['step'] });
    }
  };

  const goToNextStep = () => {
    const steps = ['city', 'dates', 'budget', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);
    if (currentIndex < steps.length - 1) {
      setBookingState({ ...bookingState, step: steps[currentIndex + 1] as BookingStep['step'] });
    }
  };

  const renderNavigationButtons = () => {
    const steps = ['city', 'dates', 'budget', 'hotels', 'flights', 'summary'];
    const currentIndex = steps.indexOf(bookingState.step);
    
    if (bookingState.step === 'confirmation' || bookingState.step === 'saved-plans') {
      return null;
    }

    return (
      <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
        <Button 
          onClick={goToPreviousStep}
          variant="outline"
          disabled={currentIndex <= 0}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
        <Button 
          onClick={goToNextStep}
          variant="travel"
          disabled={currentIndex >= steps.length - 1}
          className="flex items-center gap-2"
        >
          Next →
        </Button>
      </div>
    );
  };

  const renderStepIndicator = () => {
    const steps = ['city', 'dates', 'budget', 'hotels', 'flights', 'summary'];
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

  const renderCitySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Plan Your Perfect Trip</h2>
        <p className="text-muted-foreground">Let's start by gathering some basic information about your travel plans</p>
      </div>

      {/* Travel Details Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Travel Information
          </CardTitle>
          <CardDescription>Tell us about your travel preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure">Departure City</Label>
              <Combobox
                options={cityOptions}
                value={departureCity}
                onChange={setDepartureCity}
                placeholder="Select departure city"
                searchPlaceholder="Search cities..."
                emptyMessage="No cities found."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Select value={numberOfTravelers} onValueChange={setNumberOfTravelers}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Traveler</SelectItem>
                  <SelectItem value="2">2 Travelers</SelectItem>
                  <SelectItem value="3">3 Travelers</SelectItem>
                  <SelectItem value="4">4 Travelers</SelectItem>
                  <SelectItem value="5">5 Travelers</SelectItem>
                  <SelectItem value="6">6+ Travelers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Destination Input */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Custom Destination</CardTitle>
          <CardDescription>Enter any destination you'd like to visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Combobox
              options={cityOptions}
              value={customCityInput}
              onChange={setCustomCityInput}
              placeholder="Select or type destination..."
              searchPlaceholder="Search destinations..."
              emptyMessage="No destinations found."
              className="flex-1"
            />
            <Button onClick={handleCustomCity} variant="travel">
              Add Destination
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Indian Destinations */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold mb-2">Popular Indian Destinations</h3>
        <p className="text-muted-foreground">Or choose from these amazing destinations in India</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {mockCities.map((city) => (
          <Card key={city.id} className="cursor-pointer hover:shadow-elevation transition-smooth group" 
                onClick={() => selectCity(city)}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <CardTitle className="group-hover:text-primary transition-colors">
                  {city.name}, {city.country}
                </CardTitle>
              </div>
              <CardDescription>{city.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {city.attractions.slice(0, 3).map((attraction) => (
                    <Badge key={attraction} variant="secondary" className="text-xs">
                      {attraction}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost range</span>
                  <span className="font-semibold text-primary">₹{Math.round(city.averageCost * 75 - 1000)} - ₹{Math.round(city.averageCost * 75 + 1000)}/day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {renderNavigationButtons()}
    </div>
  );

  const renderDateSelection = () => {
    return (
      <DateSelection 
        onDatesSelected={selectDates}
        destinationName={bookingState.selectedCity?.name || bookingState.customCity}
      />
    );
  };

  const renderBudgetInput = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Set Your Budget</h2>
        <p className="text-muted-foreground">
          Enter your total budget for this {
            bookingState.startDate && bookingState.endDate 
              ? Math.ceil((bookingState.endDate.getTime() - bookingState.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
              : bookingState.selectedDuration?.days || bookingState.customDuration || 1
          }-day trip
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <Input
                type="number"
                placeholder="Enter your budget (e.g., 1500)"
                value={budgetInput}
                onChange={(e) => {
                  setBudgetInput(e.target.value);
                  if (budgetError) setBudgetError(false);
                }}
                className={budgetError ? "border-destructive ring-destructive" : ""}
              />
              <Button onClick={handleBudgetSubmit} variant="travel">
                Confirm Budget
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Or</p>
              <Button onClick={handleFlexibleBudget} variant="outline" size="sm">
                I don't have a specific budget - suggest the best for me
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <h3 className="text-xl font-semibold col-span-full">Budget Suggestions</h3>
        {mockBudgetPlans.map((plan) => (
          <Card key={plan.id} className="cursor-pointer hover:shadow-card transition-smooth"
                onClick={() => {
                  setBudgetInput(plan.budget.toString());
                  setBudgetError(false);
                }}>
            <CardHeader>
              <CardTitle className="text-lg">${plan.budget} - {plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {plan.includes.slice(0, 3).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {renderNavigationButtons()}
    </div>
  );

  const renderHotelSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Accommodation</h2>
        <p className="text-muted-foreground">
          Find the perfect place to stay in {bookingState.selectedCity?.name || bookingState.customCity}
        </p>
      </div>

      <div className="text-center mb-6">
        <Button onClick={skipHotel} variant="outline">
          Skip - I'll book accommodation myself
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mockHotels.map((hotel) => (
          <Card key={hotel.id} className="cursor-pointer hover:shadow-elevation transition-smooth group">
          <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
            <HotelIcon className="w-12 h-12 text-muted-foreground" />
          </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="group-hover:text-primary transition-colors">
                  {hotel.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
        ))}
      </div>
      {renderNavigationButtons()}
    </div>
              <CardDescription>{hotel.location} • {hotel.reviews} reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{hotel.description}</p>
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${hotel.price}</span>
                  <Button onClick={() => selectHotel(hotel)} variant="travel" size="sm">
                    Select Hotel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {renderNavigationButtons()}
    </div>
  );

  const renderFlightSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Flight</h2>
        <p className="text-muted-foreground">
          Select the best flight option for your trip
        </p>
      </div>

      <div className="text-center mb-6">
        <Button onClick={skipFlight} variant="outline">
          Skip - I'll book transportation myself
        </Button>
      </div>

      <div className="space-y-4">
        {mockFlights.map((flight) => (
          <Card key={flight.id} className="cursor-pointer hover:shadow-elevation transition-smooth group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm text-muted-foreground">{flight.aircraft}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-semibold">{flight.departure}</p>
                      <p className="text-sm text-muted-foreground">Departure</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-border" />
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div className="w-8 h-0.5 bg-border" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{flight.arrival}</p>
                      <p className="text-sm text-muted-foreground">Arrival</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold">{flight.duration}</p>
                    <p className="text-sm text-muted-foreground">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${flight.price}</p>
                  <Button onClick={() => selectFlight(flight)} variant="travel" size="sm">
                    Select Flight
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {renderNavigationButtons()}
    </div>
  );

  const renderSummary = () => {
    const getTotalCost = () => {
      let total = 0;
      const days = bookingState.startDate && bookingState.endDate 
        ? Math.ceil((bookingState.endDate.getTime() - bookingState.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : bookingState.selectedDuration?.days || bookingState.customDuration || 1;
      
      if (bookingState.selectedHotel) {
        total += bookingState.selectedHotel.price * days;
      }
      if (bookingState.selectedFlight) {
        total += bookingState.selectedFlight.price;
      }
      
      return total;
    };

    const savePlan = () => {
      // In a real app, this would save to localStorage or backend
      toast({
        title: "Plan Saved",
        description: "Your travel plan has been saved for later!",
      });
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Trip Summary</h2>
          <p className="text-muted-foreground">Review your travel plan before confirming</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-semibold">
                  {bookingState.selectedCity?.name ? 
                    `${bookingState.selectedCity.name}, ${bookingState.selectedCity.country}` : 
                    bookingState.customCity}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold">
                  {bookingState.startDate && bookingState.endDate 
                    ? `${Math.ceil((bookingState.endDate.getTime() - bookingState.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days`
                    : `${bookingState.selectedDuration?.days || bookingState.customDuration} days`
                  }
                </span>
              </div>
              {bookingState.startDate && bookingState.endDate && (
                <div className="flex justify-between">
                  <span>Travel Dates:</span>
                  <span className="font-semibold">
                    {format(bookingState.startDate, 'MMM dd')} - {format(bookingState.endDate, 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="font-semibold">
                  {bookingState.budgetFlexible ? 'Flexible' : `$${bookingState.budget}`}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookingState.selectedHotel ? (
                <div className="flex justify-between">
                  <span>Hotel ({
                    bookingState.startDate && bookingState.endDate 
                      ? Math.ceil((bookingState.endDate.getTime() - bookingState.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                      : bookingState.selectedDuration?.days || bookingState.customDuration || 1
                  } nights):</span>
                  <span>${bookingState.selectedHotel.price * (
                    bookingState.startDate && bookingState.endDate 
                      ? Math.ceil((bookingState.endDate.getTime() - bookingState.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                      : bookingState.selectedDuration?.days || bookingState.customDuration || 1
                  )}</span>
                </div>
              ) : bookingState.skipHotel ? (
                <div className="flex justify-between">
                  <span>Hotel:</span>
                  <span className="text-muted-foreground">Self-arranged</span>
                </div>
              ) : null}
              
              {bookingState.selectedFlight ? (
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span>${bookingState.selectedFlight.price}</span>
                </div>
              ) : bookingState.skipFlight ? (
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span className="text-muted-foreground">Self-arranged</span>
                </div>
              ) : null}
              
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Cost:</span>
                <span className="text-primary">${getTotalCost()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Plan and Saved Plans buttons - only show on summary page */}
        <div className="flex gap-4 justify-center mb-6">
          <Button onClick={savePlan} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
          <Button 
            onClick={() => setBookingState({ step: 'saved-plans' })} 
            variant="outline"
          >
            View Saved Plans
          </Button>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => setBookingState({ step: 'city' })} variant="outline">
            Start Over
          </Button>
          <Button 
            onClick={() => {
              setBookingState({ ...bookingState, step: 'confirmation' });
              toast({
                title: "Trip Confirmed!",
                description: "Your travel plan has been saved successfully.",
              });
            }} 
            variant="travel" 
            size="lg"
          >
            Confirm & Book Trip
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Booking Confirmation</h2>
        <p className="text-muted-foreground">Your travel package has been successfully reserved!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Destination Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Destination:</span>
              <span className="font-semibold">{bookingState.selectedCity?.name}, {bookingState.selectedCity?.country}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold">{bookingState.selectedDuration?.days} days</span>
            </div>
            <div className="flex justify-between">
              <span>Budget:</span>
              <span className="font-semibold">${bookingState.budget}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HotelIcon className="w-5 h-5" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Hotel:</span>
              <span className="font-semibold">{bookingState.selectedHotel?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>
              <div className="flex gap-1">
                {Array.from({ length: bookingState.selectedHotel?.rating || 0 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Price per night:</span>
              <span className="font-semibold">${bookingState.selectedHotel?.price}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Airline:</span>
                <span className="font-semibold">{bookingState.selectedFlight?.airline}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold">{bookingState.selectedFlight?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Stops:</span>
                <span className="font-semibold">
                  {bookingState.selectedFlight?.stops === 0 ? 'Non-stop' : `${bookingState.selectedFlight?.stops} stop${bookingState.selectedFlight && bookingState.selectedFlight.stops > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Departure:</span>
                <span className="font-semibold">{bookingState.selectedFlight?.departure}</span>
              </div>
              <div className="flex justify-between">
                <span>Arrival:</span>
                <span className="font-semibold">{bookingState.selectedFlight?.arrival}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-semibold text-primary">${bookingState.selectedFlight?.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setBookingState({ step: 'city' })} 
          variant="hero" 
          size="xl"
          className="mt-6"
        >
          Plan Another Trip
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Step indicator - no save buttons here anymore */}
        {renderStepIndicator()}
        
        {bookingState.step === 'saved-plans' && (
          <SavedPlansManager onLoadPlan={(plan) => setBookingState(plan)} />
        )}
        {bookingState.step === 'city' && renderCitySelection()}
        {bookingState.step === 'dates' && renderDateSelection()}
        {bookingState.step === 'budget' && renderBudgetInput()}
        {bookingState.step === 'hotels' && renderHotelSelection()}
        {bookingState.step === 'flights' && renderFlightSelection()}
        {bookingState.step === 'summary' && renderSummary()}
        {bookingState.step === 'confirmation' && renderConfirmation()}
      </div>
    </div>
  );
};
