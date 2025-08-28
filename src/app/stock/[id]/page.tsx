import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VehicleDetailContent } from './VehicleDetailContent';
import { prisma } from '@/lib/prisma';

interface VehicleDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: true }
  });
  
  if (!listing) {
    return {
      title: 'Vehicul negăsit | AutoOrder',
      description: 'Vehiculul căutat nu a fost găsit.',
    };
  }

  return {
    title: `${listing.brand} ${listing.model} ${listing.year} – AutoOrder`,
    description: listing.shortDesc || `Vehicul ${listing.brand} ${listing.model} din ${listing.year}`,
    openGraph: {
      title: `${listing.brand} ${listing.model} ${listing.year}`,
      description: listing.shortDesc || `Vehicul ${listing.brand} ${listing.model} din ${listing.year}`,
      images: listing.images.map((img: any) => img.url),
    },
  };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: true }
  });
  
  if (!listing) {
    notFound();
  }

  return <VehicleDetailContent listing={listing} />;
}
