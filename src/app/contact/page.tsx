import { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact | AutoOrder',
  description: 'Contactează-ne pentru oferte personalizate, evaluări sau întrebări despre serviciile noastre de licitații B2B.',
  openGraph: {
    title: 'Contact | AutoOrder',
    description: 'Contactează-ne pentru oferte personalizate, evaluări sau întrebări despre serviciile noastre de licitații B2B.',
    images: ['/og.png'],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Contactează-ne
            </h1>
            <p className="text-lg text-muted-foreground">
              Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B
            </p>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
