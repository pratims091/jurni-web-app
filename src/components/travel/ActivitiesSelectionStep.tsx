import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetTracker } from './BudgetTracker';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star, 
  Camera, 
  Mountain, 
  Utensils, 
  Music, 
  ShoppingBag,
  Zap,
  Palette
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  category: string; // Updated to handle comma-separated strings from API
  duration: number;
  cost: number;
  rating: number;
  popularity: string;
  difficulty: string;
  groupSize: string;
  location: string;
}

// A type for the props that includes the new activities array
interface ActivitiesSelectionStepProps {
  onNext: (data: { selectedActivities: Activity[], totalCost: number }) => void;
  onBack: () => void;
  destination: string;
  budget: number;
  duration: number;
  activities: Activity[]; // API data passed as a prop
  isFlexibleBudget?: boolean;
}

// Mapping API categories to component categories
const mapApiCategory = (apiCategory: string): keyof typeof categoryIcons => {
    const lowerCaseCategory = apiCategory.toLowerCase();
    if (lowerCaseCategory.includes('adventure') || lowerCaseCategory.includes('sports')) return 'adventure';
    if (lowerCaseCategory.includes('cultural') || lowerCaseCategory.includes('history')) return 'cultural';
    if (lowerCaseCategory.includes('nature') || lowerCaseCategory.includes('relaxation')) return 'nature';
    if (lowerCaseCategory.includes('food') || lowerCaseCategory.includes('gastronomy')) return 'food';
    if (lowerCaseCategory.includes('entertainment') || lowerCaseCategory.includes('music')) return 'entertainment';
    if (lowerCaseCategory.includes('shopping') || lowerCaseCategory.includes('market')) return 'shopping';
    return 'general';
}

const categoryIcons = {
  adventure: Mountain,
  cultural: Camera,
  nature: MapPin,
  food: Utensils,
  entertainment: Music,
  shopping: ShoppingBag,
  general: Palette
};

const categoryColors = {
  adventure: 'bg-red-500/10 text-red-700 border-red-200',
  cultural: 'bg-purple-500/10 text-purple-700 border-purple-200',
  nature: 'bg-green-500/10 text-green-700 border-green-200',
  food: 'bg-orange-500/10 text-orange-700 border-orange-200',
  entertainment: 'bg-blue-500/10 text-blue-700 border-blue-200',
  shopping: 'bg-pink-500/10 text-pink-700 border-pink-200',
  general: 'bg-gray-500/10 text-gray-700 border-gray-200'
};

export const ActivitiesSelectionStep = ({ 
  onNext, 
  onBack, 
  destination, 
  budget, 
  duration, 
  activities, // Using activities from props
  isFlexibleBudget = false 
}: ActivitiesSelectionStepProps) => {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dynamically get categories from the activities data
  const categories = ['all', ...Array.from(new Set(activities.map(a => mapApiCategory(a.category))))];

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => mapApiCategory(activity.category) === selectedCategory);

  const totalCost = selectedActivities.reduce((sum, activity) => sum + activity.cost, 0);

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
    onNext({ selectedActivities, totalCost });
  };

  const isActivitySelected = (activityId: string) => {
    return selectedActivities.some(activity => activity.id === activityId);
  };

  if (activities.length === 0) {
    return (
        <div className="space-y-6 max-w-6xl mx-auto text-center">
            <Card>
                <CardHeader>
                    <CardTitle>No Activities Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We couldn't find any activities for the selected criteria. Please try different options.</p>
                    <Button onClick={onBack} variant="outline" className="mt-4">
                      ← Back to Budget & Duration
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Experiences</h2>
        <p className="text-muted-foreground">
          Select activities for your {duration}-day trip to {destination}
        </p>
      </div>

      <BudgetTracker 
        totalBudget={budget}
        spent={totalCost}
        isFlexible={isFlexibleBudget}
      />

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

      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>AI is updating your itinerary...</CardTitle>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((activity) => {
          const mappedCategory = mapApiCategory(activity.category);
          const CategoryIcon = categoryIcons[mappedCategory];
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
                                className={`w-fit ${categoryColors[mappedCategory]}`}>
                                <CategoryIcon className="w-3 h-3 mr-1" />
                                {mappedCategory}
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
                      <IndianRupee className="w-4 h-4" />
                      {activity.cost.toLocaleString()}
                    </div>
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

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Budget
        </Button>
        <Button 
          onClick={handleNext}
          variant="travel"
          disabled={selectedActivities.length === 0}
        >
          Continue to Day-wise Plan →
        </Button>
      </div>
    </div>
  );
};