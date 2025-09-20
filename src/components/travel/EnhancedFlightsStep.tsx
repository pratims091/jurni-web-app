import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plane, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
}

interface FlightsData {
  selectedFlight?: Flight;
  skipFlight: boolean;
}

interface FlightsStepProps {
  onNext: (data: FlightsData) => void;
  onBack: () => void;
}

const mockFlights: Flight[] = [
  {
    id: 'flight1',
    airline: 'IndiGo',
    flightNumber: '6E 204',
    departure: '08:30',
    arrival: '11:00',
    duration: '2h 30m',
    stops: 0,
    price: 4500,
  },
  {
    id: 'flight2',
    airline: 'Vistara',
    flightNumber: 'UK 847',
    departure: '10:15',
    arrival: '11:30',
    duration: '1h 15m',
    stops: 0,
    price: 3800,
  },
  {
    id: 'flight3',
    airline: 'Air India',
    flightNumber: 'AI 560',
    departure: '12:00',
    arrival: '16:10',
    duration: '4h 10m',
    stops: 1,
    price: 5200,
  },
  {
    id: 'flight4',
    airline: 'SpiceJet',
    flightNumber: 'SG 8143',
    departure: '14:45',
    arrival: '16:05',
    duration: '1h 20m',
    stops: 0,
    price: 3200,
  }
];

export const EnhancedFlightsStep = ({ onNext, onBack }: FlightsStepProps) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFlightSelect = (flight: Flight) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedFlight(flight);
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    if (!selectedFlight) return;
    const data: FlightsData = {
      selectedFlight,
      skipFlight: false
    };
    onNext(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Select Your Flight</h2>
        <p className="text-muted-foreground">Choose the best flight for your trip.</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>Searching for best flight deals...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24" />
          </CardContent>
        </Card>
      )}

      {/* Flights List */}
      <div className="space-y-4">
        {mockFlights.map((flight) => (
          <Card 
            key={flight.id} 
            className={`cursor-pointer transition-smooth hover:shadow-elevation ${
              selectedFlight?.id === flight.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardContent className="pt-6">
              <div className="grid grid-cols-5 items-center gap-4">
                <div className="col-span-2">
                  <p className="font-semibold">{flight.airline}</p>
                  <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">{flight.departure}</p>
                  <p className="text-sm text-muted-foreground">Departure</p>
                </div>
                <div>
                  <p className="font-semibold">{flight.arrival}</p>
                  <p className="text-sm text-muted-foreground">Arrival</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">₹{flight.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Flight Summary */}
      {selectedFlight && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Selected Flight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{selectedFlight.airline} {selectedFlight.flightNumber}</p>
                <p className="text-sm text-muted-foreground">{selectedFlight.departure} - {selectedFlight.arrival}</p>
              </div>
              <p className="font-bold text-lg text-primary">₹{selectedFlight.price.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
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