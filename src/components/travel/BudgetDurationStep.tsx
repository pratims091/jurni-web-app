import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  Calendar, 
  Wallet, 
  Star, 
  MapPin, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BudgetDurationData {
  budget: number;
  duration: number;
  budgetType: 'fixed' | 'flexible';
  selectedPlan?: TripPlan;
}

interface BudgetDurationStepProps {
  onNext: (data: BudgetDurationData) => void;
  onBack: () => void;
  initialData?: Partial<BudgetDurationData>;
  destination: string;
}

interface TripPlan {
  id: string;
  title: string;
  duration: number;
  budget: number;
  description: string;
  dailyItinerary: DayPlan[];
  includes: string[];
  accommodationType: string;
  rating: number;
}

interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation: string;
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
    dailyItinerary: [
      {
        day: 1,
        title: 'Arrival & City Orientation',
        activities: ['Airport pickup', 'Hotel check-in', 'Local market visit', 'Welcome dinner'],
        meals: ['Welcome dinner at local restaurant'],
        accommodation: 'Budget hotel in city center'
      },
      {
        day: 2,
        title: 'Main Attractions Tour',
        activities: ['Guided city tour', 'Famous landmarks visit', 'Cultural site exploration', 'Shopping'],
        meals: ['Breakfast', 'Lunch at local eatery'],
        accommodation: 'Same hotel'
      },
      {
        day: 3,
        title: 'Departure',
        activities: ['Free morning', 'Last-minute shopping', 'Airport transfer'],
        meals: ['Breakfast'],
        accommodation: 'Hotel checkout'
      }
    ]
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
    dailyItinerary: [
      {
        day: 1,
        title: 'Grand Arrival',
        activities: ['Private airport pickup', 'Hotel check-in', 'Welcome cocktails', 'City lights tour'],
        meals: ['Welcome dinner with cultural show'],
        accommodation: '3-star hotel with pool'
      },
      {
        day: 2,
        title: 'Heritage & Culture',
        activities: ['Heritage site tours', 'Museum visits', 'Artisan workshops', 'Cultural performances'],
        meals: ['Breakfast', 'Traditional lunch', 'Dinner at rooftop restaurant'],
        accommodation: 'Same hotel'
      },
      {
        day: 3,
        title: 'Adventure Day',
        activities: ['Adventure activities', 'Nature excursion', 'Local experiences', 'Sunset viewing'],
        meals: ['Breakfast', 'Picnic lunch', 'BBQ dinner'],
        accommodation: 'Same hotel'
      },
      {
        day: 4,
        title: 'Leisure & Shopping',
        activities: ['Spa session', 'Shopping tours', 'Local cuisine tasting', 'Free time'],
        meals: ['Breakfast', 'Food court experience', 'Fine dining dinner'],
        accommodation: 'Same hotel'
      },
      {
        day: 5,
        title: 'Farewell',
        activities: ['Late checkout', 'Final sightseeing', 'Souvenir shopping', 'Airport transfer'],
        meals: ['Breakfast', 'Farewell lunch'],
        accommodation: 'Hotel checkout'
      }
    ]
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
    dailyItinerary: [
      {
        day: 1,
        title: 'Royal Welcome',
        activities: ['Luxury car pickup', 'Presidential suite check-in', 'Champagne welcome', 'Private city overview'],
        meals: ['Michelin-starred welcome dinner'],
        accommodation: '5-star luxury resort'
      },
      {
        day: 2,
        title: 'VIP Heritage Experience',
        activities: ['Private heritage tours', 'Exclusive monument access', 'Meet local artisans', 'Royal palace visit'],
        meals: ['Gourmet breakfast', 'Royal lunch', 'Fine dining dinner'],
        accommodation: 'Luxury suite'
      },
      {
        day: 3,
        title: 'Exclusive Adventures',
        activities: ['Private adventure experiences', 'Helicopter tour', 'Exclusive nature reserve', 'Sunset yacht cruise'],
        meals: ['In-suite breakfast', 'Adventure lunch', 'Yacht dinner'],
        accommodation: 'Ocean view suite'
      },
      {
        day: 4,
        title: 'Wellness & Culture',
        activities: ['Luxury spa treatments', 'Private cooking class', 'Cultural immersion', 'Art gallery tours'],
        meals: ['Healthy breakfast', 'Cooking class lunch', 'Cultural dinner show'],
        accommodation: 'Spa suite'
      },
      {
        day: 5,
        title: 'Hidden Gems',
        activities: ['Off-beat locations', 'Private photography tour', 'Exclusive local experiences', 'Wine tasting'],
        meals: ['Continental breakfast', 'Picnic in scenic location', 'Wine pairing dinner'],
        accommodation: 'Premium suite'
      },
      {
        day: 6,
        title: 'Ultimate Relaxation',
        activities: ['Beach/mountain retreat', 'Luxury treatments', 'Personal shopper service', 'Sunset meditation'],
        meals: ['Room service breakfast', 'Beachside/hillside lunch', 'Candlelight dinner'],
        accommodation: 'Retreat villa'
      },
      {
        day: 7,
        title: 'Grand Farewell',
        activities: ['Late luxury checkout', 'Final exclusive experiences', 'Private shopping', 'Luxury airport transfer'],
        meals: ['Champagne breakfast', 'Farewell gourmet lunch'],
        accommodation: 'Departure lounge access'
      }
    ]
  }
];

export const BudgetDurationStep = ({ onNext, onBack, initialData, destination }: BudgetDurationStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(initialData?.selectedPlan || null);
  const [customBudget, setCustomBudget] = useState(initialData?.budget?.toString() || '');
  const [customDuration, setCustomDuration] = useState(initialData?.duration?.toString() || '');
  const [budgetType, setBudgetType] = useState<'fixed' | 'flexible'>(initialData?.budgetType || 'fixed');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: TripPlan) => {
    setIsLoading(true);
    setSelectedPlan(plan);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCustomSubmit = () => {
    if (!customBudget || !customDuration) return;
    
    setIsLoading(true);
    
    // Simulate AI creating custom plan
    setTimeout(() => {
      setIsLoading(false);
      const customPlan: TripPlan = {
        id: 'custom',
        title: 'Custom Adventure',
        duration: parseInt(customDuration),
        budget: parseInt(customBudget),
        description: 'Personalized itinerary created just for you',
        rating: 4.5,
        includes: ['Customized accommodation', 'Flexible transport', 'Curated experiences'],
        accommodationType: 'Selected based on budget',
        dailyItinerary: [] // Would be generated by AI
      };
      setSelectedPlan(customPlan);
    }, 2000);
  };

  const handleNext = () => {
    if (!selectedPlan && (!customBudget || !customDuration)) return;
    
    const data: BudgetDurationData = {
      budget: selectedPlan ? selectedPlan.budget : parseInt(customBudget),
      duration: selectedPlan ? selectedPlan.duration : parseInt(customDuration),
      budgetType,
      selectedPlan: selectedPlan || undefined
    };
    
    onNext(data);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Perfect Trip</h2>
        <p className="text-muted-foreground">
          Select a pre-designed package for {destination} or create your custom experience
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
                      <DollarSign className="w-4 h-4" />
                      ₹{plan.budget.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Includes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.includes.slice(0, 3).map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
                    {plan.includes.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{plan.includes.length - 3} more</Badge>
                    )}
                  </div>
                </div>

                <Collapsible 
                  open={expandedPlan === plan.id} 
                  onOpenChange={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                      <span className="font-medium">View Daily Itinerary</span>
                      {expandedPlan === plan.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    {plan.dailyItinerary.map((day) => (
                      <div key={day.day} className="border rounded-lg p-3 bg-muted/30">
                        <h5 className="font-medium text-sm">Day {day.day}: {day.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {day.activities.join(' • ')}
                        </p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                
                {selectedPlan?.id === plan.id && (
                  <Badge className="w-full justify-center bg-success">Selected Plan</Badge>
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
            Create Custom Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 25000"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 5"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Budget Flexibility</Label>
            <div className="flex gap-2">
              <Button
                variant={budgetType === 'fixed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBudgetType('fixed')}
              >
                Fixed Budget
              </Button>
              <Button
                variant={budgetType === 'flexible' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBudgetType('flexible')}
              >
                Flexible (+/- 20%)
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleCustomSubmit}
            disabled={!customBudget || !customDuration}
            className="w-full"
            variant="travel"
          >
            Create Custom Plan
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>AI is crafting your perfect itinerary...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Location
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedPlan && (!customBudget || !customDuration)}
          variant="travel"
        >
          Continue to Activities →
        </Button>
      </div>
    </div>
  );
};