// Mock data for the travel booking app

export interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  attractions: string[];
  averageCost: number;
  bestTimeToVisit: string;
  popularActivities: string[];
}

export interface Duration {
  id: string;
  days: number;
  title: string;
  description: string;
  activities: string[];
  minBudget: number;
}

export interface BudgetPlan {
  id: string;
  budget: number;
  title: string;
  description: string;
  includes: string[];
  accommodationType: string;
  transportType: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  location: string;
  reviews: number;
  description: string;
}

export interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  stops: number;
  aircraft: string;
}

export const mockCities: City[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    description: "The City of Light offers romance, culture, and incredible cuisine.",
    image: "/api/placeholder/400/300",
    attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Arc de Triomphe", "Champs-Élysées"],
    averageCost: 150,
    bestTimeToVisit: "April to June, September to October",
    popularActivities: ["Museum visits", "Seine river cruise", "Café culture", "Shopping", "Architecture tours"]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    description: "A fascinating blend of traditional culture and cutting-edge technology.",
    image: "/api/placeholder/400/300",
    attractions: ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing", "Meiji Shrine", "Tsukiji Fish Market"],
    averageCost: 180,
    bestTimeToVisit: "March to May, September to November",
    popularActivities: ["Temple visits", "Sushi experiences", "Shopping", "Technology tours", "Cherry blossom viewing"]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    description: "Tropical paradise with stunning beaches, rice terraces, and spiritual culture.",
    image: "/api/placeholder/400/300",
    attractions: ["Uluwatu Temple", "Rice Terraces of Jatiluwih", "Mount Batur", "Tanah Lot", "Ubud Monkey Forest"],
    averageCost: 80,
    bestTimeToVisit: "April to October",
    popularActivities: ["Beach relaxation", "Surfing", "Yoga retreats", "Temple visits", "Volcano hiking"]
  },
  {
    id: "newyork",
    name: "New York",
    country: "USA",
    description: "The city that never sleeps, offering world-class entertainment and dining.",
    image: "/api/placeholder/400/300",
    attractions: ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Brooklyn Bridge"],
    averageCost: 200,
    bestTimeToVisit: "April to June, September to November",
    popularActivities: ["Broadway shows", "Museum visits", "Shopping", "Food tours", "City skyline views"]
  }
];

export const mockDurations: Duration[] = [
  {
    id: "2days",
    days: 2,
    title: "Quick Getaway",
    description: "Perfect for a weekend escape with highlights.",
    activities: ["City highlights tour", "Local cuisine experience", "One major attraction"],
    minBudget: 300
  },
  {
    id: "5days",
    days: 5,
    title: "Classic Trip",
    description: "Ideal balance of exploration and relaxation.",
    activities: ["Multiple attractions", "Cultural experiences", "Day trips", "Shopping", "Local nightlife"],
    minBudget: 750
  },
  {
    id: "7days",
    days: 7,
    title: "Complete Experience",
    description: "Comprehensive exploration with leisure time.",
    activities: ["All major attractions", "Cultural immersion", "Multiple day trips", "Relaxation time", "Local experiences"],
    minBudget: 1000
  },
  {
    id: "14days",
    days: 14,
    title: "Extended Adventure",
    description: "Deep dive into the destination with nearby regions.",
    activities: ["Complete city exploration", "Regional tours", "Multiple accommodations", "Various experiences", "Local connections"],
    minBudget: 2000
  }
];

export const mockBudgetPlans: BudgetPlan[] = [
  {
    id: "budget500",
    budget: 500,
    title: "Economy Explorer",
    description: "Great value travel with essential experiences.",
    includes: ["Budget accommodation", "Local transport", "Street food", "Free attractions"],
    accommodationType: "Hostel/Budget hotel",
    transportType: "Public transport"
  },
  {
    id: "budget1000",
    budget: 1000,
    title: "Comfort Traveler",
    description: "Comfortable stays with popular attractions.",
    includes: ["3-star hotel", "Mix of transport", "Restaurant meals", "Paid attractions"],
    accommodationType: "3-star hotel",
    transportType: "Mix of public and private transport"
  },
  {
    id: "budget2000",
    budget: 2000,
    title: "Premium Experience",
    description: "Luxury accommodations with exclusive experiences.",
    includes: ["4-star hotel", "Private transport", "Fine dining", "Premium tours"],
    accommodationType: "4-star hotel",
    transportType: "Private car/taxi"
  },
  {
    id: "budget3000",
    budget: 3000,
    title: "Luxury Escape",
    description: "Ultimate luxury with personalized services.",
    includes: ["5-star hotel", "Premium transport", "Michelin dining", "VIP experiences"],
    accommodationType: "5-star resort",
    transportType: "Premium car service"
  }
];

export const mockHotels: Hotel[] = [
  {
    id: "hotel1",
    name: "Grand Palace Hotel",
    rating: 5,
    price: 250,
    image: "/api/placeholder/300/200",
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "WiFi", "Concierge"],
    location: "City Center",
    reviews: 1250,
    description: "Luxury hotel in the heart of the city with exceptional service."
  },
  {
    id: "hotel2",
    name: "Comfort Inn & Suites",
    rating: 4,
    price: 120,
    image: "/api/placeholder/300/200",
    amenities: ["Pool", "Gym", "Restaurant", "WiFi", "Parking"],
    location: "Downtown",
    reviews: 890,
    description: "Modern hotel with great amenities and convenient location."
  },
  {
    id: "hotel3",
    name: "Budget Stay Lodge",
    rating: 3,
    price: 65,
    image: "/api/placeholder/300/200",
    amenities: ["WiFi", "Breakfast", "Parking"],
    location: "Near Transport",
    reviews: 456,
    description: "Clean and affordable accommodation perfect for budget travelers."
  }
];

export const mockFlights: Flight[] = [
  {
    id: "flight1",
    airline: "Premium Airways",
    price: 450,
    duration: "8h 30m",
    departure: "14:30",
    arrival: "23:00",
    stops: 0,
    aircraft: "Boeing 787"
  },
  {
    id: "flight2",
    airline: "Sky Connect",
    price: 320,
    duration: "11h 45m",
    departure: "09:15",
    arrival: "21:00",
    stops: 1,
    aircraft: "Airbus A330"
  },
  {
    id: "flight3",
    airline: "Budget Air",
    price: 180,
    duration: "14h 20m",
    departure: "06:00",
    arrival: "20:20",
    stops: 2,
    aircraft: "Boeing 737"
  }
];