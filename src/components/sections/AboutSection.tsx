import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Award, Heart, TrendingUp, Shield } from 'lucide-react';

const stats = [
  { icon: Users, value: "50K+", label: "Happy Travelers" },
  { icon: Globe, value: "100+", label: "Destinations" },
  { icon: Award, value: "4.9/5", label: "Customer Rating" },
  { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" }
];

const values = [
  {
    icon: Heart,
    title: "Passion for Travel",
    description: "We believe that travel transforms lives, creates memories, and connects people across cultures and continents."
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Your safety and security are our top priorities. We maintain the highest standards in data protection and booking security."
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Every decision we make is centered around enhancing your travel experience and exceeding your expectations."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "From local hidden gems to world-famous destinations, we help you discover the perfect places for your unique journey."
  }
];

export const AboutSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About Our Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded by passionate travelers, we're on a mission to make dream trips accessible to everyone through intelligent planning and personalized experiences.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center group hover:shadow-card transition-smooth">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">Our Story</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Born from a Love of Exploration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                What started as a simple idea between travel enthusiasts has grown into a comprehensive platform that serves thousands of travelers worldwide. We noticed that planning the perfect trip was often overwhelming, time-consuming, and expensive.
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              That's why we created an intelligent travel planning system that takes the complexity out of trip planning while ensuring you get the best value for your money. Our platform combines cutting-edge technology with real travel expertise to deliver personalized experiences that match your unique preferences and budget.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">AI-Powered Planning</Badge>
              <Badge variant="secondary">Expert Curated</Badge>
              <Badge variant="secondary">Budget Optimized</Badge>
              <Badge variant="secondary">24/7 Support</Badge>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-hero rounded-2xl flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Globe className="w-24 h-24 mx-auto mb-6 opacity-80" />
                <h4 className="text-2xl font-bold mb-4">Connecting Worlds</h4>
                <p className="opacity-90">
                  Every journey starts with a single step. Let us help you take yours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Our Values</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do and shape how we serve our community of travelers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="group hover:shadow-elevation transition-smooth">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-20">
          <div className="bg-gradient-card p-12 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To democratize travel by making it easier, more affordable, and more accessible for everyone to explore the world and create lasting memories, regardless of their experience level or budget constraints.
            </p>
            <div className="mt-8 flex justify-center">
              <Badge className="px-6 py-2 text-base">
                Making Dreams Accessible Since 2024
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};