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
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('ro', 'stock.page.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('ro', 'stock.page.subtitle')}
            </p>
          </div>
          
          <Suspense fallback={<div>Se încarcă...</div>}>
            <StockPageContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
