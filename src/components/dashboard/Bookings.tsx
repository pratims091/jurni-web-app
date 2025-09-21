import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingDetails } from './BookingDetails';

const bookings = [
  {
    id: 1,
    type: 'Hotel / Flight',
    status: 'Confirmed',
    dates: '2024-08-15 to 2024-08-20',
    price: 1200,
    details: {
      location: 'Paris, France',
      duration: 6,
      budget: 2000,
      startDate: '2024-08-15',
      endDate: '2024-08-20',
      activitiesData: { dayPlans: [], totalCost: 0 },
      selectedHotel: { id: '1', name: 'Hotel Eiffel', price: 150, rating: 4, location: 'Paris, France' },
      selectedFlight: { id: '1', airline: 'Air France', price: 600, departure: { time: '10:00', airport: 'JFK', city: 'New York' }, arrival: { time: '22:00', airport: 'CDG', city: 'Paris' } },
    }
  },
  {
    id: 2,
    type: 'Hotel / Flight',
    status: 'Confirmed',
    dates: '2024-09-10 to 2024-09-17',
    price: 1800,
    details: {
      location: 'Tokyo, Japan',
      duration: 8,
      budget: 3000,
      startDate: '2024-09-10',
      endDate: '2024-09-17',
      activitiesData: { dayPlans: [], totalCost: 0 },
      selectedHotel: { id: '2', name: 'Park Hyatt Tokyo', price: 300, rating: 5, location: 'Tokyo, Japan' },
      selectedFlight: { id: '2', airline: 'Japan Airlines', price: 1000, departure: { time: '14:00', airport: 'LAX', city: 'Los Angeles' }, arrival: { time: '18:00', airport: 'HND', city: 'Tokyo' } },
    }
  },
];

export const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Booking {booking.id}: {booking.type}</h3>
                <p className="text-sm text-muted-foreground">Status: {booking.status} | Dates: {booking.dates} | Price: ${booking.price}</p>
              </div>
              <Button variant="outline" onClick={() => handleViewDetails(booking)}>View</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <BookingDetails
                selectedHotel={selectedBooking.details.selectedHotel}
                selectedFlight={selectedBooking.details.selectedFlight}
                budget={selectedBooking.details.budget}
                duration={selectedBooking.details.duration}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
