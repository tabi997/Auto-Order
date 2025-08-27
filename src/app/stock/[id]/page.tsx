import { Metadata } from 'next';
import { Suspense } from 'react';
import { VehicleDetailContent } from './VehicleDetailContent';

interface VehicleDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  // In a real app, you would fetch the vehicle data here
  // For now, we'll use a generic title
  return {
    title: `Vehicul ${params.id} | AutoOrder`,
    description: 'Detalii complete despre vehiculul selectat din licitațiile B2B.',
    openGraph: {
      title: `Vehicul ${params.id} | AutoOrder`,
      description: 'Detalii complete despre vehiculul selectat din licitațiile B2B.',
      images: ['/og.png'],
    },
  };
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Se încarcă...</div>}>
          <VehicleDetailContent vehicleId={params.id} />
        </Suspense>
      </div>
    </main>
  );
}
