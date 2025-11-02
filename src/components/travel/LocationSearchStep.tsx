import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Users, Plane, Globe, Coffee, Camera, Mountain, Plus, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { City } from '@/data/travelData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

interface Traveler {
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
}

interface LocationInfo {
  destination: string;
  departureCity: string;
  travelers: Traveler[];
  selectedCity?: City;
}

interface LocationSearchStepProps {
  onNext: (locationInfo: LocationInfo) => void;
  initialData?: Partial<LocationInfo>;
}

const popularDestinations: City[] = [
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
  const { t } = useTranslation();
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedCityValue, setSelectedCityValue] = useState(initialData?.destination || '');
  const [departureCity, setDepartureCity] = useState(initialData?.departureCity || 'Jaipur');
  const [travelers, setTravelers] = useState<Traveler[]>(initialData?.travelers || [{ name: '', gender: 'male' }]);
  const [selectedDestination, setSelectedDestination] = useState<City | null>(initialData?.selectedCity || null);
  const [showDestinationDetails, setShowDestinationDetails] = useState(!!initialData?.selectedCity);
  const [isLoading, setIsLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);

  const fetchCities = async (namePrefix: string) => {
    setIsCityLoading(true);
    try {
      const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=IN&namePrefix=${namePrefix}`,
        {
          headers: {
            'x-rapidapi-host': import.meta.env.VITE_APP_RAPIDAPI_HOST,
            'x-rapidapi-key': import.meta.env.VITE_APP_RAPIDAPI_KEY, // Using key from .env file
          },
        }
      );
      const data = await response.json();
      const options = data.data.map((city: any) => ({
        value: city.name,
        label: `${city.name}, ${city.country}`,
      }));
      setCityOptions(options);
    } catch (error) {
      console.error("Error fetching cities:", error);
      // Optionally, show an error message to the user
    }
    setIsCityLoading(false);
  };

  // Initial fetch for cities
  useEffect(() => {
    fetchCities('');
  }, []);

  const debouncedFetchCities = useCallback(debounce(fetchCities, 300), []);

  useEffect(() => {
    if (destinationSearch) {
      debouncedFetchCities(destinationSearch);
    }
  }, [destinationSearch, debouncedFetchCities]);


  const handleDestinationSelect = (destinationValue: string) => {
    setSelectedCityValue(destinationValue);
    setShowDestinationDetails(false);

    const selected = popularDestinations.find(d => d.name.toLowerCase() === destinationValue.toLowerCase());
    
    if (selected) {
      // If the popular destination is not in the options, add it.
      if (!cityOptions.some(o => o.value === selected.name)) {
        setCityOptions(prev => [{ value: selected.name, label: `${selected.name}, ${selected.country}` }, ...prev]);
      }

      setIsLoading(true);
      setSelectedDestination(selected);
      setTimeout(() => {
        setIsLoading(false);
        setShowDestinationDetails(true);
      }, 1000);
    } else {
      // This can be a new city from the API
      const cityFromOptions = cityOptions.find(o => o.value === destinationValue);
      const newCity: City = {
          id: destinationValue, // Temporary ID
          name: destinationValue,
          country: cityFromOptions ? cityFromOptions.label.split(', ')[1] : 'India', // Assume India if not found
          image: '/api/placeholder/300/200',
          description: t('an_exciting_city_to_explore'),
          // You might want to fetch these details from another API
          foodSpecialties: [t('local_delicacies')],
          culturalHighlights: [t('historical_sites')],
          landmarks: [t('famous_attractions')],
          activities: [t('sightseeing')],
          averageCost: 75,
      };
      setIsLoading(true);
      setSelectedDestination(newCity);
      setTimeout(() => {
          setIsLoading(false);
          setShowDestinationDetails(true);
        }, 1000);
    }
  };

  const handleNext = () => {
    if (!selectedCityValue || !departureCity || !selectedDestination) return;

    const locationInfo: LocationInfo = {
      destination: selectedCityValue,
      departureCity,
      travelers,
      selectedCity: selectedDestination
    };
    
    onNext(locationInfo);
  };

  const handleTravelerChange = (index: number, field: keyof Traveler, value: string | number) => {
    const newTravelers = [...travelers];
    (newTravelers[index] as any)[field] = value;
    setTravelers(newTravelers);
  };

  const addTraveler = () => {
    setTravelers([...travelers, { name: '', gender: 'male' }]);
  };

  const removeTraveler = (index: number) => {
    if (travelers.length > 1) {
      const newTravelers = travelers.filter((_, i) => i !== index);
      setTravelers(newTravelers);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('where_to_go')}</h2>
        <p className="text-muted-foreground">{t('choose_destination_and_let_ai_create_itinerary')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Destination Search */}
        <div className="space-y-2">
          <Label htmlFor="destination">{t('destinations')}</Label>
          <Combobox
            options={cityOptions}
            value={selectedCityValue}
            onChange={handleDestinationSelect}
            onInputChange={setDestinationSearch}
            placeholder={t('search_for_a_city')}
            searchPlaceholder={t('type_to_search_cities')}
            emptyMessage={isCityLoading ? t('loading_cities') : t('no_cities_found')}
          />
        </div>
        
        {/* Departure City */}
        <div className="space-y-2">
          <Label htmlFor="departure">{t('from_city')}</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Select value={departureCity} onValueChange={setDepartureCity}>
              <SelectTrigger className="w-full pl-9">
                <SelectValue placeholder={t('select_departure_city')} />
              </SelectTrigger>
              <SelectContent>
                {indianCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Travelers Dialog */}
        <div className="space-y-2">
          <Label>{t('travelers')}</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Users className="mr-2 h-4 w-4" />
                {t('traveler', {count: travelers.length})}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('traveler_details')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {travelers.map((traveler, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-center">
                    <Input 
                      placeholder={t('name')}
                      value={traveler.name} 
                      onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                      className="col-span-2"
                    />
                    <Input 
                      type="number" 
                      placeholder={t('age')}
                      value={traveler.age}
                      onChange={(e) => handleTravelerChange(index, 'age', parseInt(e.target.value) || undefined)}
                    />
                    <div className="flex items-center">
                      <Select 
                        value={traveler.gender} 
                        onValueChange={(value: 'male' | 'female' | 'other') => handleTravelerChange(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('gender')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t('male')}</SelectItem>
                          <SelectItem value="female">{t('female')}</SelectItem>
                          <SelectItem value="other">{t('other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {travelers.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeTraveler(index)} className="ml-1">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addTraveler}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('add_traveler')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Popular Destinations */}
      {!selectedCityValue && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">{t('popular_destinations_in_india')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="cursor-pointer hover:shadow-elevation transition-smooth group"
                onClick={() => handleDestinationSelect(destination.name)}
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
                    <span className="text-xs text-muted-foreground">{t('from')}</span>
                    <span className="font-semibold text-primary">₹{(destination.averageCost * 83).toLocaleString()}{t('per_day')}</span>
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
              <CardTitle>{t('gathering_destination_insights')}</CardTitle>
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
        <Card className="max-w-4xl mx-auto animate-in fade-in-50">
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
                    {t('food_specialties')}
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
                    {t('famous_landmarks')}
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
                    {t('cultural_highlights')}
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
                    {t('popular_activities')}
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
          disabled={!selectedCityValue || !departureCity || !selectedDestination}
          variant="travel" 
          size="lg"
          className="px-8"
        >
          {t('continue_to_budget_and_duration')}
        </Button>
      </div>

    </div>
  );
};
