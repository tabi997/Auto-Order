'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Calendar, Gauge, Euro, Star } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface StockCardProps {
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
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export function StockCard({
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
  rating,
  isNew = false,
  isFeatured = false,
}: StockCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isFeatured ? 'ring-2 ring-primary/20' : ''
    }`}>
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          <Image
            src={image}
            alt={`${brand} ${model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {isNew && (
              <Badge variant="default" className="bg-green-500 text-xs">
                {t('stock.new')}
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="default" className="bg-orange-500 text-xs">
                {t('stock.featured')}
              </Badge>
            )}
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
          
          {/* Country flag */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs">
              {country}
            </Badge>
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
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
            {t('stock.available')}
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
          {t('stock.transmission')}: {t(`transmission.${transmission}`)}
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
              {t('stock.viewDetails')}
            </Link>
          </Button>
          
          <Button asChild className="flex-1">
            <Link href={`/stock/${id}?action=offer`}>
              {t('stock.requestOffer')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
