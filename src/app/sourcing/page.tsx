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
    <main className="min-h-screen py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Sourcing inteligent
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Sourcing inteligent
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Licitații B2B transparente și garantate cu economii de până la 40%
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <SourcingContent />
        </div>
      </div>
    </main>
  );
}
