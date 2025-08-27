'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Car, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="relative container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('hero.title')}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/contact?type=offer">
                {t('hero.cta.offer')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/stock">
                {t('hero.cta.opportunities')}
                <Car className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-muted-foreground">
                {t('hero.stats.vehicles')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-muted-foreground">
                {t('hero.stats.countries')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                95%
              </div>
              <div className="text-muted-foreground">
                {t('hero.stats.satisfaction')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <Car className="h-32 w-32 text-primary" />
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10">
        <TrendingUp className="h-24 w-24 text-primary" />
      </div>
    </section>
  );
}
