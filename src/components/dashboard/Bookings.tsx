import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Bookings = () => {
  const bookings = Array.from({ length: 4 }, (_, i) => ({ id: i + 1 }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Booking {booking.id}: Hotel / Flight</h3>
                <p className="text-sm text-muted-foreground">Status: Confirmed | Dates: -- | Price: $---</p>
              </div>
              <Button variant="outline">View</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};