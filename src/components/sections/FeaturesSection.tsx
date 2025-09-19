import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, Hotel, Plane, Shield, Clock, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: MapPin,
      title: t('smart_destination_selection'),
      description: t('smart_destination_selection_desc'),
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: t('flexible_duration_planning'),
      description: t('flexible_duration_planning_desc'),
      color: "text-accent"
    },
    {
      icon: DollarSign,
      title: t('budget_optimized_planning'),
      description: t('budget_optimized_planning_desc'),
      color: "text-success"
    },
    {
      icon: Hotel,
      title: t('curated_accommodations'),
      description: t('curated_accommodations_desc'),
      color: "text-warning"
    },
    {
      icon: Plane,
      title: t('flight_comparison'),
      description: t('flight_comparison_desc'),
      color: "text-primary"
    },
    {
      icon: Shield,
      title: t('secure_booking'),
      description: t('secure_booking_desc'),
      color: "text-accent"
    },
    {
      icon: Clock,
      title: t('support_24_7'),
      description: t('support_24_7_desc'),
      color: "text-success"
    },
    {
      icon: Heart,
      title: t('personalized_experience'),
      description: t('personalized_experience_desc'),
      color: "text-warning"
    }
  ];

  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('features_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features_subtitle')}
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