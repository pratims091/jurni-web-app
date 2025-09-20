import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      icon: MapPin,
      title: t('step1_title'),
      description: t('step1_desc'),
      details: [t('step1_detail1'), t('step1_detail2'), t('step1_detail3')]
    },
    {
      step: 2,
      icon: Calendar,
      title: t('step2_title'),
      description: t('step2_desc'),
      details: [t('step2_detail1'), t('step2_detail2'), t('step2_detail3')]
    },
    {
      step: 3,
      icon: DollarSign,
      title: t('step3_title'),
      description: t('step3_desc'),
      details: [t('step3_detail1'), t('step3_detail2'), t('step3_detail3')]
    },
    {
      step: 4,
      icon: CheckCircle,
      title: t('step4_title'),
      description: t('step4_desc'),
      details: [t('step4_detail1'), t('step4_detail2'), t('step4_detail3')]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('how_it_works_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('how_it_works_subtitle')}
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
            <h3 className="text-2xl font-bold mb-4">{t('cta_title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('cta_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                {t('no_hidden_fees')}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                {t('instant_confirmation')}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                {t('customer_support_24_7')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};