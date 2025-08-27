'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useQueryParams } from '@/lib/hooks';

interface StockFiltersProps {
  className?: string;
}

export function StockFilters({ className = '' }: StockFiltersProps) {
  const { t } = useTranslation();
  const { getParams, setParam, clearParams } = useQueryParams();

  const handleFilterChange = (key: string, value: string) => {
    if (value === '') {
      setParam(key, null);
    } else {
      setParam(key, value);
    }
  };

  const handleClearFilters = () => {
    clearParams();
  };

  const queryParams = getParams();
  const activeFiltersCount = Object.keys(queryParams).filter(key => 
    key !== 'page' && queryParams[key] !== undefined
  ).length;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{t('filters.title')}</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t('filters.clear')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('filters.search')}</label>
          <Input
            placeholder={t('filters.searchPlaceholder')}
            value={queryParams.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
          />
        </div>

        <Separator />

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.brand')}</label>
            <Select value={queryParams.brand || ''} onValueChange={(value) => handleFilterChange('brand', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('filters.allBrands')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.allBrands')}</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Mercedes">Mercedes</SelectItem>
                <SelectItem value="Audi">Audi</SelectItem>
                <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
                <SelectItem value="Opel">Opel</SelectItem>
                <SelectItem value="Renault">Renault</SelectItem>
                <SelectItem value="Peugeot">Peugeot</SelectItem>
                <SelectItem value="Skoda">Skoda</SelectItem>
                <SelectItem value="Seat">Seat</SelectItem>
                <SelectItem value="Dacia">Dacia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.model')}</label>
            <Input
              placeholder={t('filters.modelPlaceholder')}
              value={queryParams.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Body & Fuel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.body')}</label>
            <Select value={queryParams.body || ''} onValueChange={(value) => handleFilterChange('body', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('filters.allBodyTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.allBodyTypes')}</SelectItem>
                <SelectItem value="sedan">{t('bodyTypes.sedan')}</SelectItem>
                <SelectItem value="hatchback">{t('bodyTypes.hatchback')}</SelectItem>
                <SelectItem value="suv">{t('bodyTypes.suv')}</SelectItem>
                <SelectItem value="wagon">{t('bodyTypes.wagon')}</SelectItem>
                <SelectItem value="coupe">{t('bodyTypes.coupe')}</SelectItem>
                <SelectItem value="convertible">{t('bodyTypes.convertible')}</SelectItem>
                <SelectItem value="van">{t('bodyTypes.van')}</SelectItem>
                <SelectItem value="truck">{t('bodyTypes.truck')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.fuel')}</label>
            <Select value={queryParams.fuel || ''} onValueChange={(value) => handleFilterChange('fuel', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('filters.allFuelTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.allFuelTypes')}</SelectItem>
                <SelectItem value="petrol">{t('fuelTypes.petrol')}</SelectItem>
                <SelectItem value="diesel">{t('fuelTypes.diesel')}</SelectItem>
                <SelectItem value="hybrid">{t('fuelTypes.hybrid')}</SelectItem>
                <SelectItem value="electric">{t('fuelTypes.electric')}</SelectItem>
                <SelectItem value="lpg">{t('fuelTypes.lpg')}</SelectItem>
                <SelectItem value="cng">{t('fuelTypes.cng')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Year Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('filters.year')}</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                placeholder={t('filters.minYear')}
                value={queryParams.minYear || ''}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder={t('filters.maxYear')}
                value={queryParams.maxYear || ''}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Kilometers & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.maxKm')}</label>
            <Input
              type="number"
              placeholder={t('filters.maxKmPlaceholder')}
              value={queryParams.maxKm || ''}
              onChange={(e) => handleFilterChange('maxKm', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.maxPrice')}</label>
            <Input
              type="number"
              placeholder={t('filters.maxPricePlaceholder')}
              value={queryParams.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Country & Transmission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.country')}</label>
            <Select value={queryParams.country || ''} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('filters.allCountries')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.allCountries')}</SelectItem>
                <SelectItem value="DE">{t('countries.DE')}</SelectItem>
                <SelectItem value="FR">{t('countries.FR')}</SelectItem>
                <SelectItem value="NL">{t('countries.NL')}</SelectItem>
                <SelectItem value="BE">{t('countries.BE')}</SelectItem>
                <SelectItem value="IT">{t('countries.IT')}</SelectItem>
                <SelectItem value="ES">{t('countries.ES')}</SelectItem>
                <SelectItem value="AT">{t('countries.AT')}</SelectItem>
                <SelectItem value="CH">{t('countries.CH')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('filters.transmission')}</label>
            <Select value={queryParams.transmission || ''} onValueChange={(value) => handleFilterChange('transmission', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('filters.allTransmissions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.allTransmissions')}</SelectItem>
                <SelectItem value="manual">{t('transmission.manual')}</SelectItem>
                <SelectItem value="automatic">{t('transmission.automatic')}</SelectItem>
                <SelectItem value="semi-automatic">{t('transmission.semiAutomatic')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.activeFilters')}</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(queryParams).map(([key, value]) => {
                  if (key === 'page' || value === undefined) return null;
                  
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                      <span>{t(`filters.${key}`)}: {value}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange(key, '')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
