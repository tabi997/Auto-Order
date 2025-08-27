import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ProcessSteps } from '@/components/ProcessSteps';
import { Features } from '@/components/Features';
import { PriceCalc } from '@/components/PriceCalc';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import { FinalCTA } from '@/components/FinalCTA';

export const metadata: Metadata = {
  title: 'AutoOrder – Mașini la comandă din licitații B2B',
  description: 'Licitații B2B transparente și garantate. Găsește mașina perfectă la prețul potrivit cu ajutorul expertizelor noastre.',
  openGraph: {
    title: 'AutoOrder – Mașini la comandă din licitații B2B',
    description: 'Licitații B2B transparente și garantate. Găsește mașina perfectă la prețul potrivit cu ajutorul expertizelor noastre.',
    images: ['/og.png'],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* How We Work Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProcessSteps />
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Features />
        </div>
      </section>
      
      {/* Price Calculator Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PriceCalc />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FinalCTA />
        </div>
      </section>
    </main>
  );
}
