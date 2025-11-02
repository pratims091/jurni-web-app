import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Share,
  IndianRupee
} from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ... (interface definitions remain the same) ...

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

interface TripMember {
  email: string;
  name: string;
  role: string;
}

interface FinalItineraryProps {
  locationInfo?: {
    destination: string;
    travelers: TripMember[];
  };
  budgetDurationData?: {
    budget: number;
    startDate?: Date;
    endDate?: Date;
  };
  activitiesData?: {
    dayPlans: DayPlan[];
    totalCost: number;
  };
  selectedHotel?: Hotel;
  selectedFlight?: Flight;
  userEmail: string;
  onConfirm: () => void;
  onStartOver: () => void;
  showBudget?: boolean;
  showActions?: boolean;
}

export const FinalItinerary = ({
  locationInfo,
  budgetDurationData,
  activitiesData,
  selectedHotel,
  selectedFlight,
  userEmail,
  onConfirm,
  onStartOver,
  showBudget = true,
  showActions = true,
}: FinalItineraryProps) => {
  const { t } = useTranslation();
    
  const destination = locationInfo?.destination || t('your_destination');
  const travelers = locationInfo?.travelers || [];
  const budget = budgetDurationData?.budget || 0;
  const startDate = budgetDurationData?.startDate;
  const endDate = budgetDurationData?.endDate;
  const dayPlans = activitiesData?.dayPlans || [];
  const activitiesTotalCost = activitiesData?.totalCost || 0;

  const duration = startDate && endDate
    ? differenceInCalendarDays(endDate, startDate) + 1
    : 1;

  const hotelCost = selectedHotel ? selectedHotel.price * (duration - 1) : 0;
  const flightCost = selectedFlight ? selectedFlight.price : 0;
  const finalCost = activitiesTotalCost + hotelCost + flightCost;
  const isOverBudget = finalCost > budget;

  const handleDownloadPdf = () => {
    const input = document.getElementById('itinerary-content');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save('travel-itinerary.pdf');
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: t('my_trip_to', { destination }),
          text: t('check_out_itinerary', { destination }),
          url: window.location.href,
        })
        .then(() => console.log(t('successful_share')))
        .catch((error) => console.log(t('error_sharing'), error));
    } else {
      alert(t('sharing_not_supported'));
    }
  };

  return (
    <div id="itinerary-content" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{t('final_itinerary')}</h1>
        <p className="text-xl text-muted-foreground">{t('complete_travel_plan', { destination })}</p>
      </div>

      {/* Trip Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MapPin className="w-6 h-6" />
            {t('trip_overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {t('destination')}
              </div>
              <div className="font-semibold">{destination}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {t('duration')}
              </div>
              <div className="font-semibold">{duration} {t('days')}</div>
              {startDate && endDate && (
                <div className="text-sm text-muted-foreground">
                  {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {t('travelers')}
              </div>
              <div className="font-semibold">{travelers.length} {t('people')}</div>
            </div>

            {showBudget && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IndianRupee className="w-4 h-4" />
                  {t('budget_status')}
                </div>
                <div className="font-semibold">
                  <div className="flex items-center gap-2">
                    <span>₹{finalCost.toLocaleString()} / ₹{budget.toLocaleString()}</span>
                    {isOverBudget ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {t('over_budget')}
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('within_budget')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      {showBudget && activitiesData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              {t('budget_breakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{t('total_budget')}</span>
                <span className="font-semibold">₹{budget.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>{t('activities')} ({dayPlans.reduce((sum, day) => sum + day.activities.length, 0)} {t('total')}):</span>
                <span>₹{activitiesTotalCost.toLocaleString()}</span>
              </div>

              {selectedHotel && (
                <div className="flex justify-between items-center">
                  <span>{t('hotel')} ({duration - 1} {t('nights')}):</span>
                  <span>₹{hotelCost.toLocaleString()}</span>
                </div>
              )}

              {selectedFlight && (
                <div className="flex justify-between items-center">
                  <span>{t('flight')}</span>
                  <span>₹{flightCost.toLocaleString()}</span>
                </div>
              )}

              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t('total_cost')}</span>
                <span className={isOverBudget ? 'text-destructive' : 'text-green-500'}>
                  ₹{finalCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>{t('remaining_budget')}</span>
                <span className={isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                  {isOverBudget
                    ? `-₹${Math.abs(budget - finalCost).toLocaleString()}`
                    : `₹${(budget - finalCost).toLocaleString()}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day-by-Day Itinerary */}
      {activitiesData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('day_by_day_itinerary')}
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
                      {t('day')} {dayPlan.day}
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
                      <div>₹{dayPlan.totalCost.toLocaleString()}</div>
                    </div>
                  </div>

                  {dayPlan.activities.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground bg-muted/20 rounded-lg">
                      <p className="text-sm">{t('free_day')}</p>
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
                                  ₹{activity.cost.toLocaleString()}
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
      )}

      {/* Accommodation & Transportation */}
      <div className="grid md:grid-cols-2 gap-6">
        {selectedHotel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                {t('accommodation')}
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
                  <span className="text-sm text-muted-foreground">({selectedHotel.rating} {t('stars')})</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">{t('total_nights', { count: duration - 1 })}:</span>
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
                {t('flight_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{selectedFlight.airline}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('departure')}</span>
                    <span>{`${selectedFlight.departure} (${selectedFlight.departureAirport})`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('arrival')}</span>
                    <span>{`${selectedFlight.arrival} (${selectedFlight.arrivalAirport})`}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">{t('flight_cost')}</span>
                  <span className="font-semibold">₹{flightCost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trip Members */}
      {travelers && travelers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('trip_members')} ({travelers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {travelers.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {member.name ? member.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{member.name || `${t('traveler')} ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                    {member.email === userEmail && (
                      <Badge variant="secondary" className="text-xs mt-1">{t('trip_organizer')}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4 mr-2" />
              {t('download_pdf')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              {t('share_itinerary')}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={onStartOver} variant="outline">
              {t('start_over')}
            </Button>
            <Button onClick={onConfirm} variant="travel" size="lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('save_trip')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};