'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Euro, Car, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';

const successStories = [
  {
    id: 1,
    customer: "Maria D.",
    location: "București",
    vehicle: "BMW X3 2019",
    beforePrice: 32000,
    afterPrice: 24000,
    savings: 8000,
    savingsPercent: 25,
    timeToDelivery: "18 zile",
    rating: 5,
    story: "Am economisit 8.000€ pe mașina visurilor mele! AutoOrder mi-a găsit exact ce voiam în licitațiile B2B, cu verificare completă istoric și livrare organizată. Procesul a fost transparent de la început până la final.",
    features: ["Verificare completă istoric", "Livrare organizată", "Suport post-vânzare"]
  },
  {
    id: 2,
    customer: "Alexandru M.",
    location: "Cluj-Napoca",
    vehicle: "Audi A4 2020",
    beforePrice: 28000,
    afterPrice: 21000,
    savings: 7000,
    savingsPercent: 25,
    timeToDelivery: "15 zile",
    rating: 5,
    story: "Excelent serviciu! Am primit oferta în 20 de minute și am economisit 7.000€ față de piața locală. Mașina a fost verificată complet și livrată la adresa mea.",
    features: ["Răspuns rapid", "Verificare completă", "Livrare la domiciliu"]
  },
  {
    id: 3,
    customer: "Elena R.",
    location: "Timișoara",
    vehicle: "VW Golf 2021",
    beforePrice: 22000,
    afterPrice: 16500,
    savings: 5500,
    savingsPercent: 25,
    timeToDelivery: "21 zile",
    rating: 5,
    story: "Recomand cu încredere! Am economisit 5.500€ și am primit o mașină în stare excelentă. Echipa a fost foarte profesională și transparentă.",
    features: ["Preț transparent", "Calitate garantată", "Proces simplu"]
  }
];

const stats = [
  {
    icon: Euro,
    value: "25%",
    label: "Economie medie",
    description: "Față de piața locală"
  },
  {
    icon: Clock,
    value: "15-30",
    label: "Minute răspuns",
    description: "Garantat"
  },
  {
    icon: Car,
    value: "750+",
    label: "Vehicule livrate",
    description: "În ultimul an"
  },
  {
    icon: Users,
    value: "500+",
    label: "Clienți mulțumiți",
    description: "Rating 4.9/5"
  }
];

export function SuccessStories() {
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
            Cazuri de succes
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Rezultatele vorbesc de la sine
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Iată cum clienții noștri economisesc în medie 25% pe vehiculele dorite, 
            cu verificare completă și livrare organizată.
          </p>
        </motion.div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{story.customer}</h3>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-foreground mb-2">{story.vehicle}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Livrare în:</span>
                      <span className="font-medium text-foreground">{story.timeToDelivery}</span>
                    </div>
                  </div>

                  {/* Price Comparison */}
                  <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-4 mb-4 border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Preț piața locală:</span>
                      <span className="text-lg font-bold text-red-600 line-through">
                        {story.beforePrice.toLocaleString('ro-RO')}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preț AutoOrder:</span>
                      <span className="text-xl font-bold text-green-600">
                        {story.afterPrice.toLocaleString('ro-RO')}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
                      <span className="text-sm font-medium text-foreground">Economie:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {story.savings.toLocaleString('ro-RO')}€
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          ({story.savingsPercent}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    "{story.story}"
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {story.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Vrei să economisești și tu?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Completează formularul și începe să economisești în 15-30 minute. 
              Fiecare client economisește în medie 25% față de piața locală.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  Completează formularul
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 h-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
              >
                <a href="/testimonials">
                  Vezi toate recenziile
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">500+ clienți mulțumiți</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-medium">25% economie medie</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Răspuns în 15-30 min</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
