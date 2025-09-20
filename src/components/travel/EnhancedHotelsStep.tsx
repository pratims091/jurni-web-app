import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetTracker } from './BudgetTracker';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Waves, 
  UtensilsCrossed,
  Shield,
  Snowflake,
  Camera,
  DollarSign,
  Users,
  CheckCircle
} from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  location: string;
  reviews: number;
  description: string;
  pricePerNight: number;
  totalPrice: number;
  category: 'budget' | 'mid-range' | 'luxury';
  highlights: string[];
  distanceFromCenter: string;
}

interface HotelsData {
  selectedHotel?: Hotel;
  skipHotel: boolean;
  totalCost: number;
}

interface HotelsStepProps {
  onNext: (data: HotelsData) => void;
  onBack: () => void;
  destination: string;
  budget: number;
  spent: number;
  duration: number;
  travelers: number;
  isFlexibleBudget?: boolean;
}

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Coffee,
  'Gym': Dumbbell,
  'Pool': Waves,
  'Restaurant': UtensilsCrossed,
  'Security': Shield,
  'AC': Snowflake,
  'Room Service': UtensilsCrossed,
  'Spa': Waves,
  'Concierge': Shield,
  'Bar': Coffee
};

const mockHotels: Hotel[] = [
  {
    id: 'budget1',
    name: 'Cozy Stay Inn',
    rating: 3.8,
    price: 1500,
    pricePerNight: 1500,
    totalPrice: 0, 
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Breakfast', 'Parking', 'AC'],
    location: 'City Center',
    reviews: 243,
    description: 'Clean, comfortable rooms with essential amenities in the heart of the city.',
    category: 'budget',
    highlights: ['Great location', 'Friendly staff', 'Good value'],
    distanceFromCenter: '0.5 km'
  },
  {
    id: 'budget2',
    name: 'Traveler\'s Lodge',
    rating: 3.6,
    price: 1200,
    pricePerNight: 1200,
    totalPrice: 0,
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Breakfast', 'Security'],
    location: 'Near Transport Hub',
    reviews: 189,
    description: 'Budget-friendly accommodation perfect for backpackers and budget travelers.',
    category: 'budget',
    highlights: ['Close to transport', 'Budget-friendly', 'Clean rooms'],
    distanceFromCenter: '2 km'
  },
  {
    id: 'midrange1',
    name: 'Grand Vista Hotel',
    rating: 4.3,
    price: 3500,
    pricePerNight: 3500,
    totalPrice: 0,
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'AC', 'Room Service'],
    location: 'Premium District',
    reviews: 567,
    description: 'Modern hotel with excellent amenities and stunning city views.',
    category: 'mid-range',
    highlights: ['Great views', 'Modern facilities', 'Excellent service'],
    distanceFromCenter: '1.2 km'
  },
  {
    id: 'midrange2',
    name: 'Heritage Boutique Hotel',
    rating: 4.5,
    price: 4200,
    pricePerNight: 4200,
    totalPrice: 0,
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Parking', 'AC'],
    location: 'Historic Quarter',
    reviews: 432,
    description: 'Charming boutique hotel in a restored heritage building with personalized service.',
    category: 'mid-range',
    highlights: ['Historic charm', 'Personalized service', 'Unique character'],
    distanceFromCenter: '0.8 km'
  },
  {
    id: 'luxury1',
    name: 'Royal Palace Resort',
    rating: 4.8,
    price: 8500,
    pricePerNight: 8500,
    totalPrice: 0,
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Room Service', 'Parking'],
    location: 'Luxury District',
    reviews: 892,
    description: 'Ultra-luxury resort with world-class amenities and impeccable service.',
    category: 'luxury',
    highlights: ['World-class luxury', 'Award-winning spa', 'Michelin-starred dining'],
    distanceFromCenter: '3 km'
  },
  {
    id: 'luxury2',
    name: 'Platinum Suites & Spa',
    rating: 4.7,
    price: 7200,
    pricePerNight: 7200,
    totalPrice: 0,
    image: '/api/placeholder/300/200',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Concierge', 'Room Service', 'AC'],
    location: 'Beachfront/Hillside',
    reviews: 678,
    description: 'Exclusive suites with panoramic views and premium spa facilities.',
    category: 'luxury',
    highlights: ['Panoramic views', 'Exclusive suites', 'Premium spa'],
    distanceFromCenter: '5 km'
  }
];

const categoryColors = {
  budget: 'bg-green-100 text-green-800 border-green-200',
  'mid-range': 'bg-blue-100 text-blue-800 border-blue-200',
  luxury: 'bg-purple-100 text-purple-800 border-purple-200'
};

export const EnhancedHotelsStep = ({ onNext, onBack, destination, budget, spent = 0, duration, travelers, isFlexibleBudget = false }: HotelsStepProps) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const hotelsWithTotalPrice = mockHotels.map(hotel => ({
    ...hotel,
    totalPrice: hotel.pricePerNight * duration
  }));

  const hotelCost = selectedHotel ? hotelsWithTotalPrice.find(h => h.id === selectedHotel.id)?.totalPrice || 0 : 0;
  const totalSpent = spent + hotelCost;

  const filteredHotels = filterCategory === 'all' 
    ? hotelsWithTotalPrice 
    : hotelsWithTotalPrice.filter(hotel => hotel.category === filterCategory);

  const handleHotelSelect = (hotel: Hotel) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedHotel(hotel);
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    if (!selectedHotel) return;
    const data: HotelsData = {
      selectedHotel,
      skipHotel: false,
      totalCost: hotelCost,
    };
    onNext(data);
  };

  const categories = ['all', 'budget', 'mid-range', 'luxury'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Perfect Stay</h2>
        <p className="text-muted-foreground">
          Find the ideal accommodation for your {duration}-day trip to {destination}
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-semibold">{destination}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{duration} nights</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travelers</p>
              <p className="font-semibold">{travelers} people</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-semibold">₹{budget.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BudgetTracker 
        totalBudget={budget}
        spent={totalSpent}
        isFlexible={isFlexibleBudget}
      />

      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {category === 'all' ? 'All Hotels' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>AI is checking availability and best rates...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card 
            key={hotel.id}
            className={`cursor-pointer transition-smooth hover:shadow-elevation ${
              selectedHotel?.id === hotel.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleHotelSelect(hotel)}
          >
            <div className="relative h-48 bg-gradient-subtle rounded-t-lg flex items-center justify-center">
              <Camera className="w-12 h-12 text-white" />
              <Badge 
                className={`absolute top-3 left-3 ${categoryColors[hotel.category]}`}
              >
                {hotel.category}
              </Badge>
            </div>
            
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{hotel.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {hotel.location} • {hotel.distanceFromCenter}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {hotel.description}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 4).map((amenity) => {
                    const IconComponent = amenityIcons[amenity] || Shield;
                    return (
                      <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
                        <IconComponent className="w-3 h-3" />
                        {amenity}
                      </Badge>
                    );
                  })}
                  {hotel.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Highlights</h4>
                <div className="space-y-1">
                  {hotel.highlights.slice(0, 2).map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Per night</span>
                  <span className="font-semibold">₹{hotel.pricePerNight.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total ({duration} nights)</span>
                  <span className="text-lg font-bold text-primary">₹{hotel.totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">{hotel.reviews} reviews</p>
              </div>
              
              {selectedHotel?.id === hotel.id && (
                <Badge className="w-full justify-center bg-success">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selected Hotel
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedHotel && !isLoading && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Selected Hotel: {selectedHotel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{selectedHotel.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedHotel.rating}/5</span>
                  <span className="text-sm text-muted-foreground">({selectedHotel.reviews} reviews)</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-xl font-bold text-primary">₹{hotelCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Activities
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedHotel}
          variant="travel"
        >
          Continue to Flights →
        </Button>
      </div>
    </div>
  );
};