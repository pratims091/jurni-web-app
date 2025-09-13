import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: MapPin,
    title: "Choose Your Destination",
    description: "Browse our curated list of amazing destinations or let us suggest the perfect place based on your interests and preferences.",
    details: ["100+ verified destinations", "Local expert insights", "Photo galleries & reviews"]
  },
  {
    step: 2,
    icon: Calendar,
    title: "Plan Your Duration",
    description: "Select the perfect trip length from weekend getaways to extended adventures, with activities optimized for each duration.",
    details: ["Flexible date options", "Activity recommendations", "Seasonal best practices"]
  },
  {
    step: 3,
    icon: DollarSign,
    title: "Set Your Budget",
    description: "Enter your budget and get personalized recommendations that maximize your experience while staying within your financial comfort zone.",
    details: ["Budget optimization", "Cost breakdown", "Value recommendations"]
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Book & Enjoy",
    description: "Complete your bookings for flights and accommodations, then get ready for an unforgettable travel experience.",
    details: ["Secure payment", "Instant confirmation", "24/7 support"]
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Planning your perfect trip is simple with our streamlined process. From destination selection to final booking, we guide you through every step.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.step} className="relative">
                <Card className="h-full group hover:shadow-elevation transition-smooth">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit relative">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <CardDescription className="leading-relaxed">
                      {step.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Planning?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied travelers who have discovered their perfect destinations with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Instant confirmation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};