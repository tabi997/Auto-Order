import { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from './ContactForm';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | AutoOrder - Mașini la comandă din licitații B2B',
  description: 'Contactează-ne pentru oferte personalizate, evaluări sau întrebări despre serviciile noastre de licitații B2B. Răspundem în maxim 2 ore.',
  keywords: 'contact autoorder, ofertă mașină, evaluare gratuită, licitații B2B, contact auto',
  openGraph: {
    title: 'Contact | AutoOrder - Mașini la comandă',
    description: 'Contactează-ne pentru oferte personalizate, evaluări sau întrebări despre serviciile noastre de licitații B2B.',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | AutoOrder - Mașini la comandă',
    description: 'Contactează-ne pentru oferte personalizate, evaluări sau întrebări despre serviciile noastre de licitații B2B.',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-8 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <MapPin className="h-4 w-4" />
            Contact direct
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Să discutăm despre mașina ta
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B. 
            Răspundem în maxim 2 ore în timpul programului de lucru.
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Telefon</h3>
            <p className="text-muted-foreground">+40 123 456 789</p>
            <p className="text-sm text-muted-foreground mt-1">Luni-Vineri, 9:00-18:00</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-muted-foreground">contact@autoorder.ro</p>
            <p className="text-sm text-muted-foreground mt-1">Răspundem în 2 ore</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Program</h3>
            <p className="text-muted-foreground">Luni-Vineri</p>
            <p className="text-sm text-muted-foreground mt-1">9:00-18:00</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <ContactForm />
          </Suspense>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              De ce să ne contactezi?
            </h2>
            <p className="text-muted-foreground text-lg">
              Oferim suport personalizat pentru fiecare tip de solicitare, 
              de la evaluări gratuite la oferte complete cu transport și documente.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
