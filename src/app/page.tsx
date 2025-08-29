import { Hero } from '@/components/home/Hero';
import { TrustIndicators } from '@/components/home/TrustIndicators';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SuccessStories } from '@/components/home/SuccessStories';
import { Testimonials } from '@/components/Testimonials';
import { CostMiniCalculator } from '@/components/home/CostMiniCalculator';
import FeaturedStock from '@/components/home/FeaturedStock';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';

export const metadata = {
  title: 'AutoOrder - Mașini la comandă din licitații B2B | România',
  description: 'AutoOrder îți găsește mașina perfectă din licitațiile B2B europene. Transparență totală, costuri clare și livrare rapidă. Economisește 15-30% față de piața locală.',
  keywords: 'mașini B2B, licitații auto, import auto România, vehicule Germania, economie auto, AutoOrder',
  openGraph: {
    title: 'AutoOrder - Mașini la comandă din licitații B2B',
    description: 'Găsește mașina perfectă din licitațiile B2B europene. Transparență totală și economie garantată.',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'AutoOrder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoOrder - Mașini la comandă din licitații B2B',
    description: 'Găsește mașina perfectă din licitațiile B2B europene. Transparență totală și economie garantată.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Premium and minimalist */}
      <Hero />

      {/* Trust Indicators - Clean and elegant */}
      <TrustIndicators />

      {/* How It Works - Process explanation */}
      <HowItWorks />

      {/* Success Stories - Customer testimonials */}
      <SuccessStories />

      {/* Testimonials - Social proof */}
      <Testimonials />

      {/* Cost Calculator - Interactive tool */}
      <section className="py-32 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
              Calculează costurile
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Estimează costul total pentru mașina dorită din licitațiile B2B
            </p>
          </div>
          <CostMiniCalculator />
        </div>
      </section>

      {/* Featured Stock - Available vehicles */}
      <FeaturedStock />

      {/* FAQ - Common questions */}
      <FAQ />

      {/* Final CTA - Conversion optimization */}
      <FinalCTA />
    </main>
  );
}
