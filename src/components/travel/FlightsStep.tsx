import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetTracker } from './BudgetTracker';
import { 
  Plane, 
  Clock, 
  Users,
  Luggage,
  Wifi,
  Coffee,
  Tv,
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
  budget: number;
  spent: number;
  isFlexibleBudget?: boolean;
}

const availableFlights: Flight[] = [
  {
    id: '1',
    airline: 'SkyBlue Airways',
    flightNumber: 'SB-2341',
    aircraft: 'Airbus A320',
    price: 12000,
    departure: {
      time: '14:30',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '16:45',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 15m',
    stops: 0,
    baggage: '15kg checked + 7kg cabin',
    seatType: 'economy',
    amenities: ['Meal', 'Entertainment'],
    cancellation: 'Free up to 24h',
    meal: true,
    popular: true,
    deal: false,
    onTimePerformance: 92
  },
  {
    id: '2',
    airline: 'Budget Wings',
    flightNumber: 'BW-5432',
    aircraft: 'Boeing 737',
    price: 8500,
    departure: {
      time: '08:15',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '13:45',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '4h 30m',
    stops: 1,
    stopDetails: ['Mumbai'],
    layoverTime: '1h 20m',
    baggage: '15kg checked + 7kg cabin',
    seatType: 'economy',
    amenities: ['Snacks'],
    cancellation: 'Charges apply',
    meal: true,
    popular: false,
    deal: false,
    onTimePerformance: 87
  },
  {
    id: '3',
    airline: 'QuickJet',
    flightNumber: 'QJ-7890',
    aircraft: 'Airbus A320neo',
    price: 15500,
    departure: {
      time: '19:20',
      airport: 'DEL',
      city: 'Delhi'
    },
    arrival: {
      time: '22:05',
      airport: 'GOI',
      city: 'Goa'
    },
    duration: '2h 45m',
    stops: 0,
    baggage: '20kg checked + 8kg cabin',
    seatType: 'economy',
    amenities: ['Meal', 'WiFi', 'Entertainment'],
    cancellation: 'Free up to 2h',
    meal: true,
    popular: true,
    deal: false,
    onTimePerformance: 94
  }
];

const amenityIcons: { [key: string]: React.ElementType } = {
  Meal: Coffee,
  Entertainment: Tv,
  WiFi: Wifi,
  Snacks: Coffee,
};

export const FlightsStep = ({ onNext, onBack, departure, destination, travelers, budget, spent = 0, isFlexibleBudget = false }: FlightsStepProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(false);

  const flightCost = selectedFlight ? selectedFlight.price * travelers : 0;
  const totalSpent = spent + flightCost;

  const handleFlightSelect = (flight: Flight) => {
    setIsLoading(true);
    setSelectedFlight(flight);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
      default: return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Flight</h2>
        <p className="text-muted-foreground">
          Select flights from {departure} to {destination} for {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
        </p>
      </div>

      <BudgetTracker 
        totalBudget={budget}
        spent={totalSpent}
        isFlexible={isFlexibleBudget}
      />

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

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <Card 
            key={flight.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedFlight?.id === flight.id ? 'ring-2 ring-primary shadow-lg' : 'shadow-md'
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-12 gap-4 items-center">

                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-bold">{flight.airline}</div>
                      <div className="text-xs text-muted-foreground">{flight.flightNumber}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize bg-blue-100 text-blue-800 border-blue-200">
                    {flight.seatType}
                  </Badge>
                </div>

                <div className="col-span-3 text-center">
                  <div className="text-xl font-bold">{flight.departure.time}</div>
                  <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                </div>

                <div className="col-span-2 text-center">
                  <div className="text-sm text-muted-foreground">{flight.duration}</div>
                  <div className="flex items-center justify-center">
                    <div className="flex-grow border-t border-dashed"></div>
                    <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
                    <div className="flex-grow border-t border-dashed"></div>
                  </div>
                  {flight.stops > 0 && (
                    <div className="text-xs text-red-500">{flight.stops} stop(s)</div>
                  )}
                  {flight.layoverTime && (
                     <div className="text-xs text-muted-foreground">Layover in {flight.layoverTime}</div>
                  )}
                </div>

                <div className="col-span-2 text-center">
                  <div className="text-xl font-bold">{flight.arrival.time}</div>
                  <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                </div>
                
                <div className="col-span-2 text-right">
                    <div className="text-xl font-bold text-primary">₹{flight.price.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <div className="col-span-6 space-y-2">
                    <div className="text-sm font-semibold">Includes</div>
                     <div className="flex items-center gap-4 text-sm">
                       {flight.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity];
                        return (
                          <Badge key={amenity} variant='outline' className='bg-gray-100'>
                            {Icon && <Icon className="w-3 h-3 mr-1.5" />} {amenity}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">Baggage: {flight.baggage}</div>
                  </div>
                <div className="col-span-6 text-right">
                   <div className="text-sm text-muted-foreground">Aircraft: {flight.aircraft}</div>
                   <div className="font-semibold">Total for {travelers} travelers: ₹{(flight.price * travelers).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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