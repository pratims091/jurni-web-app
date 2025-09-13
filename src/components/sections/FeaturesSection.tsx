import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, Hotel, Plane, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: "Smart Destination Selection",
    description: "Discover perfect destinations based on your preferences, budget, and travel style with our intelligent recommendation system.",
    color: "text-primary"
  },
  {
    icon: Calendar,
    title: "Flexible Duration Planning",
    description: "Choose from quick getaways to extended adventures. Each duration comes with optimized activity suggestions.",
    color: "text-accent"
  },
  {
    icon: DollarSign,
    title: "Budget-Optimized Planning",
    description: "Get personalized travel plans that maximize your experience within your budget, from economy to luxury options.",
    color: "text-success"
  },
  {
    icon: Hotel,
    title: "Curated Accommodations",
    description: "Choose from a wide range of verified hotels and stays, filtered by your preferences and budget requirements.",
    color: "text-warning"
  },
  {
    icon: Plane,
    title: "Flight Comparison",
    description: "Compare flights from multiple airlines to find the best deals and most convenient travel options for your trip.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your bookings are protected with industry-standard security measures and comprehensive travel insurance options.",
    color: "text-accent"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get assistance whenever you need it with our round-the-clock customer support team and travel experts.",
    color: "text-success"
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Every trip is tailored to your unique preferences, creating unforgettable experiences that match your travel dreams.",
    color: "text-warning"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose Our Travel Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine cutting-edge technology with travel expertise to deliver exceptional journey planning experiences that exceed your expectations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-elevation transition-smooth cursor-pointer border-0 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/20 w-fit group-hover:scale-110 transition-transform">
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};