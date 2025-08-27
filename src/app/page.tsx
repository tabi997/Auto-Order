import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ProcessSteps } from '@/components/ProcessSteps';
import { Benefits } from '@/components/home/Benefits';
import { PriceCalc } from '@/components/PriceCalc';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import { FinalCTA } from '@/components/FinalCTA';

export const metadata: Metadata = {
  title: 'AutoOrder – Mașini la comandă din licitații B2B',
  description: 'Cumpărăm pentru tine din licitații B2B verificate. Transparență, raport tehnic, negociere și livrare până la ușă.',
  openGraph: {
    title: 'AutoOrder – Mașini la comandă din licitații B2B',
    description: 'Cumpărăm pentru tine din licitații B2B verificate. Transparență, raport tehnic, negociere și livrare până la ușă.',
    images: ['/og/autoorder.png'],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* How We Work Section */}
      <ProcessSteps />
      
      {/* Price Calculator Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PriceCalc />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Final CTA Section */}
      <FinalCTA />
    </main>
  );
}
