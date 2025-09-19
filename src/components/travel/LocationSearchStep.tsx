import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Users, Plane, Globe, Clock, Coffee, Camera, Mountain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { City } from '@/data/travelData';

interface LocationInfo {
  destination: string;
  departureCity: string;
  numberOfTravelers: number;
  selectedCity?: City;
}

interface LocationSearchStepProps {
  onNext: (locationInfo: LocationInfo) => void;
  initialData?: Partial<LocationInfo>;
}

const popularDestinations = [
  {
    id: '1',
    name: 'Goa',
    country: 'India',
    image: '/api/placeholder/300/200',
    description: 'Golden beaches, Portuguese heritage, vibrant nightlife',
    foodSpecialties: ['Goan Fish Curry', 'Bebinca', 'Feni', 'Pork Vindaloo'],
    culturalHighlights: ['Portuguese Architecture', 'Carnival Festival', 'Beach Culture', 'Catholic Churches'],
    landmarks: ['Baga Beach', 'Basilica of Bom Jesus', 'Fort Aguada', 'Old Goa Churches'],
    activities: ['Beach Sports', 'Water Skiing', 'Dolphin Watching', 'Spice Plantation Tours'],
    averageCost: 60
  },
  {
    id: '2',
    name: 'Kerala',
    country: 'India',
    image: '/api/placeholder/300/200',
    description: 'Backwaters, hill stations, and Ayurveda treatments',
    foodSpecialties: ['Appam with Stew', 'Karimeen Fish', 'Puttu', 'Kerala Sadya'],
    culturalHighlights: ['Kathakali Dance', 'Ayurveda Traditions', 'Coconut Culture', 'Spice Heritage'],
    landmarks: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Periyar Wildlife Sanctuary'],
    activities: ['Houseboat Cruising', 'Ayurveda Treatments', 'Tea Plantation Tours', 'Wildlife Safari'],
    averageCost: 50
  },
  {
    id: '3',
    name: 'Rajasthan',
    country: 'India',
    image: '/api/placeholder/300/200',
    description: 'Majestic palaces, desert landscapes, royal heritage',
    foodSpecialties: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Malpua'],
    culturalHighlights: ['Rajput Heritage', 'Folk Music & Dance', 'Royal Architecture', 'Desert Culture'],
    landmarks: ['Amber Fort', 'City Palace Udaipur', 'Hawa Mahal', 'Thar Desert'],
    activities: ['Camel Safari', 'Palace Tours', 'Desert Camping', 'Cultural Shows'],
    averageCost: 55
  },
  {
    id: '4',
    name: 'Himachal Pradesh',
    country: 'India',
    image: '/api/placeholder/300/200',
    description: 'Snow-capped mountains, adventure sports, hill stations',
    foodSpecialties: ['Chana Madra', 'Himachali Trout', 'Siddu', 'Aktori'],
    culturalHighlights: ['Mountain Culture', 'Buddhist Monasteries', 'Apple Orchards', 'Adventure Sports'],
    landmarks: ['Rohtang Pass', 'Shimla Ridge', 'Dharamshala', 'Spiti Valley'],
    activities: ['Trekking', 'Paragliding', 'Skiing', 'Mountain Biking'],
    averageCost: 65
  }
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore'
];

export const LocationSearchStep = ({ onNext, initialData }: LocationSearchStepProps) => {
  const [searchTerm, setSearchTerm] = useState(initialData?.destination || '');
  const [departureCity, setDepartureCity] = useState(initialData?.departureCity || '');
  const [numberOfTravelers, setNumberOfTravelers] = useState(initialData?.numberOfTravelers || 2);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showDestinationDetails, setShowDestinationDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDestinationSelect = (destination) => {
    setIsLoading(true);
    setSelectedDestination(destination);
    setSearchTerm(`${destination.name}, ${destination.country}`);
    
    // Simulate AI loading for destination details
    setTimeout(() => {
      setIsLoading(false);
      setShowDestinationDetails(true);
    }, 1500);
  };

  const handleNext = () => {
    if (!searchTerm || !departureCity) return;

    const locationInfo: LocationInfo = {
      destination: searchTerm,
      departureCity,
      numberOfTravelers,
      selectedCity: selectedDestination
    };
    
    onNext(locationInfo);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Where would you like to go?</h2>
        <p className="text-muted-foreground">Choose your destination and let AI create the perfect itinerary</p>
      </div>

      {/* Search and Basic Info */}
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="destination"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDestinationDetails(false);
              }}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="departure">From City</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <select
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Select departure city</option>
              {indianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="travelers">Travelers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <select
              value={numberOfTravelers}
              onChange={(e) => setNumberOfTravelers(Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      {!searchTerm && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Popular Destinations in India</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="cursor-pointer hover:shadow-elevation transition-smooth group"
                onClick={() => handleDestinationSelect(destination)}
              >
                <div className="relative h-32 bg-gradient-ocean rounded-t-lg flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {destination.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="font-semibold text-primary">₹{(destination.averageCost * 75).toLocaleString()}/day</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filtered Results */}
      {searchTerm && filteredDestinations.length > 0 && !selectedDestination && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="cursor-pointer hover:shadow-elevation transition-smooth"
                onClick={() => handleDestinationSelect(destination)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{destination.name}, {destination.country}</h4>
                      <p className="text-sm text-muted-foreground">{destination.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <CardTitle>Gathering destination insights...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destination Details */}
      {showDestinationDetails && selectedDestination && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {selectedDestination.name}, {selectedDestination.country}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Coffee className="w-4 h-4 text-primary" />
                    Food Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.foodSpecialties.map((food) => (
                      <Badge key={food} variant="secondary">{food}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Famous Landmarks
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.landmarks.map((landmark) => (
                      <Badge key={landmark} variant="outline">{landmark}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Cultural Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.culturalHighlights.map((culture) => (
                      <Badge key={culture} variant="secondary">{culture}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Mountain className="w-4 h-4 text-primary" />
                    Popular Activities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.activities.map((activity) => (
                      <Badge key={activity} variant="outline">{activity}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleNext} 
          disabled={!searchTerm || !departureCity}
          variant="travel" 
          size="lg"
          className="px-8"
        >
          Continue to Budget & Duration
        </Button>
      </div>
    </div>
  );
};