import { Metadata } from 'next';
import { FAQ } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Întrebări frecvente | AutoOrder',
  description: 'Răspunsuri la întrebările frecvente despre serviciile AutoOrder - licitații B2B, Buy Now, procesul de achiziție.',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Întrebări frecvente</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Răspunsuri la întrebările frecvente despre serviciile noastre de sourcing și licitații B2B.
        </p>
      </div>
      <FAQ />
    </div>
  );
}
