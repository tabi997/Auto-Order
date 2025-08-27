'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowRight, TrendingUp, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export function EstimatorCallout() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('estimatorCallout.title')}
                </CardTitle>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('estimatorCallout.subtitle')}
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {t('estimatorCallout.feature1.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('estimatorCallout.feature1.description')}
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {t('estimatorCallout.feature2.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('estimatorCallout.feature2.description')}
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {t('estimatorCallout.feature3.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('estimatorCallout.feature3.description')}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center space-y-6">
                  <div className="bg-muted/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('estimatorCallout.cta.title')}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t('estimatorCallout.cta.description')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link href="/contact?type=offer">
                          {t('estimatorCallout.cta.primaryButton')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                        <Link href="/stock">
                          {t('estimatorCallout.cta.secondaryButton')}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>{t('estimatorCallout.trust1')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>{t('estimatorCallout.trust2')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>{t('estimatorCallout.trust3')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
