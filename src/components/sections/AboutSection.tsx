import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Award, Heart, TrendingUp, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: "50K+", label: t('happy_travelers') },
    { icon: Globe, value: "100+", label: t('destinations') },
    { icon: Award, value: "4.9/5", label: t('customer_rating') },
    { icon: TrendingUp, value: "95%", label: t('satisfaction_rate') }
  ];

  const values = [
    {
      icon: Heart,
      title: t('passion_for_travel'),
      description: t('passion_for_travel_desc')
    },
    {
      icon: Shield,
      title: t('trust_security'),
      description: t('trust_security_desc')
    },
    {
      icon: Users,
      title: t('customer_first'),
      description: t('customer_first_desc')
    },
    {
      icon: Globe,
      title: t('global_reach'),
      description: t('global_reach_desc')
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about_our_journey_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about_our_journey_subtitle')}
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
              <Badge className="mb-4">{t('our_story')}</Badge>
              <h3 className="text-3xl font-bold mb-4">
                {t('born_from_love_of_exploration')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('our_story_p1')}
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('our_story_p2')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">{t('ai_powered_planning')}</Badge>
              <Badge variant="secondary">{t('expert_curated')}</Badge>
              <Badge variant="secondary">{t('budget_optimized')}</Badge>
              <Badge variant="secondary">{t('support_24_7')}</Badge>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-hero rounded-2xl flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Globe className="w-24 h-24 mx-auto mb-6 opacity-80" />
                <h4 className="text-2xl font-bold mb-4">{t('connecting_worlds')}</h4>
                <p className="opacity-90">
                  {t('connecting_worlds_subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t('our_values')}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('our_values_subtitle')}
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
            <h3 className="text-3xl font-bold mb-6">{t('our_mission')}</h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('our_mission_desc')}
            </p>
            <div className="mt-8 flex justify-center">
              <Badge className="px-6 py-2 text-base">
                {t('making_dreams_accessible')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};