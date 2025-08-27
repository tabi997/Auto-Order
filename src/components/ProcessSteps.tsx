'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Gavel, Truck, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';

const steps = [
  {
    icon: ClipboardList,
    titleKey: 'process.steps.0.title',
    descriptionKey: 'process.steps.0.description',
    color: 'bg-blue-500',
  },
  {
    icon: Gavel,
    titleKey: 'process.steps.1.title',
    descriptionKey: 'process.steps.1.description',
    color: 'bg-green-500',
  },
  {
    icon: Zap,
    titleKey: 'process.steps.2.title',
    descriptionKey: 'process.steps.2.description',
    color: 'bg-purple-500',
  },
  {
    icon: Truck,
    titleKey: 'process.steps.3.title',
    descriptionKey: 'process.steps.3.description',
    color: 'bg-orange-500',
  },
];

export function ProcessSteps() {
  const { t } = useHomeTranslation();

  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('process.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('process.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative group hover:shadow-md transition-all duration-300 rounded-2xl shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <Badge variant="outline" className="text-sm">
                      Pasul {index + 1}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {t(step.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>
                </CardContent>
                
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border">
            <p className="text-lg text-muted-foreground mb-6">
              {t('process.cta.text')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-6 py-3">
                <Link href="/contact?type=offer" aria-label="Vreau ofertă personalizată AutoOrder">
                  {t('process.cta.text')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Badge variant="outline" className="text-lg px-6 py-3">
                {t('process.cta.badge')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
