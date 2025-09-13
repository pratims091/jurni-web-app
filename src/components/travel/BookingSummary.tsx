import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BookingStep } from './TravelBookingFlow';

interface BookingSummaryProps {
  bookingState: BookingStep;
  onConfirm: () => void;
  onStartOver: () => void;
}

export const BookingSummary = ({ bookingState, onConfirm, onStartOver }: BookingSummaryProps) => {
  const { toast } = useToast();

  const getTotalCost = () => {
    let total = 0;
    const days = bookingState.selectedDuration?.days || bookingState.customDuration || 1;
    
    if (bookingState.selectedHotel) {
      total += bookingState.selectedHotel.price * days;
    }
    if (bookingState.selectedFlight) {
      total += bookingState.selectedFlight.price;
    }
    
    return total;
  };

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: "Trip Confirmed!",
      description: "Your travel plan has been saved successfully.",
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
                {bookingState.selectedDuration?.days || bookingState.customDuration} days
              </span>
            </div>
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
                <span>Hotel ({bookingState.selectedDuration?.days || bookingState.customDuration} nights):</span>
                <span>${bookingState.selectedHotel.price * (bookingState.selectedDuration?.days || bookingState.customDuration || 1)}</span>
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

      <div className="flex gap-4 justify-center">
        <Button onClick={onStartOver} variant="outline">
          Start Over
        </Button>
        <Button onClick={handleConfirm} variant="travel" size="lg">
          Confirm & Book Trip
        </Button>
      </div>
    </div>
  );
};