'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Globe, 
  Users, 
  Zap 
} from 'lucide-react';
import { useTranslation } from '@/i18n';

const benefits = [
  {
    icon: Shield,
    titleKey: 'benefits.security.title',
    descriptionKey: 'benefits.security.description',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: TrendingUp,
    titleKey: 'benefits.savings.title',
    descriptionKey: 'benefits.savings.description',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: Clock,
    titleKey: 'benefits.speed.title',
    descriptionKey: 'benefits.speed.description',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    icon: Globe,
    titleKey: 'benefits.network.title',
    descriptionKey: 'benefits.network.description',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: Users,
    titleKey: 'benefits.expertise.title',
    descriptionKey: 'benefits.expertise.description',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    icon: Zap,
    titleKey: 'benefits.transparency.title',
    descriptionKey: 'benefits.transparency.description',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
];

export function Features() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('benefits.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('benefits.subtitle')}
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
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(benefit.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-20 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('benefits.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('benefits.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="default" className="text-lg px-6 py-3">
                {t('benefits.cta.primary')}
              </Badge>
              <Badge variant="outline" className="text-lg px-6 py-3">
                {t('benefits.cta.secondary')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
