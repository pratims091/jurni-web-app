import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Waves,
  Dumbbell,
  Coffee,
  MapPin,
  Users,
  Shield,
  Heart,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  location: string;
  distance: string;
  reviews: number;
  description: string;
  amenities: string[];
  roomType: string;
  cancellation: 'Free' | 'Paid' | 'Non-refundable';
  breakfast: boolean;
  popular: boolean;
  deal: boolean;
}

interface HotelsStepProps {
  onNext: (selectedHotel: Hotel | null, skipHotel: boolean) => void;
  onBack: () => void;
  destination: string;
  duration: number;
  budget: number;
  travelers: number;
}

const availableHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Palace Resort & Spa',
    rating: 4.8,
    price: 8500,
    originalPrice: 12000,
    image: '/api/placeholder/300/200',
    location: 'City Center',
    distance: '0.5 km from main attractions',
    reviews: 1247,
    description: 'Luxury resort with world-class amenities and exceptional service in the heart of the city',
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'WiFi', 'Parking', 'Room Service', 'Concierge'],
    roomType: 'Deluxe Room with City View',
    cancellation: 'Free',
    breakfast: true,
    popular: true,
    deal: true
  },
  {
    id: '2',
    name: 'Heritage Boutique Hotel',
    rating: 4.6,
    price: 5500,
    image: '/api/placeholder/300/200',
    location: 'Heritage District',
    distance: '1.2 km from main attractions',
    reviews: 892,
    description: 'Charming boutique hotel in a restored heritage building with modern comforts',
    amenities: ['WiFi', 'Restaurant', 'Rooftop Terrace', 'Laundry', 'Concierge'],
    roomType: 'Heritage Suite',
    cancellation: 'Free',
    breakfast: true,
    popular: true,
    deal: false
  },
  {
    id: '3',
    name: 'Comfort Inn & Suites',
    rating: 4.2,
    price: 3200,
    image: '/api/placeholder/300/200',
    location: 'Business District',
    distance: '2.5 km from main attractions',
    reviews: 654,
    description: 'Modern hotel with comfortable rooms and essential amenities at great value',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Parking', 'Business Center'],
    roomType: 'Standard Double Room',
    cancellation: 'Free',
    breakfast: false,
    popular: false,
    deal: false
  },
  {
    id: '4',
    name: 'Beachside Villa Resort',
    rating: 4.9,
    price: 12500,
    originalPrice: 15000,
    image: '/api/placeholder/300/200',
    location: 'Beachfront',
    distance: '3 km from city center',
    reviews: 2134,
    description: 'Exclusive beachfront resort with private villas and pristine beach access',
    amenities: ['Private Beach', 'Pool', 'Spa', 'Water Sports', 'Multiple Restaurants', 'WiFi', 'Butler Service'],
    roomType: 'Ocean View Villa',
    cancellation: 'Paid',
    breakfast: true,
    popular: true,
    deal: true
  },
  {
    id: '5',
    name: 'Budget Traveler Lodge',
    rating: 3.8,
    price: 1800,
    image: '/api/placeholder/300/200',
    location: 'Near Railway Station',
    distance: '4 km from main attractions',
    reviews: 423,
    description: 'Clean and comfortable accommodation perfect for budget-conscious travelers',
    amenities: ['WiFi', 'Shared Kitchen', 'Laundry', 'Common Area'],
    roomType: 'Shared Dormitory',
    cancellation: 'Non-refundable',
    breakfast: false,
    popular: false,
    deal: false
  },
  {
    id: '6',
    name: 'Mountain View Resort',
    rating: 4.4,
    price: 6800,
    image: '/api/placeholder/300/200',
    location: 'Hillside',
    distance: '5 km from city center',
    reviews: 756,
    description: 'Peaceful resort with stunning mountain views and nature activities',
    amenities: ['Mountain View', 'Restaurant', 'Trekking', 'Bonfire', 'WiFi', 'Parking'],
    roomType: 'Mountain View Cottage',
    cancellation: 'Free',
    breakfast: true,
    popular: false,
    deal: false
  }
];

const amenityIcons = {
  'Pool': Waves,
  'Spa': Heart,
  'Gym': Dumbbell,
  'Restaurant': Utensils,
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Coffee,
  'Room Service': Shield,
  'Concierge': Users
};

export const HotelsStep = ({ onNext, onBack, destination, duration, budget, travelers }: HotelsStepProps) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState('all');
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleHotelSelect = (hotel: Hotel) => {
    setIsLoading(true);
    setSelectedHotel(hotel);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSkipHotel = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onNext(null, true);
    }, 500);
  };

  const handleNext = () => {
    if (!selectedHotel) return;
    onNext(selectedHotel, false);
  };

  const filteredHotels = availableHotels
    .filter(hotel => {
      if (priceFilter === 'budget' && hotel.price > 4000) return false;
      if (priceFilter === 'mid' && (hotel.price < 4000 || hotel.price > 8000)) return false;
      if (priceFilter === 'luxury' && hotel.price < 8000) return false;
      if (amenityFilters.length > 0 && !amenityFilters.every(filter => hotel.amenities.includes(filter))) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'popular': return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default: return b.rating - a.rating; // recommended
      }
    });

  const toggleAmenityFilter = (amenity: string) => {
    setAmenityFilters(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const getCancellationColor = (cancellation: string) => {
    switch (cancellation) {
      case 'Free': return 'bg-success/20 text-success';
      case 'Paid': return 'bg-warning/20 text-warning';
      case 'Non-refundable': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Accommodation</h2>
        <p className="text-muted-foreground">
          Find the perfect place to stay for {duration} nights in {destination}
        </p>
      </div>

      {/* Skip Option */}
      <Card className="max-w-2xl mx-auto border-dashed">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-semibold">Already have accommodation?</h3>
            <p className="text-sm text-muted-foreground">Skip hotel booking and arrange your own stay</p>
          </div>
          <Button onClick={handleSkipHotel} variant="outline">
            Skip Hotels
          </Button>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">Budget (&lt; ₹4,000)</SelectItem>
              <SelectItem value="mid">Mid-range (₹4,000 - ₹8,000)</SelectItem>
              <SelectItem value="luxury">Luxury (&gt; ₹8,000)</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Amenities
                {amenityFilters.length > 0 && (
                  <Badge variant="secondary">{amenityFilters.length}</Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <h4 className="font-semibold">Filter by Amenities</h4>
                {['Pool', 'Spa', 'Gym', 'Restaurant', 'Parking', 'WiFi'].map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={amenityFilters.includes(amenity)}
                      onCheckedChange={() => toggleAmenityFilter(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm">{amenity}</label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredHotels.length} hotels found
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => (
          <Card 
            key={hotel.id}
            className={`cursor-pointer transition-smooth hover:shadow-elevation ${
              selectedHotel?.id === hotel.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleHotelSelect(hotel)}
          >
            <div className="relative">
              <div className="h-48 bg-gradient-card rounded-t-lg flex items-center justify-center relative">
                <div className="text-4xl">🏨</div>
                {hotel.deal && (
                  <Badge className="absolute top-3 left-3 bg-destructive">
                    Deal
                  </Badge>
                )}
                {hotel.popular && (
                  <Badge className="absolute top-3 right-3 bg-success">
                    Popular
                  </Badge>
                )}
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{hotel.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(hotel.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({hotel.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {hotel.location} • {hotel.distance}
                  </div>
                </div>
                <div className="text-right">
                  {hotel.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{hotel.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xl font-bold text-primary">
                    ₹{hotel.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">per night</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {hotel.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Room Type:</span>
                  <span>{hotel.roomType}</span>
                </div>
                {hotel.breakfast && (
                  <div className="flex items-center gap-1 text-sm text-success">
                    <Coffee className="w-3 h-3" />
                    Breakfast included
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {hotel.amenities.slice(0, 4).map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || Shield;
                  return (
                    <div key={amenity} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                      <IconComponent className="w-3 h-3" />
                      {amenity}
                    </div>
                  );
                })}
                {hotel.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{hotel.amenities.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getCancellationColor(hotel.cancellation)}`}>
                  {hotel.cancellation} Cancellation
                </Badge>
                {selectedHotel?.id === hotel.id && (
                  <Badge className="bg-success">Selected</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>Confirming availability and best rates...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
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