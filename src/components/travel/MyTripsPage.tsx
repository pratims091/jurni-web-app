import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface SavedTrip {
  id: string;
  locationInfo: any;
  budgetDurationData: any;
  activitiesData: any;
  hotelsData: any;
  flightsData: any;
  membersData: any;
  createdAt: string;
  userEmail: string;
}

export const MyTripsPage = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('saved_trips') || '[]');
    setSavedTrips(trips);
  }, []);

  const deleteTrip = (tripId: string) => {
    const updatedTrips = savedTrips.filter(trip => trip.id !== tripId);
    setSavedTrips(updatedTrips);
    localStorage.setItem('saved_trips', JSON.stringify(updatedTrips));
  };

  if (savedTrips.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No saved trips yet</h2>
        <p className="text-muted-foreground">Start planning your first trip to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Trips</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-elevation transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {trip.locationInfo?.destination || 'Trip'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {trip.budgetDurationData?.duration || 5} days
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {trip.membersData?.totalMembers || trip.locationInfo?.numberOfTravelers || 2} travelers
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4" />
                  ₹{trip.budgetDurationData?.budget?.toLocaleString() || '50,000'}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {trip.activitiesData?.selectedActivities?.slice(0, 2).map((activity: any) => (
                  <Badge key={activity.id} variant="secondary" className="text-xs">
                    {activity.name}
                  </Badge>
                )) || []}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteTrip(trip.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};