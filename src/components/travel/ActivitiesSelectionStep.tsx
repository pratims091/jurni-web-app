import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetTracker } from './BudgetTracker';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Camera, 
  Mountain, 
  Utensils, 
  Music, 
  ShoppingBag,
  Zap
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'adventure' | 'cultural' | 'nature' | 'food' | 'entertainment' | 'shopping';
  duration: number; // Changed from string to number for compatibility
  cost: number;
  rating: number;
  popularity: 'high' | 'medium' | 'low';
  included: boolean;
  difficulty: string;
  groupSize: string;
  location: string;
  icon: string;
}

interface ActivitiesData {
  selectedActivities: Activity[];
  totalCost: number;
}

interface ActivitiesSelectionStepProps {
  onNext: (data: ActivitiesData) => void;
  onBack: () => void;
  destination: string;
  budget: number;
  duration: number;
  isFlexibleBudget?: boolean;
}

const mockActivities: Activity[] = [
  // Adventure Activities
  {
    id: 'adventure1',
    name: 'Mountain Trekking Adventure',
    description: 'Guided trek through scenic mountain trails with breathtaking views',
    category: 'adventure',
    duration: 7,
    cost: 2500,
    rating: 4.8,
    popularity: 'high',
    included: false,
    difficulty: 'moderate',
    groupSize: '8-12 people',
    location: 'Mountain Base Camp',
    icon: '🏔️'
  },
  {
    id: 'adventure2',
    name: 'Water Sports Package',
    description: 'Includes jet skiing, parasailing, and banana boat rides',
    category: 'adventure',
    duration: 4,
    cost: 3500,
    rating: 4.6,
    popularity: 'high',
    included: false,
    difficulty: 'easy',
    groupSize: '4-6 people',
    location: 'Beach Resort',
    icon: '🏄‍♂️'
  },
  {
    id: 'adventure3',
    name: 'Rock Climbing Experience',
    description: 'Professional guided rock climbing for beginners and experts',
    category: 'adventure',
    duration: 4,
    cost: 1800,
    rating: 4.7,
    popularity: 'medium',
    included: false,
    difficulty: 'hard',
    groupSize: '6-10 people',
    location: 'Rock Formation Site',
    icon: '🧗‍♂️'
  },

  // Cultural Activities
  {
    id: 'cultural1',
    name: 'Heritage Walking Tour',
    description: 'Explore ancient monuments and learn about local history',
    category: 'cultural',
    duration: 3,
    cost: 800,
    rating: 4.5,
    popularity: 'high',
    included: true,
    difficulty: 'easy',
    groupSize: '10-15 people',
    location: 'Historic District',
    icon: '🏛️'
  },
  {
    id: 'cultural2',
    name: 'Traditional Dance Performance',
    description: 'Evening cultural show with traditional music and dance',
    category: 'cultural',
    duration: 2,
    cost: 1200,
    rating: 4.4,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '20-30 people',
    location: 'Cultural Center',
    icon: '💃'
  },
  {
    id: 'cultural3',
    name: 'Artisan Workshop Visit',
    description: 'Meet local craftspeople and try your hand at traditional arts',
    category: 'cultural',
    duration: 3,
    cost: 1500,
    rating: 4.6,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '8-12 people',
    location: 'Artisan Quarter',
    icon: '🎨'
  },

  // Nature Activities
  {
    id: 'nature1',
    name: 'Wildlife Safari',
    description: 'Guided safari to spot local wildlife in natural habitat',
    category: 'nature',
    duration: 6,
    cost: 2800,
    rating: 4.7,
    popularity: 'high',
    included: false,
    difficulty: 'easy',
    groupSize: '6-8 people',
    location: 'National Park',
    icon: '🦁'
  },
  {
    id: 'nature2',
    name: 'Sunrise/Sunset Viewing',
    description: 'Premium spots for spectacular sunrise or sunset photography',
    category: 'nature',
    duration: 2,
    cost: 500,
    rating: 4.8,
    popularity: 'high',
    included: true,
    difficulty: 'easy',
    groupSize: '10-15 people',
    location: 'Scenic Viewpoint',
    icon: '🌅'
  },
  {
    id: 'nature3',
    name: 'Botanical Garden Tour',
    description: 'Explore diverse flora and learn about medicinal plants',
    category: 'nature',
    duration: 3,
    cost: 400,
    rating: 4.2,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '12-18 people',
    location: 'Botanical Gardens',
    icon: '🌿'
  },

  // Food Activities
  {
    id: 'food1',
    name: 'Local Food Walking Tour',
    description: 'Taste authentic street food and visit famous local eateries',
    category: 'food',
    duration: 4,
    cost: 1800,
    rating: 4.9,
    popularity: 'high',
    included: false,
    difficulty: 'easy',
    groupSize: '8-12 people',
    location: 'Food District',
    icon: '🍜'
  },
  {
    id: 'food2',
    name: 'Cooking Class Experience',
    description: 'Learn to cook traditional dishes with local ingredients',
    category: 'food',
    duration: 3,
    cost: 2200,
    rating: 4.7,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '6-10 people',
    location: 'Cooking School',
    icon: '👩‍🍳'
  },
  {
    id: 'food3',
    name: 'Spice Market Tour',
    description: 'Explore aromatic spice markets and learn about local flavors',
    category: 'food',
    duration: 2,
    cost: 600,
    rating: 4.4,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '10-15 people',
    location: 'Spice Bazaar',
    icon: '🌶️'
  },

  // Entertainment Activities
  {
    id: 'entertainment1',
    name: 'Night Market Experience',
    description: 'Evening exploration of vibrant night markets and local life',
    category: 'entertainment',
    duration: 4,
    cost: 900,
    rating: 4.5,
    popularity: 'high',
    included: false,
    difficulty: 'easy',
    groupSize: '8-12 people',
    location: 'Night Market District',
    icon: '🌃'
  },
  {
    id: 'entertainment2',
    name: 'Live Music Venue Tour',
    description: 'Visit popular music venues and enjoy live performances',
    category: 'entertainment',
    duration: 5,
    cost: 2000,
    rating: 4.6,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '6-10 people',
    location: 'Entertainment District',
    icon: '🎵'
  },

  // Shopping Activities
  {
    id: 'shopping1',
    name: 'Local Markets & Bazaars',
    description: 'Guided shopping tour to find authentic souvenirs and handicrafts',
    category: 'shopping',
    duration: 3,
    cost: 700,
    rating: 4.3,
    popularity: 'high',
    included: false,
    difficulty: 'easy',
    groupSize: '8-12 people',
    location: 'Market District',
    icon: '🛍️'
  },
  {
    id: 'shopping2',
    name: 'Handicraft Center Visit',
    description: 'Visit authentic handicraft centers and meet the artisans',
    category: 'shopping',
    duration: 3,
    cost: 500,
    rating: 4.4,
    popularity: 'medium',
    included: false,
    difficulty: 'easy',
    groupSize: '10-15 people',
    location: 'Handicraft Center',
    icon: '🏺'
  }
];

const categoryIcons = {
  adventure: Mountain,
  cultural: Camera,
  nature: MapPin,
  food: Utensils,
  entertainment: Music,
  shopping: ShoppingBag
};

const categoryColors = {
  adventure: 'bg-red-500/10 text-red-700 border-red-200',
  cultural: 'bg-purple-500/10 text-purple-700 border-purple-200',
  nature: 'bg-green-500/10 text-green-700 border-green-200',
  food: 'bg-orange-500/10 text-orange-700 border-orange-200',
  entertainment: 'bg-blue-500/10 text-blue-700 border-blue-200',
  shopping: 'bg-pink-500/10 text-pink-700 border-pink-200'
};

export const ActivitiesSelectionStep = ({ onNext, onBack, destination, budget, duration, isFlexibleBudget = false }: ActivitiesSelectionStepProps) => {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(
    mockActivities.filter(activity => activity.included)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'adventure', 'cultural', 'nature', 'food', 'entertainment', 'shopping'];

  const filteredActivities = selectedCategory === 'all' 
    ? mockActivities 
    : mockActivities.filter(activity => activity.category === selectedCategory);

  const totalCost = selectedActivities.reduce((sum, activity) => sum + activity.cost, 0);
  const remainingBudget = budget - totalCost;

  const handleActivityToggle = (activity: Activity, checked: boolean) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (checked) {
        setSelectedActivities(prev => [...prev, activity]);
      } else {
        setSelectedActivities(prev => prev.filter(a => a.id !== activity.id));
      }
      setIsLoading(false);
    }, 300);
  };

  const handleNext = () => {
    const data: ActivitiesData = {
      selectedActivities,
      totalCost
    };
    onNext(data);
  };

  const isActivitySelected = (activityId: string) => {
    return selectedActivities.some(activity => activity.id === activityId);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Experiences</h2>
        <p className="text-muted-foreground">
          Select activities and attractions for your {duration}-day trip to {destination}
        </p>
      </div>

      {/* Budget Tracker */}
      <BudgetTracker 
        totalBudget={budget}
        spent={totalCost}
        isFlexible={isFlexibleBudget}
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const CategoryIcon = category !== 'all' ? categoryIcons[category as keyof typeof categoryIcons] : Zap;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2"
            >
              <CategoryIcon className="w-4 h-4" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>AI is updating your itinerary...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((activity) => {
          const CategoryIcon = categoryIcons[activity.category];
          const isSelected = isActivitySelected(activity.id);
          
          return (
            <Card 
              key={activity.id} 
              className={`cursor-pointer transition-smooth hover:shadow-elevation ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleActivityToggle(activity, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <CardTitle className="text-base line-clamp-2">{activity.name}</CardTitle>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`w-fit ${categoryColors[activity.category]}`}
                    >
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {activity.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.duration}h
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {activity.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <DollarSign className="w-4 h-4" />
                      ₹{activity.cost.toLocaleString()}
                    </div>
                    {activity.included && (
                      <Badge variant="secondary" className="text-xs">Included</Badge>
                    )}
                    {activity.popularity === 'high' && (
                      <Badge variant="destructive" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Activities Summary */}
      {selectedActivities.length > 0 && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Selected Activities ({selectedActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{activity.name}</span>
                  <span className="font-medium">₹{activity.cost.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 font-semibold text-lg">
                <span>Total Activities Cost:</span>
                <span>₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Budget
        </Button>
        <Button 
          onClick={handleNext}
          variant="travel"
          disabled={selectedActivities.length === 0}
        >
          Continue to Hotels →
        </Button>
      </div>
    </div>
  );
};