import { Metadata } from 'next';
import { SourcingContent } from './SourcingContent';

export const metadata: Metadata = {
  title: 'Sourcing - Licitații B2B inteligente | AutoOrder',
  description: 'Descoperă cum funcționează sourcing-ul nostru inteligent în licitații B2B europene. Transparență, garanții și economii garantate.',
  openGraph: {
    title: 'Sourcing - Licitații B2B inteligente | AutoOrder',
    description: 'Descoperă cum funcționează sourcing-ul nostru inteligent în licitații B2B europene. Transparență, garanții și economii garantate.',
    images: ['/og.png'],
  },
};

export default function SourcingPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Sourcing inteligent
            </h1>
            <p className="text-lg text-muted-foreground">
              Licitații B2B transparente și garantate cu economii de până la 40%
            </p>
          </div>
          
          <SourcingContent />
        </div>
      </div>
    </main>
  );
}
