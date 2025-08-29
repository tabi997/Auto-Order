'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, CheckCircle, Users, Phone, Star, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';
import { motion } from 'framer-motion';

export function FinalCTA() {
  const { t } = useHomeTranslation();

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-slate-50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-slate-50 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Gata să începi să economisești?
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p 
            className="text-xl text-slate-600 mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Completează formularul și primești oferte personalizate în 15-30 minute. 
            Fără obligații, doar informații utile pentru decizia ta.
          </motion.p>
          
          {/* Benefits list */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle className="h-6 w-6 text-slate-600" />
              <span className="text-slate-700 font-medium">Preț final garantat</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Users className="h-6 w-6 text-slate-600" />
              <span className="text-slate-700 font-medium">Suport personalizat</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Car className="h-6 w-6 text-slate-600" />
              <span className="text-slate-700 font-medium">Livrare organizată</span>
            </div>
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Button 
              asChild 
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
            >
              <Link href="/contact">
                Cere ofertă personalizată
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Vorbește cu un consultant
              </Link>
            </Button>
          </motion.div>
          
          {/* Trust indicators - Minimal and elegant */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-slate-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Star className="h-4 w-4 text-slate-400" />
              <span className="font-medium">500+ clienți mulțumiți</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Shield className="h-4 w-4 text-slate-400" />
              <span className="font-medium">100% garantat</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span className="font-medium">25% economie medie</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle className="h-4 w-4 text-slate-400" />
              <span className="font-medium">Răspuns în 15-30 min</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
