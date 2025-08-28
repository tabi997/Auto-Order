import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { LeadQuickForm } from '@/components/home/LeadQuickForm';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { SocialProof } from '@/components/home/SocialProof';
import { Benefits } from '@/components/home/Benefits';
import { CostMiniCalculator } from '@/components/home/CostMiniCalculator';
import { FeaturedStock } from '@/components/home/FeaturedStock';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';

export const metadata: Metadata = {
  title: 'AutoOrder – Mașini la comandă din licitații B2B (Openlane)',
  description: 'Cost total final înainte de ofertă, verificare istoric, livrare rapidă. Cere ofertă în 60s și primești mașina dorită din licitații B2B.',
  openGraph: {
    title: 'AutoOrder – Mașini la comandă din licitații B2B',
    description: 'Cost total final înainte de ofertă, verificare istoric, livrare rapidă. Cere ofertă în 60s.',
    images: ['/og/autoorder.png'],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Lead Quick Form Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Primește ofertă personalizată
            </h2>
            <p className="text-xl text-muted-foreground">
              Completează formularul și te contactăm în 15-30 minute cu oferte potrivite
            </p>
          </div>
          <LeadQuickForm />
        </div>
      </section>
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* Process Timeline Section */}
      <ProcessTimeline />
      
      {/* Social Proof Section */}
      <SocialProof />
      
      {/* Cost Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Calculează costul total
            </h2>
            <p className="text-xl text-muted-foreground">
              Estimează costurile pentru mașina dorită
            </p>
          </div>
          <CostMiniCalculator />
        </div>
      </section>
      
      {/* Featured Stock Section */}
      <FeaturedStock />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* Final CTA Section */}
      <FinalCTA />
    </main>
  );
}
