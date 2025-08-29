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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    color: "from-slate-600 to-slate-700",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100"
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
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-slate-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-slate-100/50 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-8 px-6 py-3 text-sm font-medium border-slate-200 text-slate-600 bg-white/80 backdrop-blur-sm">
            Procesul complet
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Cum funcționează AutoOrder
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Un proces transparent și eficient, proiectat să îți ofere controlul total 
            și încrederea că faci alegerea potrivită. De la prima discuție până la livrare.
          </p>
        </motion.div>

        {/* Process Steps - Clean and elegant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-32">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
                whileHover={{ y: -8 }}
              >
                {/* Phase badge */}
                <div className="absolute -top-4 left-6 z-20">
                  <div className={`px-4 py-2 bg-gradient-to-r ${step.color} text-white rounded-full text-sm font-medium shadow-sm`}>
                    {step.phase}
                  </div>
                </div>

                {/* Enhanced mobile touch targets */}
                <Card className={`border-0 shadow-sm hover:shadow-lg transition-all duration-500 h-full ${step.bgColor} cursor-pointer active:scale-95 border border-slate-100`}>
                  <CardContent className="pt-12 p-6">
                    {/* Enhanced icon with better mobile sizing */}
                    <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-sm border border-slate-200`}>
                      <IconComponent className="h-8 w-8 text-slate-600" />
                    </div>

                    {/* Better mobile typography */}
                    <h3 className="text-xl font-medium mb-4 text-slate-900 text-center lg:text-left">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-center lg:text-left text-base font-light">
                      {step.description}
                    </p>
                    
                    {/* Details */}
                    <div className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                          <span className="text-slate-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Process Benefits - Minimal and clean */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium mb-3 text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm font-light">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive CTA - Clean and focused */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <div className="bg-white rounded-3xl p-12 md:p-16 max-w-4xl mx-auto border border-slate-100 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-light mb-6 text-slate-900">
              Gata să începem?
            </h3>
            <p className="text-lg text-slate-600 mb-10 font-light">
              Completează formularul și începe să economisești în 15-30 minute. 
              Fiecare pas este transparent și eficient.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
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
                className="text-lg px-8 py-6 h-auto border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Vorbește cu un consultant
                </a>
              </Button>
            </div>

            {/* Trust indicators - Minimal */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span className="font-medium">Fără obligații</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span className="font-medium">Răspuns în 15-30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span className="font-medium">Proces transparent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
