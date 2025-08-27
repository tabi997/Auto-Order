'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, ExternalLink, ImageOff } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { LeadForm } from './LeadForm';
import { fmtPrice, fmtKm, mapFuel, mapGear, mapBody } from '@/lib/format';

import { ApiVehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: ApiVehicle;
  showActions?: boolean;
}

export function VehicleCard({ vehicle, showActions = true }: VehicleCardProps) {
  const { t } = useTranslation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    if (type === 'BUY_NOW') return t('stock.badges.buyNow');
    if (type === 'AUCTION') return t('stock.badges.auction');
    return type;
  };

  const getCountryLabel = (country: string) => {
    return t(`countries.${country}`) || country;
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {vehicle.image ? (
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Type Badge */}
          {vehicle.type && (
            <div className="absolute left-3 top-3">
              <Badge
                variant={vehicle.type === 'BUY_NOW' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {getTypeBadge(vehicle.type)}
              </Badge>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-2 p-4">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-primary">
            {fmtPrice(vehicle.price)}
          </div>

          {/* Specifications */}
          <p className="text-sm text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
            <span>{fmtKm(vehicle.km)}</span>
            <span>• {mapFuel(vehicle.fuel)}</span>
            <span>• {mapGear(vehicle.gearbox)}</span>
            <span>• {mapBody(vehicle.body)}</span>
            <span>• {getCountryLabel(vehicle.country)}</span>
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {vehicle.description}
          </p>
        </div>

        {/* Footer with Actions */}
        {showActions && (
          <div className="mt-auto p-4 pt-0">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href={`/stock/${vehicle.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t('stock.card.details')}
                </Link>
              </Button>
              <Button 
                onClick={() => setIsLeadFormOpen(true)}
                className="min-w-[200px] shrink-0"
              >
                {t('stock.card.verify')}
              </Button>
            </div>
            
            {/* Source link */}
            {vehicle.sourceUrl && (
              <Link 
                href={vehicle.sourceUrl} 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="mt-2 inline-flex items-center text-sm text-muted-foreground hover:underline"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Vezi sursa licitației ({vehicle.sourceName || 'Openlane'})
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        defaultValues={{
          vehicleId: vehicle.id,
          requestType: 'offer',
        }}
        title={`Solicită ofertă - ${vehicle.brand} ${vehicle.model}`}
        submitButtonText="Solicită ofertă"
      />
    </>
  );
}
