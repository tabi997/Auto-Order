'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Globe, 
  Users, 
  Zap,
  CheckCircle 
} from 'lucide-react';
import { useTranslation } from '@/i18n';

const benefits = [
  {
    icon: Shield,
    titleKey: 'homeBenefits.security.title',
    descriptionKey: 'homeBenefits.security.description',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    features: ['homeBenefits.security.feature1', 'homeBenefits.security.feature2', 'homeBenefits.security.feature3'],
  },
  {
    icon: TrendingUp,
    titleKey: 'homeBenefits.savings.title',
    descriptionKey: 'homeBenefits.savings.description',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    features: ['homeBenefits.savings.feature1', 'homeBenefits.savings.feature2', 'homeBenefits.savings.feature3'],
  },
  {
    icon: Clock,
    titleKey: 'homeBenefits.speed.title',
    descriptionKey: 'homeBenefits.speed.description',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    features: ['homeBenefits.speed.feature1', 'homeBenefits.speed.feature2', 'homeBenefits.speed.feature3'],
  },
  {
    icon: Globe,
    titleKey: 'homeBenefits.network.title',
    descriptionKey: 'homeBenefits.network.description',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    features: ['homeBenefits.network.feature1', 'homeBenefits.network.feature2', 'homeBenefits.network.feature3'],
  },
  {
    icon: Users,
    titleKey: 'homeBenefits.expertise.title',
    descriptionKey: 'homeBenefits.expertise.description',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    features: ['homeBenefits.expertise.feature1', 'homeBenefits.expertise.feature2', 'homeBenefits.expertise.feature3'],
  },
  {
    icon: Zap,
    titleKey: 'homeBenefits.transparency.title',
    descriptionKey: 'homeBenefits.transparency.description',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    features: ['homeBenefits.transparency.feature1', 'homeBenefits.transparency.feature2', 'homeBenefits.transparency.feature3'],
  },
];

export function Benefits() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('homeBenefits.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('homeBenefits.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('homeBenefits.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {t(benefit.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t(benefit.descriptionKey)}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t(feature)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('homeBenefits.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('homeBenefits.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="default" className="text-lg px-6 py-3">
                {t('homeBenefits.cta.primary')}
              </Badge>
              <Badge variant="outline" className="text-lg px-6 py-3">
                {t('homeBenefits.cta.secondary')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
