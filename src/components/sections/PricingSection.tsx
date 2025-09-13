import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Crown, Sparkles } from 'lucide-react';

const pricingTiers = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for planning your first adventure",
    icon: Sparkles,
    popular: false,
    features: [
      "Browse all destinations",
      "Basic trip planning",
      "Budget calculator",
      "Email support",
      "Up to 2 saved trips",
      "Standard recommendations"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    name: "Adventurer",
    price: "$9.99/month",
    description: "For frequent travelers who want more",
    icon: Star,
    popular: true,
    features: [
      "Everything in Explorer",
      "Unlimited saved trips",
      "Priority customer support",
      "Advanced filtering options",
      "Price alerts & notifications",
      "Exclusive deals & discounts",
      "Detailed itinerary planning"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "travel" as const
  },
  {
    name: "Professional",
    price: "$29.99/month",
    description: "For travel professionals and agencies",
    icon: Crown,
    popular: false,
    features: [
      "Everything in Adventurer",
      "Multi-client management",
      "White-label solutions",
      "API access",
      "Analytics & reporting",
      "Dedicated account manager",
      "Custom integrations",
      "Bulk booking discounts"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary" as const
  }
];

export const PricingSection = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Travel Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're planning your first trip or managing travel for clients, we have the perfect plan to match your needs and budget.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={index} 
                className={`
                  relative group hover:shadow-elevation transition-smooth
                  ${tier.popular ? 'border-primary shadow-card scale-105' : 'border-border'}
                `}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="py-4">
                    <div className="text-4xl font-bold text-primary">{tier.price}</div>
                    {tier.price !== "Free" && (
                      <div className="text-sm text-muted-foreground">per month, billed annually</div>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={tier.buttonVariant} 
                    className="w-full"
                    size="lg"
                  >
                    {tier.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">All Plans Include</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <CheckCircle className="w-6 h-6 text-success mx-auto" />
                <h4 className="font-semibold">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">
                  Bank-level security for all transactions
                </p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-6 h-6 text-success mx-auto" />
                <h4 className="font-semibold">Mobile App</h4>
                <p className="text-sm text-muted-foreground">
                  Access your trips anywhere, anytime
                </p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-6 h-6 text-success mx-auto" />
                <h4 className="font-semibold">Trip Insurance</h4>
                <p className="text-sm text-muted-foreground">
                  Optional coverage for peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};