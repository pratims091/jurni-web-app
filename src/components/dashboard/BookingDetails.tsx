import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Hotel, IndianRupee, Plane } from 'lucide-react';

interface Flight {
  airline: string;
  price: number;
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
}

interface BookingDetailsProps {
  selectedHotel?: {
    name: string;
    location: string;
    rating: number;
    price: number;
  };
  selectedFlight?: Flight;
  budget?: number;
  duration?: number;
}

export const BookingDetails = ({ selectedHotel, selectedFlight, budget, duration }: BookingDetailsProps) => {
  const hotelCost = selectedHotel && duration ? selectedHotel.price * (duration - 1) : 0;
  const flightCost = selectedFlight ? selectedFlight.price : 0;
  const totalCost = hotelCost + flightCost;

  return (
    <div className="space-y-6">
      {selectedHotel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold">{selectedHotel.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: selectedHotel.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({selectedHotel.rating} stars)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm">Total ({duration ? duration - 1 : 0} nights):</span>
                <span className="font-semibold">₹{hotelCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFlight && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold">{selectedFlight.airline}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departure:</span>
                  <span>{`${selectedFlight.departure.time} (${selectedFlight.departure.airport})`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arrival:</span>
                  <span>{`${selectedFlight.arrival.time} (${selectedFlight.arrival.airport})`}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm">Flight Cost:</span>
                <span className="font-semibold">₹{flightCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {budget !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Budget:</span>
                <span className="font-semibold">₹{budget.toLocaleString()}</span>
              </div>
              <Separator />
              {selectedHotel && (
                <div className="flex justify-between items-center">
                  <span>Accommodation Cost:</span>
                  <span>₹{hotelCost.toLocaleString()}</span>
                </div>
              )}
              {selectedFlight && (
                <div className="flex justify-between items-center">
                  <span>Flight Cost:</span>
                  <span>₹{flightCost.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Remaining Budget:</span>
                <span className={budget < totalCost ? 'text-destructive' : 'text-green-500'}>
                  ₹{(budget - totalCost).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
