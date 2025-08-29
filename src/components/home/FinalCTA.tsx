'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Clock, Shield, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary/20" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Ofertă limitată
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Gata să începi să economisești?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Completează formularul și primești oferte personalizate în 15-30 minute. 
              Fără obligații, doar informații utile pentru decizia ta.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105 bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/contact">
                Primește cotație personalizată
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto border-2 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/stock">
                Vezi stocul disponibil
                <Car className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <Clock className="h-6 w-6 text-yellow-300" />
              <span className="text-lg font-medium">Răspuns în 15-30 min</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <Shield className="h-6 w-6 text-green-300" />
              <span className="text-lg font-medium">Fără obligații</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <Car className="h-6 w-6 text-blue-300" />
              <span className="text-lg font-medium">Oferte personalizate</span>
            </div>
          </motion.div>
        </div>

        {/* Social Proof Section */}
        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                De ce clienții aleg AutoOrder?
              </h3>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                Suntem liderii în România pentru licitații B2B de vehicule, 
                cu peste 500 de clienți mulțumiți și o economie medie de 25%.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Verificare completă istoric</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Livrare organizată complet</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Suport post-vânzare</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-sm opacity-80">Clienți mulțumiți</div>
              </div>
              <div className="text-center bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">25%</div>
                <div className="text-sm opacity-80">Economie medie</div>
              </div>
              <div className="text-center bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">15-30</div>
                <div className="text-sm opacity-80">Minute răspuns</div>
              </div>
              <div className="text-center bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">4.9/5</div>
                <div className="text-sm opacity-80">Rating mediu</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Nu mai aștepta!
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Fiecare zi de așteptare te costă bani. 
              Începe să economisești astăzi!
            </p>
            <Button 
              asChild 
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105 bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/contact">
                Completează formularul acum
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
