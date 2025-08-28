'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ai un model în minte?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Completează formularul și primești oferte personalizate în 15-30 minute. 
            Fără obligații, doar informații utile.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link href="#lead-quick">
                Primește cotație în 60s
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/stock">
                Vezi stocul disponibil
                <Car className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Răspuns în 15-30 min</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Fără obligații</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Car className="h-5 w-5" />
              <span className="text-sm">Oferte personalizate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
