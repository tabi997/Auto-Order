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
    <section className="py-32 bg-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Premium section header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-8 px-6 py-3 text-sm font-medium border-slate-200 text-slate-600 bg-white/80 backdrop-blur-sm">
            De încredere
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            De ce clienții aleg AutoOrder
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Rezultatele vorbesc de la sine. Suntem liderii în România pentru licitații B2B de vehicule.
          </p>
        </motion.div>

        {/* Trust Statistics - Clean and minimal */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {trustStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-slate-600" />
                </div>
                <div className="text-3xl md:text-4xl font-light text-slate-900 mb-3">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-slate-700 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500 font-light">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Badges - Elegant cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-500 bg-white hover:bg-slate-50/50 cursor-pointer group">
                  <CardContent className="pt-12 p-8 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
                      <IconComponent className="h-10 w-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-4 text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                      {badge.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Proof - Minimal and elegant */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="bg-slate-50 rounded-3xl p-12 md:p-16 border border-slate-100 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-slate-900 mb-6 leading-relaxed">
              "AutoOrder mi-a salvat 8.000€ pe mașina visurilor mele!"
            </h3>
            <p className="text-lg text-slate-600 mb-8 font-light">
              - Maria D., clientă din București
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                Verificare completă istoric
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                Livrare organizată complet
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                Suport post-vânzare
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
