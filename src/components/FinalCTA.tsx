'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('finalCta.title')}
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {t('finalCta.subtitle')}
          </p>
          
          {/* Benefits list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-muted-foreground">{t('finalCta.benefit1')}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="text-muted-foreground">{t('finalCta.benefit2')}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Car className="h-6 w-6 text-purple-500" />
              <span className="text-muted-foreground">{t('finalCta.benefit3')}</span>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/contact?type=offer">
                {t('finalCta.primaryCta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/stock">
                {t('finalCta.secondaryCta')}
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('finalCta.trust1')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('finalCta.trust2')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('finalCta.trust3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
