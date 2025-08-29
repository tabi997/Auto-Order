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
    <main className="min-h-screen py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Contact direct
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Să discutăm despre mașina ta
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B. 
            Răspundem în maxim 2 ore în timpul programului de lucru.
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-slate-100/50">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900">Telefon</h3>
            <p className="text-slate-700 text-lg font-medium">+40 123 456 789</p>
            <p className="text-sm text-slate-600 mt-2">Luni-Vineri, 9:00-18:00</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-slate-100/50">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900">Email</h3>
            <p className="text-slate-700 text-lg font-medium">contact@autoorder.ro</p>
            <p className="text-sm text-slate-600 mt-2">Răspundem în 2 ore</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-slate-100/50">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900">Program</h3>
            <p className="text-slate-700 text-lg font-medium">Luni-Vineri</p>
            <p className="text-sm text-slate-600 mt-2">9:00-18:00</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-600">Se încarcă formularul...</p>
              </div>
            </div>
          }>
            <ContactForm />
          </Suspense>
        </div>

        {/* Additional Info Section */}
        <div className="mt-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-8 leading-tight">
              De ce să ne contactezi?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Oferim suport personalizat pentru fiecare tip de solicitare, 
              de la evaluări gratuite la oferte complete cu transport și documente.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
