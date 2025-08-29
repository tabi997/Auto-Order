'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, Filter, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useQueryParams } from '@/lib/hooks';

interface FilterOptions {
  brands: string[];
  models: string[];
  bodies: string[];
  fuels: string[];
  countries: string[];
  gearboxes: string[];
  yearRange: { min: number; max: number };
  kmRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

interface VehicleFiltersProps {
  filterOptions: FilterOptions;
  className?: string;
}

export function VehicleFilters({ filterOptions, className }: VehicleFiltersProps) {
  const { t } = useTranslation();
  const { getParam, setParam, clearParams } = useQueryParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [filters, setFilters] = useState({
    brand: getParam('brand') || 'all',
    model: getParam('model') || '',
    body: getParam('body') || 'all',
    fuel: getParam('fuel') || 'all',
    yearMin: getParam('yearMin') || '',
    yearMax: getParam('yearMax') || '',
    kmMax: getParam('kmMax') || '',
    priceMin: getParam('priceMin') || '',
    priceMax: getParam('priceMax') || '',
    country: getParam('country') || 'all',
    gearbox: getParam('gearbox') || 'all',
  });

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Update active filters when URL params change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const active: Record<string, string> = {};
    
    params.forEach((value, key) => {
      if (value && key !== 'page') {
        active[key] = value;
      }
    });
    
    setActiveFilters(active);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params: Record<string, string | null> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params[key] = value;
      } else {
        params[key] = null;
      }
    });
    
    // Reset to page 1 when applying filters
    params.page = null;
    
    // Update URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null) {
        setParam(key, value);
      } else {
        setParam(key, null);
      }
    });
  };

  const clearFilter = (key: string) => {
    const defaultValue = ['brand', 'body', 'fuel', 'country', 'transmission'].includes(key) ? 'all' : '';
    setFilters(prev => ({ ...prev, [key]: defaultValue }));
    setParam(key, null);
  };

  const clearAllFilters = () => {
    setFilters({
      brand: 'all',
      model: '',
      body: 'all',
      fuel: 'all',
      yearMin: '',
      yearMax: '',
      kmMax: '',
      priceMin: '',
      priceMax: '',
      country: 'all',
      gearbox: 'all',
    });
    clearParams();
  };

  const getBodyTypeLabel = (body: string) => t(`bodyTypes.${body}`) || body;
  const getFuelTypeLabel = (fuel: string) => t(`fuelTypes.${fuel}`) || fuel;
  const getTransmissionLabel = (transmission: string) => t(`transmission.${transmission}`) || transmission;
  const getCountryLabel = (country: string) => t(`countries.${country}`) || country;

  const FilterSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );

  const FilterField = ({ 
    label, 
    children, 
    className = '' 
  }: { 
    label: string; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );

  const filtersContent = (
    <div className="space-y-8">
      {/* Brand & Model */}
      <FilterSection>
        <FilterField label={t('stock.filters.brand')}>
          <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Toate brandurile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate brandurile</SelectItem>
              {filterOptions.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label={t('stock.filters.model')}>
          <Input
            placeholder="Caută model..."
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>
      </FilterSection>

      {/* Body & Fuel */}
      <FilterSection>
        <FilterField label={t('stock.filters.body')}>
          <Select value={filters.body} onValueChange={(value) => handleFilterChange('body', value)}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Toate tipurile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tipurile</SelectItem>
              {filterOptions.bodies.map((body) => (
                <SelectItem key={body} value={body}>
                  {getBodyTypeLabel(body)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label={t('stock.filters.fuel')}>
          <Select value={filters.fuel} onValueChange={(value) => handleFilterChange('fuel', value)}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Toate combustibilele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate combustibilele</SelectItem>
              {filterOptions.fuels.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {getFuelTypeLabel(fuel)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </FilterSection>

      {/* Year Range */}
      <FilterSection>
        <FilterField label={t('stock.filters.yearMin')}>
          <Input
            type="number"
            placeholder={filterOptions.yearRange.min.toString()}
            value={filters.yearMin}
            onChange={(e) => handleFilterChange('yearMin', e.target.value)}
            min={filterOptions.yearRange.min}
            max={filterOptions.yearRange.max}
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>

        <FilterField label={t('stock.filters.yearMax')}>
          <Input
            type="number"
            placeholder={filterOptions.yearRange.max.toString()}
            value={filters.yearMax}
            onChange={(e) => handleFilterChange('yearMax', e.target.value)}
            min={filterOptions.yearRange.min}
            max={filterOptions.yearRange.max}
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>
      </FilterSection>

      {/* KM & Price */}
      <FilterSection>
        <FilterField label={t('stock.filters.kmMax')}>
          <Input
            type="number"
            placeholder="Km maxim"
            value={filters.kmMax}
            onChange={(e) => handleFilterChange('kmMax', e.target.value)}
            min="0"
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>

        <FilterField label={t('stock.filters.priceMin')}>
          <Input
            type="number"
            placeholder="Preț minim"
            value={filters.priceMin}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            min="0"
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>

        <FilterField label={t('stock.filters.priceMax')}>
          <Input
            type="number"
            placeholder="Preț maxim"
            value={filters.priceMax}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            min="0"
            className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
          />
        </FilterField>
      </FilterSection>

      {/* Country & Transmission */}
      <FilterSection>
        <FilterField label={t('stock.filters.country')}>
          <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Toate țările" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate țările</SelectItem>
              {filterOptions.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {getCountryLabel(country)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label={t('stock.filters.gearbox')}>
          <Select value={filters.gearbox} onValueChange={(value) => handleFilterChange('gearbox', value)}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Toate cutiile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate cutiile</SelectItem>
              {filterOptions.gearboxes.map((gearbox) => (
                <SelectItem key={gearbox} value={gearbox}>
                  {getTransmissionLabel(gearbox)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </FilterSection>

      {/* Action Buttons */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <Button 
          onClick={applyFilters} 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-12 text-base font-medium"
        >
          {t('stock.filters.apply')}
        </Button>
        <Button 
          onClick={clearAllFilters} 
          variant="outline" 
          className="w-full h-12 text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('stock.filters.clear')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          {t('stock.filters.title')} ({Object.keys(activeFilters).length})
        </Button>
      </div>

      {/* Active Filters Display */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="gap-2 px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200">
              <span className="text-xs font-medium">{key}: {value}</span>
              <button
                onClick={() => clearFilter(key)}
                className="ml-1 hover:bg-slate-300 rounded-full p-1 transition-colors duration-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <Card className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-900">
              <SlidersHorizontal className="h-6 w-6 text-primary" />
              {t('stock.filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filtersContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      {isMobileOpen && (
        <div className="md:hidden">
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-slate-900">
                <SlidersHorizontal className="h-6 w-6 text-primary" />
                {t('stock.filters.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filtersContent}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
