'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Shield, Clock, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';

export function Hero() {
  const { t } = useHomeTranslation();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="relative container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Mașina ta, adusă la comandă din licitații B2B (Openlane)
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            Cost total final înainte de ofertă, verificare istoric, livrare rapidă, totul pentru un comision AutoOrder.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="#lead-quick" aria-label="Cere ofertă în 60s">
                Cere ofertă în 60s
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/stock" aria-label="Vezi stocul disponibil">
                Vezi stocul disponibil
                <Car className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Trust row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">Acces licitații B2B</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">Preț final garantat</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">Verificare istoric</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">Livrare rapidă</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <Car className="h-32 w-32 text-primary" />
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10">
        <Clock className="h-24 w-24 text-primary" />
      </div>
    </section>
  );
}
