'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MapPin, Calendar, Gauge, Fuel, Settings } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { LeadForm } from './LeadForm';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  body: string;
  fuel: string;
  transmission: string;
  country: string;
  image: string;
  badges: string[];
  description: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  showActions?: boolean;
}

export function VehicleCard({ vehicle, showActions = true }: VehicleCardProps) {
  const { t } = useTranslation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('de-DE').format(km);
  };

  const getBodyTypeLabel = (body: string) => {
    return t(`bodyTypes.${body}`) || body;
  };

  const getFuelTypeLabel = (fuel: string) => {
    return t(`fuelTypes.${fuel}`) || fuel;
  };

  const getTransmissionLabel = (transmission: string) => {
    return t(`transmission.${transmission}`) || transmission;
  };

  const getCountryLabel = (country: string) => {
    return t(`countries.${country}`) || country;
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {vehicle.badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant={badge === 'Buy Now' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Favorite button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>

            {/* Price */}
            <div className="absolute bottom-2 right-2 bg-white/95 px-3 py-1 rounded-lg">
              <span className="text-lg font-bold text-primary">
                {formatPrice(vehicle.price)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Gauge className="h-3 w-3" />
              <span>{formatKm(vehicle.km)} km</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Fuel className="h-3 w-3" />
              <span>{getFuelTypeLabel(vehicle.fuel)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Settings className="h-3 w-3" />
              <span>{getTransmissionLabel(vehicle.transmission)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{getCountryLabel(vehicle.country)}</span>
            </div>
          </div>

          {/* Body type */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {getBodyTypeLabel(vehicle.body)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {vehicle.description}
          </p>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/stock/${vehicle.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t('stock.viewDetails')}
                </Link>
              </Button>
              <Button
                onClick={() => setIsLeadFormOpen(true)}
                className="flex-1"
              >
                {t('stock.requestVerification')}
              </Button>
            </div>
          )}
        </CardContent>
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
