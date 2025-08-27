'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Calendar, Gauge, Euro } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface SearchCardProps {
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
  badges?: string[];
}

export function SearchCard({
  id,
  brand,
  model,
  year,
  km,
  price,
  body,
  fuel,
  transmission,
  country,
  image,
  badges = [],
}: SearchCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={image}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges overlay */}
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Country flag */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs">
              {country}
            </Badge>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {brand} {model}
        </CardTitle>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            €{price.toLocaleString()}
          </div>
          <Badge variant="outline" className="text-sm">
            {t('searchCard.available')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{km.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>{t(`bodyTypes.${body}`)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Euro className="h-4 w-4" />
            <span>{t(`fuelTypes.${fuel}`)}</span>
          </div>
        </div>

        {/* Transmission */}
        <div className="text-sm text-muted-foreground">
          {t('searchCard.transmission')}: {t(`transmission.${transmission}`)}
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{country}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/stock/${id}`}>
              {t('searchCard.viewDetails')}
            </Link>
          </Button>
          
          <Button asChild className="flex-1">
            <Link href={`/stock/${id}?action=offer`}>
              {t('searchCard.requestOffer')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
