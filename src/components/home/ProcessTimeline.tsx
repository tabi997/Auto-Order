'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Car, CheckCircle, Truck, ArrowRight, Clock, Shield, Euro } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Spune-ne ce vrei",
    description: "Ne dai marca, modelul, bugetul și preferințele tale specifice",
    details: "Completăm un brief personalizat în 2 minute",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100"
  },
  {
    icon: Car,
    title: "Căutăm în licitații",
    description: "Scanez licitațiile B2B și selectez cele mai potrivite opțiuni pentru tine",
    details: "Acces la 15+ platforme de licitații B2B",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100"
  },
  {
    icon: CheckCircle,
    title: "Verificăm & calculăm",
    description: "Analizez istoricul complet, verific starea și calculez costul final exact",
    details: "Raport Carfax + test OBD + verificare VIN",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100"
  },
  {
    icon: Truck,
    title: "Livrare & înmatriculare",
    description: "Organizez transportul și toate actele pentru înmatricularea în România",
    details: "Transport asigurat + acte complete + RAR",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100"
  }
];

export function ProcessTimeline() {
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
            Cum funcționează
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Proces simplu în 4 pași
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            De la cererea ta până la livrarea mașinii, totul este transparent și eficient. 
            Fiecare pas este proiectat să îți ofere controlul total.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
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
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg`}>
                    {index + 1}
                  </div>
                </div>

                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full ${step.bgColor}`}>
                  <CardContent className="pt-12 p-8 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 ${step.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <IconComponent className="h-10 w-10 text-foreground" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <p className="text-sm font-medium text-foreground bg-white/50 rounded-lg px-3 py-2">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline connector on desktop */}
        <motion.div 
          className="hidden lg:block relative mb-16"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-2 h-8 bg-primary transform -translate-y-1/2 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-2 h-8 bg-primary transform -translate-y-1/2 rounded-full" />
          <div className="absolute top-1/2 left-3/4 w-2 h-8 bg-primary transform -translate-y-1/2 rounded-full" />
        </motion.div>

        {/* Process benefits */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Rapid</h3>
            <p className="text-muted-foreground">Oferte în 15-30 minute</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Sigur</h3>
            <p className="text-muted-foreground">Verificare completă istoric</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Euro className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Eficient</h3>
            <p className="text-muted-foreground">Economie de 15-30%</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Gata să începem?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Completează formularul de mai sus și primești oferte personalizate în 15-30 minute.
            </p>
            
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
