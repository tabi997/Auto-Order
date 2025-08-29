import { Metadata } from 'next';
import { FAQ } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Întrebări frecvente | AutoOrder',
  description: 'Răspunsuri la întrebările frecvente despre serviciile AutoOrder - licitații B2B, Buy Now, procesul de achiziție.',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Întrebări frecvente
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Întrebări frecvente
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Răspunsuri la întrebările frecvente despre serviciile noastre de sourcing și licitații B2B.
          </p>
        </div>
        
        <FAQ />
      </div>
    </main>
  );
}
