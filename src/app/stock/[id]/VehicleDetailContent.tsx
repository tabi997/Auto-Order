'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Eye, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  ExternalLink,
  Car,
  Euro,
  Users,
  Palette,
  Home,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { LeadForm } from '@/components/LeadForm';
import { fmtPrice, fmtKm, mapFuel, mapGear, mapBody } from '@/lib/format';
import { ListingWithImages } from '@/types/admin';

interface VehicleDetailContentProps {
  listing: ListingWithImages;
}

export function VehicleDetailContent({ listing }: VehicleDetailContentProps) {
  const { t } = useTranslation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const getTypeBadge = (type: string) => {
    if (type === 'BUY_NOW') return t('stock.badges.buyNow');
    if (type === 'AUCTION') return t('stock.badges.auction');
    return type;
  };

  const getCountryLabel = (country: string) => {
    // Check if country is a country code (2 letters) or full name
    if (country.length === 2) {
      return t(`countries.${country}`) || country;
    }
    return country;
  };

  const mainImage = listing.images[selectedImage]?.url || listing.coverUrl || '/api/placeholder/800/450';

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/stock" className="hover:text-foreground transition-colors">
            Stoc
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">
            {listing.brand} {listing.model} {listing.year}
          </span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/stock">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi la stock
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Title & Badges */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {listing.brand} {listing.model}
                  </h1>
                  <p className="text-xl text-muted-foreground">{listing.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={listing.type === 'BUY_NOW' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {getTypeBadge(listing.type)}
                  </Badge>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                {fmtPrice(listing.priceEur)}
              </div>

              {/* Short Description */}
              {listing.shortDesc && (
                <p className="text-lg text-muted-foreground">
                  {listing.shortDesc}
                </p>
              )}
            </div>

            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                  <Image
                    src={mainImage}
                    alt={`${listing.brand} ${listing.model} ${listing.year} - imagine principală`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Thumbnail Navigation */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === selectedImage 
                            ? 'border-primary' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        aria-label={`Selectează imaginea ${index + 1}`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `${listing.brand} ${listing.model} ${listing.year} - imagine ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specificații tehnice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">An</p>
                      <p className="font-medium">{listing.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kilometraj</p>
                      <p className="font-medium">{fmtKm(listing.km)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Combustibil</p>
                      <p className="font-medium">{mapFuel(listing.fuel)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cutie de viteze</p>
                      <p className="font-medium">{mapGear(listing.gearbox)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Caroserie</p>
                      <p className="font-medium">{mapBody(listing.body)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Țara</p>
                      <p className="font-medium">{getCountryLabel(listing.country)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Euro className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tip</p>
                      <p className="font-medium">{getTypeBadge(listing.type)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{listing.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  onClick={() => setIsLeadFormOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  {t('stock.card.verify')}
                </Button>
                
                {listing.sourceUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    aria-label={`${t('stock.card.source')} pentru ${listing.brand} ${listing.model} ${listing.year}`}
                  >
                    <a
                      href={listing.sourceUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      title={t('stock.card.sourceTooltip')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('stock.card.source')} ({listing.sourceName || 'Sursa'})
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {t('stock.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        defaultValues={{
          vehicleId: listing.id,
          requestType: 'offer',
        }}
        title={`Solicită ofertă - ${listing.brand} ${listing.model}`}
        submitButtonText="Solicită ofertă"
      />
    </main>
  );
}
