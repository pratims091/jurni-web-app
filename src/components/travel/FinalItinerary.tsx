import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Plane, 
  Hotel, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Share
} from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  name: string;
  duration: number;
  cost: number;
  location: string;
  icon: string;
}

interface DayPlan {
  day: number;
  activities: Activity[];
  totalDuration: number;
  totalCost: number;
}

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
}

interface Flight {
  id: string;
  airline: string;
  price: number;
  departure: string;
  arrival: string;
}

interface TripMember {
  email: string;
  name: string;
  role: string;
}

interface FinalItineraryProps {
  destination: string;
  duration: number;
  budget: number;
  isFlexibleBudget: boolean;
  finalCost: number;
  dayPlans: DayPlan[];
  hotel?: Hotel;
  flight?: Flight;
  members: TripMember[];
  userEmail: string;
  startDate?: Date;
  endDate?: Date;
  onConfirm: () => void;
  onStartOver: () => void;
}

export const FinalItinerary = ({
  destination,
  duration,
  budget,
  isFlexibleBudget,
  finalCost,
  dayPlans,
  hotel,
  flight,
  members,
  userEmail,
  startDate,
  endDate,
  onConfirm,
  onStartOver
}: FinalItineraryProps) => {
  const isOverBudget = !isFlexibleBudget && finalCost > budget;
  const totalActivitiesCost = dayPlans.reduce((sum, day) => sum + day.totalCost, 0);
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Final Itinerary</h1>
        <p className="text-xl text-muted-foreground">Your complete travel plan for {destination}</p>
      </div>

      {/* Trip Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MapPin className="w-6 h-6" />
            Trip Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Destination
              </div>
              <div className="font-semibold">{destination}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Duration
              </div>
              <div className="font-semibold">{duration} days</div>
              {startDate && endDate && (
                <div className="text-sm text-muted-foreground">
                  {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                Travelers
              </div>
              <div className="font-semibold">{members.length} people</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Budget Status
              </div>
              <div className="font-semibold">
                {isFlexibleBudget ? (
                  <Badge variant="secondary">Flexible Budget</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>${finalCost.toFixed(0)} / ${budget.toFixed(0)}</span>
                    {isOverBudget ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Over Budget
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Within Budget
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!isFlexibleBudget && (
              <>
                <div className="flex justify-between items-center">
                  <span>Total Budget:</span>
                  <span className="font-semibold">${budget.toFixed(0)}</span>
                </div>
                <Separator />
              </>
            )}
            
            <div className="flex justify-between items-center">
              <span>Activities ({dayPlans.reduce((sum, day) => sum + day.activities.length, 0)} total):</span>
              <span>${totalActivitiesCost.toFixed(0)}</span>
            </div>
            
            {hotel && (
              <div className="flex justify-between items-center">
                <span>Hotel ({duration} nights):</span>
                <span>${(hotel.price * duration).toFixed(0)}</span>
              </div>
            )}
            
            {flight && (
              <div className="flex justify-between items-center">
                <span>Flight:</span>
                <span>${flight.price.toFixed(0)}</span>
              </div>
            )}
            
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Cost:</span>
              <span className={isOverBudget ? 'text-destructive' : 'text-success'}>
                ${finalCost.toFixed(0)}
              </span>
            </div>
            
            {!isFlexibleBudget && (
              <div className="flex justify-between items-center text-sm">
                <span>Remaining Budget:</span>
                <span className={isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                  {isOverBudget 
                    ? `-$${Math.abs(budget - finalCost).toFixed(0)}` 
                    : `$${(budget - finalCost).toFixed(0)}`
                  }
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Day-by-Day Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Day-by-Day Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dayPlans.map((dayPlan) => (
              <div key={dayPlan.day} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {dayPlan.day}
                    </div>
                    Day {dayPlan.day}
                    {startDate && (
                      <span className="text-sm text-muted-foreground font-normal">
                        ({format(new Date(startDate.getTime() + (dayPlan.day - 1) * 24 * 60 * 60 * 1000), 'EEE, MMM dd')})
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {dayPlan.totalDuration}h
                    </div>
                    <div>${dayPlan.totalCost}</div>
                  </div>
                </div>
                
                {dayPlan.activities.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground bg-muted/20 rounded-lg">
                    <p className="text-sm">Free day - No activities planned</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3 pl-10">
                    {dayPlan.activities.map((activity, index) => (
                      <Card key={activity.id} className="p-3 bg-muted/10">
                        <div className="flex items-start gap-3">
                          <div className="text-lg">{activity.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{activity.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{activity.location}</p>
                            <div className="flex items-center gap-3 text-xs">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {activity.duration}h
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                ${activity.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                
                {dayPlan.day < dayPlans.length && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accommodation & Transportation */}
      <div className="grid md:grid-cols-2 gap-6">
        {hotel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Accommodation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{hotel.name}</h4>
                <p className="text-sm text-muted-foreground">{hotel.location}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <span key={i} className="text-warning">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({hotel.rating} stars)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">Total ({duration} nights):</span>
                  <span className="font-semibold">${(hotel.price * duration).toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {flight && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{flight.airline}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span>{flight.departure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span>{flight.arrival}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">Flight Cost:</span>
                  <span className="font-semibold">${flight.price.toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trip Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Trip Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                  {member.email === userEmail && (
                    <Badge variant="secondary" className="text-xs mt-1">Trip Organizer</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share Itinerary
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={onStartOver} variant="outline">
            Start Over
          </Button>
          <Button onClick={onConfirm} variant="travel" size="lg">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Trip
          </Button>
        </div>
      </div>
    </div>
  );
};