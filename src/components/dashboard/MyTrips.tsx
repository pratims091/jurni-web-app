import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const MyTrips = () => {
  const navigate = useNavigate();
  const trips = JSON.parse(localStorage.getItem('saved_trips') || '[]');

  const handleCreateNewTrip = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Trips</h2>
        <Button onClick={handleCreateNewTrip}>Create New Trip</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip: any) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>{trip.location}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration: {trip.duration} days</p>
                <p className="text-sm text-muted-foreground">Budget: ${trip.budget}</p>
              </div>
              <Button variant="outline">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};