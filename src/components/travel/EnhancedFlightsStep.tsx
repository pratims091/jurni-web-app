import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plane, 
  Clock, 
  DollarSign, 
  MapPin, 
  Wifi, 
  Coffee, 
  MonitorPlay,
  Utensils,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  stops: number;
  aircraft: string;
  class: 'economy' | 'business' | 'first';
  amenities: string[];
  baggage: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  layovers?: { city: string; duration: string }[];
}

interface FlightsData {
  selectedFlight?: Flight;
  skipFlight: boolean;
}

interface FlightsStepProps {
  onNext: (data: FlightsData) => void;
  onBack: () => void;
  destination: string;
  departureCity: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
}

const mockFlights: Flight[] = [
  // Economy Class
  {
    id: 'economy1',
    airline: 'SkyBlue Airways',
    flightNumber: 'SB-2341',
    price: 12000,
    duration: '2h 15m',
    departure: '14:30',
    arrival: '16:45',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-15',
    stops: 0,
    aircraft: 'Airbus A320',
    class: 'economy',
    amenities: ['Meal', 'Entertainment'],
    baggage: '15kg checked + 7kg cabin',
    departureAirport: 'DEL',
    arrivalAirport: 'GOI'
  },
  {
    id: 'economy2', 
    airline: 'Budget Wings',
    flightNumber: 'BW-5432',
    price: 8500,
    duration: '4h 30m',
    departure: '08:15',
    arrival: '13:45',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-15',
    stops: 1,
    aircraft: 'Boeing 737',
    class: 'economy',
    amenities: ['Snacks'],
    baggage: '15kg checked + 7kg cabin',
    departureAirport: 'DEL',
    arrivalAirport: 'GOI',
    layovers: [{ city: 'Mumbai', duration: '1h 20m' }]
  },
  {
    id: 'economy3',
    airline: 'QuickJet',
    flightNumber: 'QJ-7890',
    price: 15500,
    duration: '2h 45m',
    departure: '19:20',
    arrival: '22:05',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-15',
    stops: 0,
    aircraft: 'Boeing 787',
    class: 'economy',
    amenities: ['Meal', 'WiFi', 'Entertainment'],
    baggage: '20kg checked + 7kg cabin',
    departureAirport: 'DEL',
    arrivalAirport: 'GOI'
  },

  // Business Class
  {
    id: 'business1',
    airline: 'Premium Air',
    flightNumber: 'PA-1234',
    price: 35000,
    duration: '2h 10m',
    departure: '11:00',
    arrival: '13:10',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-15',
    stops: 0,
    aircraft: 'Airbus A321',
    class: 'business',
    amenities: ['Gourmet Meal', 'WiFi', 'Premium Entertainment', 'Lounge Access', 'Extra Legroom'],
    baggage: '30kg checked + 10kg cabin',
    departureAirport: 'DEL',
    arrivalAirport: 'GOI'
  },
  {
    id: 'business2',
    airline: 'Luxury Wings',
    flightNumber: 'LW-9876',
    price: 42000,
    duration: '2h 00m',
    departure: '16:15',
    arrival: '18:15',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-15',
    stops: 0,
    aircraft: 'Boeing 787-9',
    class: 'business',
    amenities: ['Lie-flat Seats', 'Gourmet Meal', 'WiFi', 'Premium Entertainment', 'Lounge Access', 'Priority Boarding'],
    baggage: '40kg checked + 12kg cabin',
    departureAirport: 'DEL',
    arrivalAirport: 'GOI'
  }
];

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Meal': Utensils,
  'Gourmet Meal': Utensils,
  'Entertainment': MonitorPlay,
  'Premium Entertainment': MonitorPlay,
  'Snacks': Coffee,
  'Lounge Access': Coffee,
  'Extra Legroom': CheckCircle,
  'Lie-flat Seats': CheckCircle,
  'Priority Boarding': CheckCircle
};

const classColors = {
  economy: 'bg-blue-100 text-blue-800 border-blue-200',
  business: 'bg-purple-100 text-purple-800 border-purple-200',
  first: 'bg-gold-100 text-gold-800 border-gold-200'
};

export const EnhancedFlightsStep = ({ onNext, onBack, destination, departureCity, departureDate, returnDate, travelers }: FlightsStepProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');

  const filteredFlights = filterClass === 'all' 
    ? mockFlights 
    : mockFlights.filter(flight => flight.class === filterClass);

  const handleFlightSelect = (flight: Flight) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setSelectedFlight(flight);
      setIsLoading(false);
    }, 1200);
  };

  const handleSkipFlight = () => {
    const data: FlightsData = {
      skipFlight: true
    };
    onNext(data);
  };

  const handleNext = () => {
    if (!selectedFlight) return;
    
    const data: FlightsData = {
      selectedFlight,
      skipFlight: false
    };
    onNext(data);
  };

  const classes = ['all', 'economy', 'business'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Flight</h2>
        <p className="text-muted-foreground">
          Find the perfect flight from {departureCity} to {destination}
        </p>
      </div>

      {/* Flight Search Summary */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-semibold">{departureCity}</p>
                <p className="text-sm text-muted-foreground">{departureDate}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <p className="font-semibold">{destination}</p>
                <p className="text-sm text-muted-foreground">{returnDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{travelers} Travelers</p>
              <p className="text-sm text-muted-foreground">Round Trip</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {classes.map((flightClass) => (
          <Button
            key={flightClass}
            variant={filterClass === flightClass ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterClass(flightClass)}
          >
            {flightClass === 'all' ? 'All Classes' : flightClass.charAt(0).toUpperCase() + flightClass.slice(1)}
          </Button>
        ))}
      </div>

      {/* Skip Flight Option */}
      <Card className="max-w-2xl mx-auto border-dashed">
        <CardContent className="pt-6 text-center">
          <h3 className="font-semibold mb-2">Have your own transportation?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Skip this step if you've already arranged your travel or prefer other modes of transport
          </p>
          <Button onClick={handleSkipFlight} variant="outline">
            Skip Flight Booking
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>AI is finding the best flight deals...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flights Grid */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <Card 
            key={flight.id}
            className={`cursor-pointer transition-smooth hover:shadow-elevation ${
              selectedFlight?.id === flight.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4 items-center">
                {/* Flight Basic Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <Badge className={classColors[flight.class]}>
                    {flight.class}
                  </Badge>
                </div>

                {/* Flight Times */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xl font-bold">{flight.departure}</p>
                      <p className="text-sm text-muted-foreground">{flight.departureAirport}</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <p className="text-sm text-muted-foreground">{flight.duration}</p>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      {flight.stops > 0 && (
                        <p className="text-xs text-destructive">{flight.stops} stop(s)</p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{flight.arrival}</p>
                      <p className="text-sm text-muted-foreground">{flight.arrivalAirport}</p>
                    </div>
                  </div>
                  
                  {flight.layovers && (
                    <div className="text-xs text-muted-foreground text-center">
                      Layover in {flight.layovers[0].city} ({flight.layovers[0].duration})
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                  <p className="font-medium text-sm">Includes</p>
                  <div className="flex flex-wrap gap-1">
                    {flight.amenities.slice(0, 3).map((amenity) => {
                      const IconComponent = amenityIcons[amenity] || CheckCircle;
                      return (
                        <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
                          <IconComponent className="w-3 h-3" />
                          {amenity}
                        </Badge>
                      );
                    })}
                    {flight.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{flight.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Baggage: {flight.baggage}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{flight.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>
                  
                  {selectedFlight?.id === flight.id && (
                    <Badge className="bg-success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </div>

              {/* Additional Flight Details */}
              <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Aircraft: {flight.aircraft}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">
                    Total for {travelers} travelers: ₹{(flight.price * travelers).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Flight Summary */}
      {selectedFlight && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Selected Flight: {selectedFlight.airline} {selectedFlight.flightNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="font-medium">{selectedFlight.departure} from {selectedFlight.departureAirport}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arrival</p>
                <p className="font-medium">{selectedFlight.arrival} at {selectedFlight.arrivalAirport}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{selectedFlight.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-xl font-bold text-primary">₹{(selectedFlight.price * travelers).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Hotels
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedFlight}
          variant="travel"
        >
          Continue to Summary →
        </Button>
      </div>
    </div>
  );
};