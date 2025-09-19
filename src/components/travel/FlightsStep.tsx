import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plane, 
  Clock, 
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Luggage,
  Wifi,
  Coffee,
  Tv,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  price: number;
  originalPrice?: number;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  stops: number;
  stopDetails?: string[];
  layoverTime?: string;
  baggage: string;
  seatType: string;
  amenities: string[];
  cancellation: string;
  meal: boolean;
  popular: boolean;
  deal: boolean;
  onTimePerformance: number;
}

interface FlightsStepProps {
  onNext: (selectedFlight: Flight | null, skipFlight: boolean) => void;
  onBack: () => void;
  departure: string;
  destination: string;
  travelers: number;
}

const availableFlights: Flight[] = [
  {
    id: '1',
    airline: 'IndiGo',
    flightNumber: '6E 439',
    aircraft: 'Airbus A320',
    price: 8500,
    originalPrice: 12000,
    departure: {
      time: '06:30',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '08:45',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 15m',
    stops: 0,
    baggage: '15kg + 7kg cabin',
    seatType: 'Economy',
    amenities: ['Seat Selection', 'Meals Available', 'Entertainment'],
    cancellation: 'Free up to 24h',
    meal: false,
    popular: true,
    deal: true,
    onTimePerformance: 92
  },
  {
    id: '2',
    airline: 'Air India',
    flightNumber: 'AI 635',
    aircraft: 'Boeing 737',
    price: 7200,
    departure: {
      time: '14:20',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '16:50',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 30m',
    stops: 0,
    baggage: '20kg + 8kg cabin',
    seatType: 'Economy',
    amenities: ['Complimentary Meal', 'Entertainment', 'WiFi'],
    cancellation: 'Charges apply',
    meal: true,
    popular: false,
    deal: false,
    onTimePerformance: 87
  },
  {
    id: '3',
    airline: 'SpiceJet',
    flightNumber: 'SG 8157',
    aircraft: 'Boeing 737 MAX',
    price: 6800,
    departure: {
      time: '10:15',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '14:30',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '4h 15m',
    stops: 1,
    stopDetails: ['Mumbai (BOM)'],
    layoverTime: '1h 30m',
    baggage: '15kg + 7kg cabin',
    seatType: 'Economy',
    amenities: ['Seat Selection', 'Snacks Available'],
    cancellation: 'Non-refundable',
    meal: false,
    popular: false,
    deal: false,
    onTimePerformance: 85
  },
  {
    id: '4',
    airline: 'Vistara',
    flightNumber: 'UK 995',
    aircraft: 'Airbus A320neo',
    price: 15500,
    departure: {
      time: '19:30',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '22:00',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 30m',
    stops: 0,
    baggage: '25kg + 8kg cabin',
    seatType: 'Premium Economy',
    amenities: ['Premium Meal', 'Extra Legroom', 'Priority Boarding', 'WiFi', 'Entertainment'],
    cancellation: 'Free up to 2h',
    meal: true,
    popular: true,
    deal: false,
    onTimePerformance: 94
  },
  {
    id: '5',
    airline: 'GoAir',
    flightNumber: 'G8 319',
    aircraft: 'Airbus A320',
    price: 5900,
    departure: {
      time: '22:45',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '01:15+1',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 30m',
    stops: 0,
    baggage: '15kg + 7kg cabin',
    seatType: 'Economy',
    amenities: ['Seat Selection'],
    cancellation: 'Charges apply',
    meal: false,
    popular: false,
    deal: true,
    onTimePerformance: 82
  }
];

const amenityIcons = {
  'Complimentary Meal': Coffee,
  'Premium Meal': Coffee,
  'Meals Available': Coffee,
  'Entertainment': Tv,
  'WiFi': Wifi,
  'Seat Selection': Users,
  'Extra Legroom': Users,
  'Priority Boarding': Luggage,
  'Snacks Available': Coffee
};

export const FlightsStep = ({ onNext, onBack, departure, destination, travelers }: FlightsStepProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(false);

  const handleFlightSelect = (flight: Flight) => {
    setIsLoading(true);
    setSelectedFlight(flight);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSkipFlight = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onNext(null, true);
    }, 500);
  };

  const handleNext = () => {
    if (!selectedFlight) return;
    onNext(selectedFlight, false);
  };

  const sortedFlights = [...availableFlights].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'duration': return parseInt(a.duration) - parseInt(b.duration);
      case 'departure': return a.departure.time.localeCompare(b.departure.time);
      case 'arrival': return a.arrival.time.localeCompare(b.arrival.time);
      default: return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); // recommended
    }
  });

  const formatTime = (timeString: string) => {
    if (timeString.includes('+1')) {
      return timeString.replace('+1', '') + ' (+1 day)';
    }
    return timeString;
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-success';
    if (performance >= 80) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Flight</h2>
        <p className="text-muted-foreground">
          Select flights from {departure} to {destination} for {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
        </p>
      </div>

      {/* Skip Option */}
      <Card className="max-w-2xl mx-auto border-dashed">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-semibold">Have your own transport?</h3>
            <p className="text-sm text-muted-foreground">Skip flight booking and arrange your own travel</p>
          </div>
          <Button onClick={handleSkipFlight} variant="outline">
            Skip Flights
          </Button>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="duration">Shortest Duration</SelectItem>
            <SelectItem value="departure">Earliest Departure</SelectItem>
            <SelectItem value="arrival">Earliest Arrival</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">
          {sortedFlights.length} flights found
        </div>
      </div>

      {/* Flights List */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <Card 
            key={flight.id}
            className={`cursor-pointer transition-smooth hover:shadow-elevation ${
              selectedFlight?.id === flight.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header with airline and badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{flight.airline}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{flight.flightNumber}</span>
                        <span>•</span>
                        <span>{flight.aircraft}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {flight.deal && <Badge className="bg-destructive">Deal</Badge>}
                    {flight.popular && <Badge className="bg-success">Popular</Badge>}
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid lg:grid-cols-4 gap-6 items-center">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold">{flight.departure.time}</div>
                    <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                    <div className="text-sm font-medium">{flight.departure.city}</div>
                  </div>

                  {/* Duration and Route */}
                  <div className="text-center relative">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-0.5 bg-border"></div>
                      <div className="mx-2">
                        <Plane className="w-4 h-4 text-primary rotate-90" />
                      </div>
                      <div className="flex-1 h-0.5 bg-border"></div>
                    </div>
                    <div className="text-sm font-medium mt-2">{flight.duration}</div>
                    <div className="text-xs text-muted-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                    {flight.stopDetails && (
                      <div className="text-xs text-muted-foreground">
                        via {flight.stopDetails.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatTime(flight.arrival.time)}</div>
                    <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                    <div className="text-sm font-medium">{flight.arrival.city}</div>
                  </div>

                  {/* Price and Book */}
                  <div className="text-center">
                    {flight.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ₹{(flight.originalPrice * travelers).toLocaleString()}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-primary">
                      ₹{(flight.price * travelers).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">for {travelers} traveler{travelers > 1 ? 's' : ''}</div>
                    {selectedFlight?.id === flight.id && (
                      <Badge className="bg-success mt-2">Selected</Badge>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="border-t pt-4 space-y-3">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Baggage:</span>
                      <div className="font-medium">{flight.baggage}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Seat Type:</span>
                      <div className="font-medium">{flight.seatType}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cancellation:</span>
                      <div className="font-medium">{flight.cancellation}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">On-time:</span>
                      <div className={`font-medium ${getPerformanceColor(flight.onTimePerformance)}`}>
                        {flight.onTimePerformance}%
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <span className="text-sm text-muted-foreground">Amenities:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {flight.amenities.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Plane;
                        return (
                          <div key={amenity} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                            <IconComponent className="w-3 h-3" />
                            {amenity}
                          </div>
                        );
                      })}
                      {flight.meal && (
                        <div className="flex items-center gap-1 text-xs bg-success/20 text-success px-2 py-1 rounded">
                          <Coffee className="w-3 h-3" />
                          Meal Included
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>Confirming flight availability and pricing...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
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