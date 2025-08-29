'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, ExternalLink, ImageOff, Star, MapPin, Calendar, Gauge, Fuel, Car, ArrowRight } from 'lucide-react';
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
      <Card className="group h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl bg-white hover:bg-slate-50/50">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {vehicle.image ? (
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <ImageOff className="h-12 w-12 text-slate-400" />
            </div>
          )}
          
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Type Badge */}
          {vehicle.type && (
            <div className="absolute left-4 top-4">
              <Badge
                variant={vehicle.type === 'BUY_NOW' ? 'default' : 'secondary'}
                className="text-xs px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:bg-white transition-all duration-300"
              >
                {getTypeBadge(vehicle.type)}
              </Badge>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
            aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
              }`}
            />
          </button>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl font-semibold text-lg shadow-sm border border-slate-200/50">
              {fmtPrice(vehicle.price)}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col gap-4 p-6">
          {/* Title */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-slate-900 group-hover:text-slate-700 transition-colors duration-300">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{vehicle.year}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{getCountryLabel(vehicle.country)}</span>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{fmtKm(vehicle.km)} km</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 capitalize">{mapFuel(vehicle.fuel)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 capitalize">{mapGear(vehicle.gearbox)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-slate-200 flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-sm" />
              </div>
              <span className="text-sm font-medium text-slate-700 capitalize">{mapBody(vehicle.body)}</span>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          )}
        </CardContent>

        {/* Footer with Actions */}
        {showActions && (
          <CardContent className="mt-auto p-6 pt-0 space-y-3">
            <Button 
              onClick={() => setIsLeadFormOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] h-12 text-base font-medium"
              size="lg"
            >
              {t('stock.card.verify')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="flex-1 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <Link href={`/stock/${vehicle.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t('stock.card.details')}
                </Link>
              </Button>
            </div>
            
            {/* Source link */}
            {vehicle.sourceUrl && (
              <Link 
                href={vehicle.sourceUrl} 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors duration-200"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Vezi sursa licitației ({vehicle.sourceName || 'Openlane'})
              </Link>
            )}
          </CardContent>
        )}
      </Card>

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
