'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, Star, Users, TrendingUp, Clock, Award, Globe } from 'lucide-react';

const trustStats = [
  {
    icon: Users,
    value: '500+',
    label: 'Clienți mulțumiți',
    description: 'În ultimul an'
  },
  {
    icon: TrendingUp,
    value: '25%',
    label: 'Economie medie',
    description: 'Față de piața locală'
  },
  {
    icon: Clock,
    value: '15-30',
    label: 'Minute răspuns',
    description: 'Garantat'
  },
  {
    icon: Award,
    value: '4.9/5',
    label: 'Rating mediu',
    description: 'Pe Google & Facebook'
  }
];

const trustBadges = [
  {
    icon: Shield,
    title: 'Verificare completă',
    description: 'Istoric, rapoarte tehnice și test OBD'
  },
  {
    icon: Globe,
    title: 'Acces global B2B',
    description: 'Licitații exclusive din 15+ țări'
  },
  {
    icon: CheckCircle,
    title: 'Preț final garantat',
    description: 'Fără costuri ascunse sau surprize'
  }
];

export function TrustIndicators() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">
            De încredere
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            De ce clienții aleg AutoOrder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rezultatele vorbesc de la sine. Suntem liderii în România pentru licitații B2B de vehicule.
          </p>
        </motion.div>

        {/* Trust Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {trustStats.map((stat, index) => {
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
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
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

        {/* Trust Badges */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {badge.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              "AutoOrder mi-a salvat 8.000€ pe mașina visurilor mele!"
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              - Maria D., clientă din București
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Verificare completă istoric
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Livrare organizată complet
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Suport post-vânzare
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
