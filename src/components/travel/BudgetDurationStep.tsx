import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  IndianRupee, 
  Calendar, 
  Wallet, 
  Star,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format, differenceInDays } from "date-fns"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Calendar as ShadCalendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BudgetDurationData {
  budget: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  currency: string;
  selectedPlan?: TripPlan;
  activities?: any[]; // To hold activities from API
}

interface BudgetDurationStepProps {
  onNext: (data: BudgetDurationData) => void;
  onBack: () => void;
  initialData?: Partial<BudgetDurationData>;
  destination: string;
  departure: string;
  totalTravellers: number;
}

interface TripPlan {
  id: string;
  title: string;
  duration: number;
  budget: number;
  description: string;
  includes: string[];
  accommodationType: string;
  rating: number;
}

const defaultTripPlans: TripPlan[] = [
  {
    id: '1',
    title: 'Budget Explorer',
    duration: 3,
    budget: 15000,
    description: 'Perfect for budget-conscious travelers who want to experience the essentials',
    rating: 4.2,
    includes: ['Budget accommodation', 'Local transport', 'Breakfast included', '2 guided tours'],
    accommodationType: 'Budget hotels & hostels',
  },
  {
    id: '2',
    title: 'Comfort Traveler',
    duration: 5,
    budget: 35000,
    description: 'Balanced experience with comfort and comprehensive sightseeing',
    rating: 4.6,
    includes: ['3-star accommodation', 'AC transport', 'All meals', '4 guided tours', 'Entry tickets'],
    accommodationType: '3-star hotels with amenities',
  },
  {
    id: '3',
    title: 'Luxury Escape',
    duration: 7,
    budget: 75000,
    description: 'Premium experience with luxury amenities and exclusive access',
    rating: 4.9,
    includes: ['5-star accommodation', 'Premium transport', 'All meals', 'Private guides', 'Exclusive experiences'],
    accommodationType: '5-star luxury resorts',
  }
];

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const BudgetDurationStep = ({ onNext, onBack, initialData, destination, departure, totalTravellers }: BudgetDurationStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(initialData?.selectedPlan || null);
  const [customBudget, setCustomBudget] = useState(initialData?.budget?.toString() || '');
  const [date, setDate] = useState<DateRange | undefined>({
    from: initialData?.startDate || new Date(),
    to: initialData?.endDate || addDays(new Date(), initialData?.duration || 5),
  });
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');
  const [isLoading, setIsLoading] = useState(false);

  const tripDuration = date?.from && date?.to ? differenceInDays(date.to, date.from) + 1 : 0;

  useEffect(() => {
    if (selectedPlan) {
      setDate({
        from: new Date(),
        to: addDays(new Date(), selectedPlan.duration)
      });
      setCustomBudget(selectedPlan.budget.toString());
    } 
  }, [selectedPlan]);

  const handlePlanSelect = (plan: TripPlan) => {
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null);
      setCustomBudget('');
    } else {
      setSelectedPlan(plan);
    }
  };

  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBudget(e.target.value);
    if (selectedPlan) {
      setSelectedPlan(null);
    }
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (selectedPlan) {
      setSelectedPlan(null);
    }
  }

  const handleNext = async () => {
    setIsLoading(true);
    const budget = selectedPlan ? selectedPlan.budget : parseInt(customBudget);
    const duration = selectedPlan ? selectedPlan.duration : tripDuration;
    
    if (!budget || !duration || !date?.from || !date?.to) {
        setIsLoading(false);
        return;
    }

    const travel_params = {
        destination,
        departure,
        budget: budget.toString(),
        currency,
        totalTravellers: totalTravellers.toString(),
        durationDays: duration.toString()
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/travel-planner/chat-structured`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query_type: "activities",
                session_id: localStorage.getItem('session_id'),
                user_id: localStorage.getItem('user_id'),
                travel_params
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        const activitiesData = await response.json();
        
        const data: BudgetDurationData = {
            budget,
            duration,
            startDate: date.from,
            endDate: date.to,
            currency,
            selectedPlan: selectedPlan || undefined,
            activities: activitiesData.data.data // Assuming this is the path to activities array
        };
        
        onNext(data);

    } catch (error) {
        console.error("Error fetching activities:", error);
        // Handle error, maybe show a toast message
    } finally {
        setIsLoading(false);
    }
  };

  const renderCurrency = (amount: number) => {
    return `${CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '₹'}${amount.toLocaleString()}`;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Budget & Duration</h2>
        <p className="text-muted-foreground">
          Select a pre-designed plan for {destination} or customize your trip.
        </p>
      </div>

      {/* Default Trip Suggestions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">AI-Curated Trip Plans</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          {defaultTripPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-smooth hover:shadow-elevation ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{plan.rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {plan.duration} Days
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {renderCurrency(plan.budget)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What's Included:</h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.includes.slice(0, 3).map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
                    {plan.includes.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{plan.includes.length - 3} more</Badge>
                    )}
                  </div>
                </div>
                
                {selectedPlan?.id === plan.id && (
                  <Badge variant="default" className="w-full justify-center mt-2 bg-green-500 text-white">Selected</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Budget & Duration */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Or Customize Your Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Your Budget</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '₹'}
                </span>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 25000"
                  value={customBudget}
                  onChange={handleCustomBudgetChange}
                  className="pl-8"
                />
              </div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Trip Dates ({tripDuration > 0 ? `${tripDuration} Days` : 'Select dates'})</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="duration"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(date.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span>Pick your dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadCalendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
          <Card className="max-w-2xl mx-auto">
              <CardHeader>
                  <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      <CardTitle>Updating your preferences...</CardTitle>
                  </div>
              </CardHeader>
          </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Location
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isLoading || (!customBudget && !selectedPlan)}
          variant="travel"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Continue to Activities →
        </Button>
      </div>
    </div>
  );
};
