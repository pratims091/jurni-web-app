import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetTracker } from './BudgetTracker';
import { 
  Plane, 
  Clock, 
  Luggage,
  Wifi,
  Coffee,
  Tv,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  stops: number;
  aircraft: string;
  class_: string;
  amenities: string[];
  baggage: string;
  departureAirport: string;
  arrivalAirport: string;
  layovers: { station: string, duration: string }[];
}

interface FlightsData {
  selectedFlight?: Flight;
  skipFlight: boolean;
  totalCost: number;
  flights?: Flight[];
}

interface FlightsStepProps {
  onNext: (data: { selectedFlight: Flight | null, skipFlight: boolean, totalCost: number }) => void;
  onBack: () => void;
  departure: string;
  destination: string;
  travelers: number;
  budget: number;
  spent: number;
  flights: Flight[];
  initialData?: Partial<FlightsData>;
  isFlexibleBudget?: boolean;
}

const amenityIcons: { [key: string]: React.ElementType } = {
  'Snacks': Coffee,
  'Vegan Meal Available': Coffee,
  'Meal': Coffee,
  'Entertainment': Tv,
  'WiFi': Wifi,
};

const convertDurationToMinutes = (duration: string): number => {
  const parts = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!parts) return 0;
  const hours = parseInt(parts[1], 10) || 0;
  const minutes = parseInt(parts[2], 10) || 0;
  return hours * 60 + minutes;
};

export const FlightsStep = ({
  onNext,
  onBack,
  departure,
  destination,
  travelers,
  budget,
  spent = 0,
  flights = [],
  initialData,
  isFlexibleBudget = false
}: FlightsStepProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(initialData?.selectedFlight || null);
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(false);

  const flightCost = selectedFlight ? selectedFlight.price * travelers : 0;
  const totalSpent = spent + flightCost;

  const handleFlightSelect = (flight: Flight) => {
    setIsLoading(true);
    setTimeout(() => {
        setSelectedFlight(flight);
        setIsLoading(false);
    }, 500);
  };

  const handleNext = () => {
    if (!selectedFlight) return;
    onNext({ selectedFlight, skipFlight: false, totalCost: flightCost });
  };

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'duration': return convertDurationToMinutes(a.duration) - convertDurationToMinutes(b.duration);
      case 'departure': return a.departure.localeCompare(b.departure);
      case 'arrival': return a.arrival.localeCompare(b.arrival);
      default: return 0; // No default recommendation logic for now
    }
  });

  useEffect(() => {
    if (initialData?.selectedFlight) {
        setSelectedFlight(initialData.selectedFlight);
    }
  }, [initialData]);

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
        {flights.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No flights found for the selected criteria.</CardContent></Card>
        ) : sortedFlights.map((flight) => (
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
                    {flight.class_}
                  </Badge>
                </div>

                <div className="col-span-2 text-center">
                  <div className="text-xl font-bold">{flight.departure}</div>
                  <div className="text-sm text-muted-foreground">{flight.departureAirport}</div>
                </div>

                <div className="col-span-3 text-center">
                  <div className="text-sm text-muted-foreground">{flight.duration}</div>
                  <div className="flex items-center justify-center">
                    <div className="flex-grow border-t border-dashed"></div>
                    <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
                    <div className="flex-grow border-t border-dashed"></div>
                  </div>
                  {flight.stops > 0 ? (
                    <div className="text-xs text-red-500">{flight.stops} stop(s)</div>
                  ) : (
                    <div className="text-xs text-green-600">Direct</div>
                  )}
                  {flight.layovers.length > 0 && (
                     <div className="text-xs text-muted-foreground">via {flight.layovers.map(l => l.station).join(', ')}</div>
                  )}
                </div>

                <div className="col-span-2 text-center">
                  <div className="text-xl font-bold">{flight.arrival}</div>
                  <div className="text-sm text-muted-foreground">{flight.arrivalAirport}</div>
                </div>
                
                <div className="col-span-2 text-right">
                    <div className="text-xl font-bold text-primary">₹{flight.price.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <div className="space-y-2">
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
                      <Badge variant='outline' className='bg-gray-100'>
                        <Luggage className="w-3 h-3 mr-1.5" /> {flight.baggage}
                      </Badge>
                    </div>
                  </div>
                <div className="text-right">
                   <div className="text-sm text-muted-foreground">Aircraft: {flight.aircraft}</div>
                   <div className="font-semibold">Total for {travelers} travelers: ₹{(flight.price * travelers).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <Card className="max-w-2xl mx-auto mt-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              <CardTitle>Confirming flight selection...</CardTitle>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="flex justify-between max-w-4xl mx-auto pt-4">
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