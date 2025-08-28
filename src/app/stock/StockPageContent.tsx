'use client';

import { useState, useEffect, useCallback } from 'react';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleFilters } from '@/components/VehicleFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, SortAsc, SortDesc, Car } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useQueryParams } from '@/lib/hooks';
import { StockSchema } from '@/components/StockSchema';
import { ApiVehicle, FilterOptions } from '@/types/vehicle';

type SortField = 'price' | 'year' | 'km';
type SortOrder = 'asc' | 'desc';

export function StockPageContent() {
  const { t } = useTranslation();
  const { getParam, setParam } = useQueryParams();
  
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    bodies: [],
    fuels: [],
    countries: [],
    gearboxes: [],
    yearRange: { min: 2015, max: 2024 },
    kmRange: { min: 0, max: 200000 },
    priceRange: { min: 5000, max: 100000 },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get current page from URL
  const currentPage = parseInt(getParam('page') || '1');

  // Fetch vehicles data
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '12');
      
      // Add sort parameters
      params.set('sortBy', sortField);
      params.set('sortOrder', sortOrder);
      
      // Add filter parameters from URL
      const filterParams = ['brand', 'model', 'body', 'fuel', 'yearMin', 'yearMax', 'kmMax', 'priceMin', 'priceMax', 'country', 'gearbox'];
      filterParams.forEach(param => {
        const value = getParam(param);
        if (value) {
          params.set(param, value);
        }
      });
      
      const response = await fetch(`/api/stock?${params.toString()}`);
      const data = await response.json();
      
      if (data.ok) {
        setVehicles(data.vehicles);
        setPagination(data.pagination);
        setFilterOptions(data.filters);
      } else {
        setError(data.message || 'A apărut o eroare la încărcarea vehiculelor');
      }
    } catch (err) {
      setError('A apărut o eroare la încărcarea vehiculelor');
      console.error('Error fetching vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortField, sortOrder, getParam]);

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchVehicles();
  }, [currentPage, sortField, sortOrder, fetchVehicles]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setParam('page', page.toString());
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Se încarcă vehiculele...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Car className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            A apărut o eroare
          </h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchVehicles} variant="outline">
            Încearcă din nou
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <StockSchema 
        vehicles={vehicles} 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <VehicleFilters filterOptions={filterOptions} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium text-foreground">
                {t('stock.page.results', { count: pagination.total })}
              </span>
              {pagination.total !== vehicles.length && (
                <Badge variant="secondary">
                  {t('stock.page.activeFilters')}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('stock.sort.label')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('price')}
                className="flex items-center space-x-1"
              >
                {t('stock.sort.price')} {getSortIcon('price')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('year')}
                className="flex items-center space-x-1"
              >
                {t('stock.sort.year')} {getSortIcon('year')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('km')}
                className="flex items-center space-x-1"
              >
                {t('stock.sort.km')} {getSortIcon('km')}
              </Button>
            </div>
          </div>

          {/* Vehicles Grid */}
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t('stock.empty.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('stock.empty.subtitle')}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/sourcing'}
                >
                  {t('stock.empty.cta')}
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground italic">
              {t('stock.disclaimer')}
            </p>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </div>
      </div>
    </>
  );
}
