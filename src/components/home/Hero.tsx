'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useHomeTranslation } from '@/i18n';
import { motion } from 'framer-motion';

export function Hero() {
  const { t } = useHomeTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium background - subtle and elegant */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
      
      {/* Minimal decorative elements - barely visible */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-primary/2 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium badge - subtle and refined */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-12 shadow-sm"
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
            Lider în România pentru licitații B2B
          </motion.div>
          
          {/* Main heading - elegant typography */}
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-8 leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            {t('hero.title')}
          </motion.h1>
          
          {/* Subtitle - refined and clear */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {t('hero.subtitle')}
          </motion.p>
          
          {/* Single, powerful CTA */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Button 
              asChild 
              size="lg" 
              className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white px-12 py-6 h-auto text-lg font-medium shadow-2xl hover:shadow-slate-900/25 transition-all duration-500 transform hover:scale-105 border-0"
              data-analytics-id="hero_cta"
            >
              <Link href="/contact?type=offer" aria-label="Completează brief-ul AutoOrder">
                <span className="relative z-10 flex items-center gap-3">
                  {t('hero.primaryCta')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                {/* Subtle background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Minimal trust indicators - just the essentials */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-sm text-slate-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>Preț final garantat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>Istoric verificat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>Livrare în 14-21 zile</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Elegant scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-slate-300 to-transparent" />
        <motion.div 
          className="w-px h-8 bg-slate-400 mx-auto mt-2"
          animate={{ 
            height: [32, 48, 32],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
