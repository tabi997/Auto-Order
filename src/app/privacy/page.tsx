import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de confidențialitate | AutoOrder',
  description: 'Politica de confidențialitate AutoOrder - cum protejăm datele tale personale.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-32 bg-white">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Modern Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Confidențialitate
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Politica de confidențialitate
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Cum protejăm datele tale personale și respectăm confidențialitatea ta.
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-slate-600 text-lg leading-relaxed">
            Această pagină va conține politica de confidențialitate completă a AutoOrder.
          </p>
        </div>
      </div>
    </main>
  );
}
