'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Car, CheckCircle, Truck, ArrowRight, Clock, Shield, Euro, Users, Globe, FileText, Phone } from 'lucide-react';

const processSteps = [
  {
    phase: "Faza 1",
    title: "Consultare & Brief",
    description: "Înțelegem nevoile tale și creăm un profil personalizat",
    icon: Users,
    details: [
      "Discuție despre preferințe și buget",
      "Analiza cerințelor specifice",
      "Crearea unui brief personalizat"
    ],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100"
  },
  {
    phase: "Faza 2",
    title: "Căutare & Selecție",
    description: "Scanez licitațiile B2B și selectez cele mai potrivite opțiuni",
    icon: Search,
    details: [
      "Acces la 15+ platforme de licitații",
      "Filtrare după criteriile tale",
      "Selecția celor mai bune 3-5 opțiuni"
    ],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100"
  },
  {
    phase: "Faza 3",
    title: "Verificare & Analiză",
    description: "Analizez istoricul complet și verific starea tehnică",
    icon: Shield,
    details: [
      "Raport Carfax complet",
      "Test OBD și verificare VIN",
      "Analiza fotografiilor detaliate"
    ],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100"
  },
  {
    phase: "Faza 4",
    title: "Cotație & Negociere",
    description: "Îți ofer o cotație finală cu toate costurile incluse",
    icon: Euro,
    details: [
      "Preț final garantat",
      "Toate costurile transparente",
      "Negociere pentru cel mai bun preț"
    ],
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100"
  },
  {
    phase: "Faza 5",
    title: "Rezervare & Transport",
    description: "Organizez transportul asigurat și toate actele",
    icon: Truck,
    details: [
      "Rezervarea vehiculului",
      "Transport asigurat complet",
      "Organizarea documentelor"
    ],
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100"
  },
  {
    phase: "Faza 6",
    title: "Livrare & Suport",
    description: "Livrare la adresa ta și suport post-vânzare",
    icon: CheckCircle,
    details: [
      "Livrare la adresa specificată",
      "Asistență pentru înmatriculare",
      "Suport continuu post-vânzare"
    ],
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconBg: "bg-teal-100"
  }
];

const benefits = [
  {
    icon: Clock,
    title: "Rapid",
    description: "Oferte în 15-30 minute garantat"
  },
  {
    icon: Shield,
    title: "Sigur",
    description: "Verificare completă și transparentă"
  },
  {
    icon: Euro,
    title: "Eficient",
    description: "Economie de 15-30% garantată"
  },
  {
    icon: Globe,
    title: "Global",
    description: "Acces la licitații din 15+ țări"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">
            Procesul complet
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Cum funcționează AutoOrder
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Un proces transparent și eficient, proiectat să îți ofere controlul total 
            și încrederea că faci alegerea potrivită. De la prima discuție până la livrare.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                {/* Phase badge */}
                <div className="absolute -top-4 left-6 z-20">
                  <div className={`px-3 py-1 bg-gradient-to-r ${step.color} text-white rounded-full text-sm font-bold shadow-lg`}>
                    {step.phase}
                  </div>
                </div>

                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full ${step.bgColor}`}>
                  <CardContent className="pt-12 p-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-foreground" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    {/* Details */}
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Process Benefits */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
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
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Gata să începem?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Completează formularul și începe să economisești în 15-30 minute. 
              Fiecare pas este transparent și eficient.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
                <a href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
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
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Răspuns în 15-30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Proces transparent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
