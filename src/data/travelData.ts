// Mock data for the travel booking app

export interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  averageCost: number;
  bestTimeToVisit?: string;
  foodSpecialties: string[];
  culturalHighlights: string[];
  landmarks: string[];
  activities: string[];
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
  // Indian Cities
  {
    id: "goa",
    name: "Goa",
    country: "India",
    description: "Beautiful beaches, Portuguese heritage, and vibrant nightlife.",
    image: "/api/placeholder/400/300",
    landmarks: ["Baga Beach", "Old Goa Churches", "Dudhsagar Falls", "Calangute Beach", "Fort Aguada"],
    averageCost: 60,
    bestTimeToVisit: "November to March",
    activities: ["Beach activities", "Water sports", "Heritage tours", "Nightlife", "Local cuisine"],
    foodSpecialties: ['Goan Fish Curry', 'Bebinca', 'Feni', 'Pork Vindaloo'],
    culturalHighlights: ['Portuguese Architecture', 'Carnival Festival', 'Beach Culture', 'Catholic Churches'],
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India", 
    description: "God's Own Country with backwaters, hill stations, and spice plantations.",
    image: "/api/placeholder/400/300",
    landmarks: ["Alleppey Backwaters", "Munnar Hills", "Fort Kochi", "Periyar Wildlife Sanctuary", "Kovalam Beach"],
    averageCost: 50,
    bestTimeToVisit: "October to March",
    activities: ["Backwater cruises", "Ayurvedic treatments", "Wildlife viewing", "Tea plantation tours", "Cultural shows"],
    foodSpecialties: ['Appam with Stew', 'Karimeen Fish', 'Puttu', 'Kerala Sadya'],
    culturalHighlights: ['Kathakali Dance', 'Ayurveda Traditions', 'Coconut Culture', 'Spice Heritage'],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    country: "India",
    description: "Land of Kings with magnificent palaces, forts, and desert landscapes.",
    image: "/api/placeholder/400/300",
    landmarks: ["Amber Fort", "City Palace Udaipur", "Thar Desert", "Hawa Mahal", "Mehrangarh Fort"],
    averageCost: 55,
    bestTimeToVisit: "October to March",
    activities: ["Palace tours", "Desert safari", "Cultural performances", "Heritage walks", "Camel rides"],
    foodSpecialties: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Malpua'],
    culturalHighlights: ['Rajput Heritage', 'Folk Music & Dance', 'Royal Architecture', 'Desert Culture'],
  },
  {
    id: "himachal",
    name: "Himachal Pradesh", 
    country: "India",
    description: "Mountain paradise with snow-capped peaks, valleys, and adventure activities.",
    image: "/api/placeholder/400/300",
    landmarks: ["Manali", "Shimla", "Dharamshala", "Spiti Valley", "Rohtang Pass"],
    averageCost: 65,
    bestTimeToVisit: "March to June, September to November",
    activities: ["Trekking", "Paragliding", "Skiing", "Mountain biking", "Nature photography"],
    foodSpecialties: ['Chana Madra', 'Himachali Trout', 'Siddu', 'Aktori'],
    culturalHighlights: ['Mountain Culture', 'Buddhist Monasteries', 'Apple Orchards', 'Adventure Sports'],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    country: "India",
    description: "Dev Bhoomi with holy rivers, hill stations, and spiritual destinations.",
    image: "/api/placeholder/400/300", 
    landmarks: ["Rishikesh", "Haridwar", "Nainital", "Valley of Flowers", "Kedarnath"],
    averageCost: 45,
    bestTimeToVisit: "March to June, September to November",
    activities: ["River rafting", "Yoga retreats", "Pilgrimage tours", "Trekking", "Wildlife viewing"],
    foodSpecialties: ['Aloo ke Gutke', 'Kafuli', 'Bhang Ki Chutney', 'Garhwal ka Fannah'],
    culturalHighlights: ['Ganga Aarti', 'Char Dham Yatra', 'Kumaoni Holi', 'Nanda Devi Raj Jat'],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    country: "India",
    description: "Rich heritage with palaces, temples, and diverse landscapes from coast to hills.",
    image: "/api/placeholder/400/300",
    landmarks: ["Mysore Palace", "Hampi Ruins", "Coorg Hills", "Bangalore Gardens", "Gokarna Beach"],
    averageCost: 50,
    bestTimeToVisit: "October to March",
    activities: ["Palace tours", "Historical exploration", "Coffee plantation visits", "Beach relaxation", "City tours"],
    foodSpecialties: ['Bisi Bele Bath', 'Mysore Pak', 'Dosa', 'Ragi Mudde'],
    culturalHighlights: ['Mysuru Dasara', 'Hampi Utsav', 'Yakshagana', 'Kodava Culture'],
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
