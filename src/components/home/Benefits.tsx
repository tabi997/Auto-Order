'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldCheck, 
  PiggyBank, 
  Zap, 
  Globe, 
  GraduationCap, 
  Eye,
  ArrowRight,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';

const benefits = [
  {
    icon: ShieldCheck,
    titleKey: 'benefits.items.0.title',
    descriptionKey: 'benefits.items.0.description',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: PiggyBank,
    titleKey: 'benefits.items.1.title',
    descriptionKey: 'benefits.items.1.description',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: Zap,
    titleKey: 'benefits.items.2.title',
    descriptionKey: 'benefits.items.2.description',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    icon: Globe,
    titleKey: 'benefits.items.3.title',
    descriptionKey: 'benefits.items.3.description',
    color: 'text-purple-600',
    bgColor: 'bg-purple-950/20',
  },
  {
    icon: GraduationCap,
    titleKey: 'benefits.items.4.title',
    descriptionKey: 'benefits.items.4.description',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    icon: Eye,
    titleKey: 'benefits.items.5.title',
    descriptionKey: 'benefits.items.5.description',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
];

export function Benefits() {
  const { t } = useHomeTranslation();

  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('benefits.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('benefits.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm rounded-2xl">
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('benefits.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('benefits.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-6 py-3">
                <Link href="/contact?type=offer" aria-label="Completează brief-ul AutoOrder">
                  {t('benefits.cta.primary')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="px-6 py-3">
                <a href="tel:+40123456789" aria-label="Vorbește cu un consultant AutoOrder">
                  <Phone className="mr-2 h-4 w-4" />
                  {t('benefits.cta.secondary')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
