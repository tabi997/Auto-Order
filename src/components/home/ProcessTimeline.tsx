'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Car, CheckCircle, Truck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Selectezi modelul",
    description: "Ne spui marca, modelul, bugetul și preferințele tale"
  },
  {
    icon: Car,
    title: "Găsim mașini în Openlane",
    description: "Căutăm în licitațiile B2B și selectăm cele mai potrivite opțiuni"
  },
  {
    icon: CheckCircle,
    title: "Verificăm & dăm cost total",
    description: "Analizăm istoricul, verificăm starea și calculăm costul final"
  },
  {
    icon: Truck,
    title: "Livrare + acte în România",
    description: "Organizăm transportul și înmatricularea în România"
  }
];

export function ProcessTimeline() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Cum funcționează
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Proces în 4 pași simpli
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De la cererea ta până la livrarea mașinii, totul este transparent și eficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline connector on desktop */}
        <div className="hidden lg:block relative mt-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-0.5 h-8 bg-primary transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-primary transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-3/4 w-0.5 h-8 bg-primary transform -translate-y-1/2"></div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Gata să începem? Completează formularul de mai sus și primești oferte în 15-30 minute.
          </p>
        </div>
      </div>
    </section>
  );
}
