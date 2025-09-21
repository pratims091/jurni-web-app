import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FinalItinerary } from '../travel/FinalItinerary';

export const MyTrips = () => {
  const navigate = useNavigate();
  const trips = JSON.parse(localStorage.getItem('saved_trips') || '[]');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const handleCreateNewTrip = () => {
    navigate('/');
  };

  const handleViewDetails = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleCloseDialog = () => {
    setSelectedTrip(null);
  };

  const safeCreateDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const formattedDateString = dateString.split('T')[0].replace(/-/g, '/');
    const date = new Date(formattedDateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date created for:", dateString);
      return undefined;
    }
    return date;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Trips</h2>
        <Button onClick={handleCreateNewTrip}>Create New Trip</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.filter((trip: any) => trip.location).map((trip: any) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>{trip.location}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration: {trip.duration} days</p>
                <p className="text-sm text-muted-foreground">Budget: ${trip.budget}</p>
              </div>
              <Button variant="outline" onClick={() => handleViewDetails(trip)}>View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTrip} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-4xl">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTrip.location}</DialogTitle>
              </DialogHeader>
              <FinalItinerary
                locationInfo={{ destination: selectedTrip.location, travelers: selectedTrip.travelers }}
                budgetDurationData={{
                  budget: selectedTrip.budget,
                  startDate: safeCreateDate(selectedTrip.startDate),
                  endDate: safeCreateDate(selectedTrip.endDate),
                }}
                activitiesData={selectedTrip.activitiesData}
                selectedHotel={selectedTrip.selectedHotel}
                selectedFlight={selectedTrip.selectedFlight}
                userEmail=""
                onConfirm={() => {}}
                onStartOver={() => {}}
                showBudget={false}
                showActions={false}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
