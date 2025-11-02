import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BudgetTracker } from "./BudgetTracker";
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
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// ... (interface definitions remain the same) ...
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
  category: string;
  highlights: string[];
  distanceFromCenter: string;
}

interface HotelsData {
  selectedHotel?: Hotel;
  skipHotel: boolean;
  totalCost: number;
  hotels?: Hotel[];
}

interface HotelsStepProps {
  onNext: (data: {
    selectedHotel: Hotel;
    skipHotel: boolean;
    totalCost: number;
    flights: any[];
  }) => void;
  onBack: () => void;
  destination: string;
  departure: string;
  budget: number;
  currency: string;
  spent: number;
  duration: number;
  travelers: number;
  hotels: Hotel[];
  initialData?: Partial<HotelsData>;
  startDate: Date;
  endDate: Date;
  isFlexibleBudget?: boolean;
}


const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  "Swimming Pool": Waves,
  Breakfast: Coffee,
  AC: Snowflake,
  Parking: Car,
  Restaurant: UtensilsCrossed,
  Spa: Waves,
  Gym: Dumbbell,
  Security: Shield,
  "Room Service": UtensilsCrossed,
  Concierge: Shield,
  Bar: Coffee,
};

const categoryColors: { [key: string]: string } = {
  business: "bg-blue-100 text-blue-800 border-blue-200",
  budget: "bg-green-100 text-green-800 border-green-200",
  "mid-range": "bg-yellow-100 text-yellow-800 border-yellow-200",
  luxury: "bg-purple-100 text-purple-800 border-purple-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export const EnhancedHotelsStep = ({
  onNext,
  onBack,
  destination,
  departure,
  budget,
  currency,
  spent = 0,
  duration,
  travelers,
  hotels,
  initialData,
  startDate,
  endDate,
  isFlexibleBudget = false,
}: HotelsStepProps) => {
  const { t } = useTranslation();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(
    initialData?.selectedHotel || null
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [isFetchingFlights, setIsFetchingFlights] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  const hotelsWithTotalPrice = (hotels || []).map((hotel) => ({
    ...hotel,
    totalPrice: hotel.pricePerNight * duration,
  }));

  const hotelCost = selectedHotel
    ? hotelsWithTotalPrice.find((h) => h.id === selectedHotel.id)?.totalPrice ||
      0
    : 0;
  const totalSpent = spent + hotelCost;

  const filteredHotels =
    filterCategory === "all"
      ? hotelsWithTotalPrice
      : hotelsWithTotalPrice.filter(
          (hotel) =>
            hotel.category.toLowerCase() === filterCategory.toLowerCase()
        );

  const handleHotelSelect = (hotel: Hotel) => {
    setIsSelecting(true);
    setTimeout(() => {
      setSelectedHotel(hotel);
      setIsSelecting(false);
    }, 500);
  };

  const handleNext = async () => {
    if (!selectedHotel) return;

    setIsFetchingFlights(true);

    const travel_params = {
      destination,
      departure,
      budget: budget.toString(),
      currency,
      totalTravellers: travelers.toString(),
      durationDays: duration.toString(),
      startDate: format(startDate, "yyyy-MM-dd"),
      returnDate: format(endDate, "yyyy-MM-dd"),
      travelClass: "economy", // default
      accommodationType: "hotel", // default
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/travel-planner/chat-structured`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query_type: "flights",
            session_id: localStorage.getItem("session_id"),
            user_id: localStorage.getItem("user_id"),
            travel_params,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const flightsResponse = await response.json();

      onNext({
        selectedHotel,
        skipHotel: false,
        totalCost: hotelCost,
        flights: flightsResponse.data.data,
      });
    } catch (error) {
      console.error("Error fetching flights:", error);
      toast({
        title: t('error'),
        description: t('error_fetching_flights'),
      });
    } finally {
      setIsFetchingFlights(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set((hotels || []).map((h) => h.category.toLowerCase()))),
  ];

  useEffect(() => {
    if (initialData?.selectedHotel) {
      setSelectedHotel(initialData.selectedHotel);
    }
  }, [initialData]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('choose_your_perfect_stay')}</h2>
        <p className="text-muted-foreground">
          {t('find_ideal_accommodation', { duration, destination })}
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">{t('destination')}</p>
              <p className="font-semibold">{destination}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('duration')}</p>
              <p className="font-semibold">{duration} {t('nights')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('travelers')}</p>
              <p className="font-semibold">{travelers} {t('people')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('budget')}</p>
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
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {t(`${category.toLowerCase()}_category`, { defaultValue: category.charAt(0).toUpperCase() + category.slice(1) })}
          </Button>
        ))}
      </div>

      {isSelecting && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              <CardTitle>{t('finalizing_hotel_choice')}</CardTitle>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => {
          const hotelCategory = hotel.category.toLowerCase();
          const categoryClass =
            categoryColors[hotelCategory] || categoryColors.default;

          return (
            <Card
              key={hotel.id}
              className={`cursor-pointer transition-smooth hover:shadow-elevation ${
                selectedHotel?.id === hotel.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleHotelSelect(hotel)}
            >
              <div className="relative h-48 bg-gradient-subtle rounded-t-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-white" />
                <Badge className={`absolute top-3 left-3 ${categoryClass}`}>
                  {t(`${hotel.category.toLowerCase()}_category`, { defaultValue: hotel.category })}
                </Badge>
              </div>

              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">
                      {hotel.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {hotel.rating}
                      </span>
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
                  <h4 className="font-medium text-sm">{t('amenities')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const IconComponent = amenityIcons[amenity] || Shield;
                      return (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
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
                  <h4 className="font-medium text-sm">{t('highlights')}</h4>
                  <div className="space-y-1">
                    {hotel.highlights.slice(0, 2).map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('per_night')}
                    </span>
                    <span className="font-semibold">
                      ₹{hotel.pricePerNight.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t('total_duration_nights', { duration })}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₹{hotel.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hotel.reviews} {t('reviews')}
                  </p>
                </div>

                {selectedHotel?.id === hotel.id && (
                  <Badge className="w-full justify-center bg-green-500 text-white">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('selected_hotel')}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedHotel && !isSelecting && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              {t('selected_hotel_name', { hotelName: selectedHotel.name })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('location')}</p>
                <p className="font-medium">{selectedHotel.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('rating')}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedHotel.rating}/5</span>
                  <span className="text-sm text-muted-foreground">
                    ({selectedHotel.reviews} {t('reviews')})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('total_cost')}</p>
                <p className="text-xl font-bold text-primary">
                  ₹{hotelCost.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          {t('back_to_day_planner')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedHotel || isFetchingFlights}
          variant="travel"
        >
          {isFetchingFlights && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t('continue_to_flights')}
        </Button>
      </div>
    </div>
  );
};