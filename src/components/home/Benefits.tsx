'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Euro, Shield, Search, Truck, ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: Euro,
    title: "Preț final garantat",
    description: "Știi exact costul total înainte să decizi. Fără surprize sau costuri ascunse.",
    features: ["Fără costuri ascunse", "Transparență totală", "Estimare scrisă"]
  },
  {
    icon: Shield,
    title: "Acces exclusiv dealer-only",
    description: "Acces direct la licitațiile B2B cu prețuri cu 15-30% mai bune decât piața publică.",
    features: ["Licitații exclusive", "Prețuri B2B", "Acces prioritar"]
  },
  {
    icon: Search,
    title: "Verificare completă istoric",
    description: "Analizăm istoricul complet, rapoartele de service și starea tehnică detaliată.",
    features: ["Raport Carfax", "Test OBD", "Verificare VIN"]
  },
  {
    icon: Truck,
    title: "Livrare organizată complet",
    description: "Transport asigurat, acte organizate și înmatriculare directă în România.",
    features: ["Transport asigurat", "Acte complete", "Înmatriculare RAR"]
  }
];

export function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">
            Avantaje concrete
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            De ce să alegi AutoOrder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Proces transparent și eficient, de la selecție până la livrare. 
            Fiecare pas este proiectat să îți ofere controlul total și încrederea că faci alegerea potrivită.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="pt-8 p-8">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                      {benefit.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {benefit.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Gata să începem?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Spune-ne modelul dorit, bugetul și preferințele. Revenim cu 3 opțiuni personalizate în 15-30 minute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  Completează brief-ul
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 h-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  Vorbește cu un consultant
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Fără obligații</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Răspuns în 15-30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Oferte personalizate</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
