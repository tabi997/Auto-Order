'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Euro, Shield, Search, Truck } from 'lucide-react';

const benefits = [
  {
    icon: Euro,
    title: "Preț final garantat",
    description: "Știi exact costul total înainte să decizi. Fără surprize sau costuri ascunse."
  },
  {
    icon: Shield,
    title: "Acces exclusiv dealer-only",
    description: "Acces direct la licitațiile B2B cu prețuri cu 15-30% mai bune decât piața publică."
  },
  {
    icon: Search,
    title: "Verificare completă istoric",
    description: "Analizăm istoricul complet, rapoartele de service și starea tehnică detaliată."
  },
  {
    icon: Truck,
    title: "Livrare organizată complet",
    description: "Transport asigurat, acte organizate și înmatriculare directă în România."
  }
];

export function Benefits() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            De ce să alegi AutoOrder
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Avantaje concrete, nu promisiuni
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proces transparent și eficient, de la selecție până la livrare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-muted/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Gata să începem?
            </h3>
            <p className="text-muted-foreground mb-6">
              Spune-ne modelul dorit, bugetul și preferințele. Revenim cu 3 opțiuni personalizate în 15-30 minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#lead-quick"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Completează brief-ul
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Vorbește cu un consultant
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
