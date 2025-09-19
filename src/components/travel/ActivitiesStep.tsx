import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Camera, 
  Mountain, 
  Waves, 
  Utensils, 
  Music, 
  ShoppingBag,
  TreePine,
  Landmark,
  Heart,
  Clock,
  DollarSign,
  Users,
  MapPin
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  cost: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  groupSize: string;
  location: string;
  icon: any;
  included: boolean;
  popular: boolean;
}

interface ActivitiesStepProps {
  onNext: (selectedActivities: Activity[]) => void;
  onBack: () => void;
  destination: string;
  budget: number;
  duration: number;
}

const availableActivities: Activity[] = [
  {
    id: '1',
    name: 'Heritage Palace Tour',
    description: 'Explore magnificent palaces with royal architecture and rich history',
    category: 'Cultural',
    duration: '4-5 hours',
    cost: 1500,
    difficulty: 'Easy',
    groupSize: '2-20 people',
    location: 'City Center',
    icon: Landmark,
    included: true,
    popular: true
  },
  {
    id: '2',
    name: 'Local Food Walking Tour',
    description: 'Taste authentic local cuisine at hidden gems and street food spots',
    category: 'Food & Drink',
    duration: '3-4 hours',
    cost: 1200,
    difficulty: 'Easy',
    groupSize: '4-15 people',
    location: 'Old City Markets',
    icon: Utensils,
    included: true,
    popular: true
  },
  {
    id: '3',
    name: 'Sunrise Mountain Trekking',
    description: 'Early morning trek to witness breathtaking sunrise views',
    category: 'Adventure',
    duration: '6-7 hours',
    cost: 2000,
    difficulty: 'Medium',
    groupSize: '4-12 people',
    location: 'Mountain Base',
    icon: Mountain,
    included: false,
    popular: true
  },
  {
    id: '4',
    name: 'Traditional Handicraft Workshop',
    description: 'Learn traditional arts and crafts from local master artisans',
    category: 'Cultural',
    duration: '2-3 hours',
    cost: 800,
    difficulty: 'Easy',
    groupSize: '2-8 people',
    location: 'Artisan Village',
    icon: Heart,
    included: false,
    popular: false
  },
  {
    id: '5',
    name: 'Photography Walk',
    description: 'Capture stunning shots with a professional local photographer guide',
    category: 'Photography',
    duration: '3-4 hours',
    cost: 1800,
    difficulty: 'Easy',
    groupSize: '2-6 people',
    location: 'Scenic Spots',
    icon: Camera,
    included: false,
    popular: true
  },
  {
    id: '6',
    name: 'Evening Cultural Show',
    description: 'Experience traditional music, dance, and cultural performances',
    category: 'Entertainment',
    duration: '2-3 hours',
    cost: 1000,
    difficulty: 'Easy',
    groupSize: '2-50 people',
    location: 'Cultural Center',
    icon: Music,
    included: true,
    popular: false
  },
  {
    id: '7',
    name: 'Local Markets Shopping Tour',
    description: 'Discover unique local products and practice bargaining skills',
    category: 'Shopping',
    duration: '2-3 hours',
    cost: 500,
    difficulty: 'Easy',
    groupSize: '2-10 people',
    location: 'Traditional Markets',
    icon: ShoppingBag,
    included: false,
    popular: false
  },
  {
    id: '8',
    name: 'Nature Reserve Safari',
    description: 'Wildlife spotting and nature walk in protected reserve area',
    category: 'Wildlife',
    duration: '5-6 hours',
    cost: 2500,
    difficulty: 'Medium',
    groupSize: '4-12 people',
    location: 'Nature Reserve',
    icon: TreePine,
    included: false,
    popular: true
  },
  {
    id: '9',
    name: 'Boat Ride & Sunset Views',
    description: 'Peaceful boat journey with spectacular sunset photography',
    category: 'Scenic',
    duration: '2-3 hours',
    cost: 1300,
    difficulty: 'Easy',
    groupSize: '2-15 people',
    location: 'Lake/River',
    icon: Waves,
    included: false,
    popular: true
  }
];

const activityCategories = [
  { name: 'All', count: availableActivities.length },
  { name: 'Cultural', count: availableActivities.filter(a => a.category === 'Cultural').length },
  { name: 'Adventure', count: availableActivities.filter(a => a.category === 'Adventure').length },
  { name: 'Food & Drink', count: availableActivities.filter(a => a.category === 'Food & Drink').length },
  { name: 'Entertainment', count: availableActivities.filter(a => a.category === 'Entertainment').length },
  { name: 'Shopping', count: availableActivities.filter(a => a.category === 'Shopping').length }
];

export const ActivitiesStep = ({ onNext, onBack, destination, budget, duration }: ActivitiesStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    availableActivities.filter(a => a.included).map(a => a.id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = availableActivities.filter(
    activity => selectedCategory === 'All' || activity.category === selectedCategory
  );

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const getSelectedActivitiesData = () => {
    return availableActivities.filter(activity => selectedActivities.includes(activity.id));
  };

  const getTotalCost = () => {
    return getSelectedActivitiesData().reduce((total, activity) => total + activity.cost, 0);
  };

  const handleNext = () => {
    setIsLoading(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      setIsLoading(false);
      onNext(getSelectedActivitiesData());
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success';
      case 'Medium': return 'bg-warning/20 text-warning';
      case 'Hard': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Experiences</h2>
        <p className="text-muted-foreground">
          Select activities and attractions for your {duration}-day trip to {destination}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {activityCategories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.name)}
            className="h-auto py-2 px-4"
          >
            {category.name}
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredActivities.map((activity) => {
          const IconComponent = activity.icon;
          const isSelected = selectedActivities.includes(activity.id);
          
          return (
            <Card 
              key={activity.id}
              className={`cursor-pointer transition-smooth hover:shadow-elevation ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleActivityToggle(activity.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">{activity.name}</CardTitle>
                        {activity.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                        {activity.included && (
                          <Badge className="text-xs bg-success">Included</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {}}
                    className="flex-shrink-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ₹{activity.cost.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {activity.groupSize}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {activity.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedActivities.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Activities ({selectedActivities.length})</span>
              <span className="text-primary">Total: ₹{getTotalCost().toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getSelectedActivitiesData().map((activity) => (
                <Badge key={activity.id} variant="secondary" className="text-sm py-1 px-2">
                  {activity.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityToggle(activity.id);
                    }}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>Optimizing your activity schedule...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
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
          disabled={selectedActivities.length === 0}
          variant="travel"
        >
          Continue to Hotels →
        </Button>
      </div>
    </div>
  );
};