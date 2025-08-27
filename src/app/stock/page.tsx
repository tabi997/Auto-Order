import { Metadata } from 'next';
import { Suspense } from 'react';
import { StockPageContent } from './StockPageContent';

export const metadata: Metadata = {
  title: 'Stock - Explorare oportunități | AutoOrder',
  description: 'Explorează oportunitățile din licitații B2B. Găsește mașina perfectă cu filtre avansate și prețuri transparente.',
  openGraph: {
    title: 'Stock - Explorare oportunități | AutoOrder',
    description: 'Explorează oportunitățile din licitații B2B. Găsește mașina perfectă cu filtre avansate și prețuri transparente.',
    images: ['/og.png'],
  },
};

export default function StockPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explorare oportunități
          </h1>
          <p className="text-lg text-muted-foreground">
            Găsește mașina perfectă din licitații B2B europene
          </p>
        </div>
        
        <Suspense fallback={<div>Se încarcă...</div>}>
          <StockPageContent />
        </Suspense>
      </div>
    </main>
  );
}
