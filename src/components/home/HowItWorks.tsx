'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Gavel, Truck, Zap, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n';

const steps = [
  {
    icon: ClipboardList,
    titleKey: 'howItWorks.step1.title',
    descriptionKey: 'howItWorks.step1.description',
    color: 'bg-blue-500',
    details: ['howItWorks.step1.detail1', 'howItWorks.step1.detail2', 'howItWorks.step1.detail3'],
  },
  {
    icon: Gavel,
    titleKey: 'howItWorks.step2.title',
    descriptionKey: 'howItWorks.step2.description',
    color: 'bg-green-500',
    details: ['howItWorks.step2.detail1', 'howItWorks.step2.detail2', 'howItWorks.step2.detail3'],
  },
  {
    icon: Zap,
    titleKey: 'howItWorks.step3.title',
    descriptionKey: 'howItWorks.step3.description',
    color: 'bg-purple-500',
    details: ['howItWorks.step3.detail1', 'howItWorks.step3.detail2', 'howItWorks.step3.detail3'],
  },
  {
    icon: Truck,
    titleKey: 'howItWorks.step4.title',
    descriptionKey: 'howItWorks.step4.description',
    color: 'bg-orange-500',
    details: ['howItWorks.step4.detail1', 'howItWorks.step4.detail2', 'howItWorks.step4.detail3'],
  },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('howItWorks.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mb-3">
                      <Badge variant="outline" className="text-sm">
                        {t('howItWorks.step')} {index + 1}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold">
                      {t(step.titleKey)}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {t(step.descriptionKey)}
                    </p>
                    
                    {/* Step details */}
                    <div className="space-y-2 text-left">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2 text-sm">
                          <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {t(detail)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-20 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('howItWorks.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('howItWorks.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="default" className="text-lg px-6 py-3">
                {t('howItWorks.cta.primary')}
              </Badge>
              <Badge variant="outline" className="text-lg px-6 py-3">
                {t('howItWorks.cta.secondary')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
