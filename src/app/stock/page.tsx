import { Metadata } from 'next';
import { Suspense } from 'react';
import { StockPageContent } from './StockPageContent';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t('ro', 'stock.meta.title'),
  description: t('ro', 'stock.meta.description'),
  openGraph: {
    title: t('ro', 'stock.meta.title'),
    description: t('ro', 'stock.meta.description'),
    images: ['/og.png'],
  },
};

export default function StockPage() {
  return (
    <>
      <main className="min-h-screen py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Modern Hero Section */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Stoc disponibil
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
              {t('ro', 'stock.page.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              {t('ro', 'stock.page.subtitle')}
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-600">Se încarcă vehiculele...</p>
              </div>
            </div>
          }>
            <StockPageContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
