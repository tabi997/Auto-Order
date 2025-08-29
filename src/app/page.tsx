import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import LeadQuickForm from '@/components/home/LeadQuickForm';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
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
      {/* Hero Section */}
      <Hero 
        title={settings.hero.title}
        subtitle={settings.hero.subtitle}
        ctaLabel={settings.hero.ctaLabel}
        ctaHref={settings.hero.ctaHref}
        heroImage={settings.hero.heroImage}
      />
      
      {/* Lead Quick Form Section */}
      <LeadQuickForm />
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* Process Timeline Section */}
      <ProcessTimeline />
      
      {/* Testimonials Section */}
      <Testimonials />
      
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
