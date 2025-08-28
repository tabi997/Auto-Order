'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Users, Gavel, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface SourcingLotCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  endDate: string;
  participants: number;
  startingPrice: number;
  category: string;
  image: string;
  status: 'active' | 'ending-soon' | 'upcoming';
}

export function SourcingLotCard({
  id,
  title,
  description,
  location,
  endDate,
  participants,
  startingPrice,
  category,
  image,
  status,
}: SourcingLotCardProps) {
  const { t } = useTranslation();

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">{t('sourcing.status.active')}</Badge>;
      case 'ending-soon':
        return <Badge variant="destructive">{t('sourcing.status.endingSoon')}</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">{t('sourcing.status.upcoming')}</Badge>;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'border-green-200 dark:border-green-800';
      case 'ending-soon':
        return 'border-red-200 dark:border-red-800';
      case 'upcoming':
        return 'border-blue-200 dark:border-blue-800';
      default:
        return 'border-border';
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${getStatusColor()}`}>
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            {getStatusBadge()}
          </div>
          
          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {title}
        </CardTitle>
        
        {/* Starting price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            €{startingPrice.toLocaleString()}
          </div>
          <Badge variant="outline" className="text-sm">
            {t('sourcing.startingPrice')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{endDate}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants} {t('sourcing.participants')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{t('sourcing.timeRemaining')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/sourcing/${id}`}>
              {t('sourcing.viewDetails')}
            </Link>
          </Button>
          
          <Button asChild className="flex-1">
            <Link href={`/sourcing/${id}?action=participate`}>
              <Gavel className="h-4 w-4 mr-2" />
              {t('sourcing.participate')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
