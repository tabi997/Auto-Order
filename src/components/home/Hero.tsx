'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Shield, Clock, Truck, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  heroImage?: string;
}

export function Hero({ title, subtitle, ctaLabel, ctaHref, heroImage }: HeroProps) {
  const { t } = useHomeTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Hero Image Background */}
      {heroImage && (
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-background" />
        </div>
      )}
      
      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star className="h-4 w-4" />
              #1 în România pentru licitații B2B
            </motion.div>
            
            {/* Main heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {title}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                data-analytics-id="hero_cta"
              >
                <Link href={ctaHref} aria-label={ctaLabel}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/stock" aria-label="Vezi stocul disponibil">
                  Vezi stocul disponibil
                  <Car className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">Acces exclusiv B2B</div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">Preț final garantat</div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">Istoric verificat</div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">Livrare rapidă</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats & Social Proof */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Statistici AutoOrder</h3>
                <p className="text-muted-foreground">Rezultatele vorbesc de la sine</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Clienți mulțumiți</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">500+</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Vehicule livrate</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">750+</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Economie medie</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">25%</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Răspuns garantat în 15-30 min</p>
                    <p className="text-sm text-green-600">Sau primim 50€ înapoi</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
