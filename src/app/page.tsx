import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { TrustIndicators } from '@/components/home/TrustIndicators';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SuccessStories } from '@/components/home/SuccessStories';
import { Testimonials } from '@/components/Testimonials';
import { Benefits } from '@/components/home/Benefits';
import { CostMiniCalculator } from '@/components/home/CostMiniCalculator';
import FeaturedStock from '@/components/home/FeaturedStock';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';
import { getSiteSettings } from '@/app/admin/settings/actions';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    
    return {
      title: settings.seo.title,
      description: settings.seo.description,
      openGraph: {
        title: settings.seo.title,
        description: settings.seo.description,
        images: settings.seo.ogImage ? [settings.seo.ogImage] : ['/og/autoorder.png'],
      },
    };
  } catch (error) {
    // Fallback to default metadata
    return {
      title: 'AutoOrder – Mașina visurilor tale din licitații B2B (Openlane)',
      description: 'Preț final garantat, istoric verificat, livrare în România în 14-21 zile. Cere ofertă personalizată în 60s și primești mașina dorită din licitații B2B cu 15-30% mai ieftin.',
      openGraph: {
        title: 'AutoOrder – Mașina visurilor tale din licitații B2B',
        description: 'Preț final garantat, istoric verificat, livrare în România în 14-21 zile. Cere ofertă personalizată în 60s.',
        images: ['/og/autoorder.png'],
      },
    };
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen">
      {/* Hero Section - Full screen with compelling CTA */}
      <Hero 
        title={settings.hero.title}
        subtitle={settings.hero.subtitle}
        ctaLabel={settings.hero.ctaLabel}
        ctaHref={settings.hero.ctaHref}
        heroImage={settings.hero.heroImage}
      />
      
      {/* Trust Indicators - Social proof and statistics */}
      <TrustIndicators />
      
      {/* Benefits Section - Why choose AutoOrder */}
      <Benefits />
      
      {/* How It Works - Comprehensive process explanation */}
      <HowItWorks />
      
      {/* Success Stories - Real success cases with savings */}
      <SuccessStories />
      
      {/* Testimonials - Customer reviews */}
      <Testimonials />
      
      {/* Cost Calculator Section - Interactive tool */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Calculează costul total
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Estimează costurile pentru mașina dorită și vezi economiile pe care le poți face
            </p>
          </div>
          <CostMiniCalculator />
        </div>
      </section>
      
      {/* Featured Stock - Showcase available vehicles */}
      <FeaturedStock />
      
      {/* FAQ Section - Address common concerns */}
      <FAQ />
      
      {/* Final CTA Section - Last chance to convert */}
      <FinalCTA />
    </main>
  );
}
