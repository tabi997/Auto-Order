'use client';

import { useState, useEffect, useCallback } from 'react';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleFilters } from '@/components/VehicleFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, SortAsc, SortDesc, Car, Filter } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useQueryParams } from '@/lib/hooks';
import { StockSchema } from '@/components/StockSchema';
import { ApiVehicle, FilterOptions } from '@/types/vehicle';
import { getStock } from '@/app/actions/stock';

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
      
      const data = await getStock({
        page: currentPage,
        limit: 12,
        sortBy: sortField,
        sortOrder: sortOrder,
        brand: getParam('brand') || '',
        model: getParam('model') || '',
        body: getParam('body') || '',
        fuel: getParam('fuel') || '',
        yearMin: getParam('yearMin') || '',
        yearMax: getParam('yearMax') || '',
        kmMax: getParam('kmMax') || '',
        priceMin: getParam('priceMin') || '',
        priceMax: getParam('priceMax') || '',
        country: getParam('country') || '',
        gearbox: getParam('gearbox') || '',
      });
      
      if (data.listings) {
        setVehicles(data.listings);
        setPagination({
          page: data.currentPage || 1,
          limit: 12,
          total: data.total || 0,
          totalPages: data.pages || 1,
          hasNext: (data.currentPage || 1) < (data.pages || 1),
          hasPrev: (data.currentPage || 1) > 1
        });
        setFilterOptions({
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
      } else {
        setError('A apărut o eroare la încărcarea vehiculelor');
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-slate-900">Se încarcă vehiculele...</h3>
            <p className="text-slate-600">Căutăm în baza noastră de licitații B2B</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <Car className="h-10 w-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-medium text-slate-900">
              A apărut o eroare
            </h3>
            <p className="text-slate-600">{error}</p>
          </div>
          <Button 
            onClick={fetchVehicles} 
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900">Filtre</h3>
            </div>
            <VehicleFilters filterOptions={filterOptions} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Results Summary and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-medium text-slate-900">
                {t('stock.page.results', { count: pagination.total })}
              </span>
              {pagination.total !== vehicles.length && (
                <Badge variant="secondary" className="px-3 py-1">
                  {t('stock.page.activeFilters')}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600 font-medium">{t('stock.sort.label')}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-2 px-4 py-2 h-auto border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  {t('stock.sort.price')} {getSortIcon('price')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('year')}
                  className="flex items-center space-x-2 px-4 py-2 h-auto border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  {t('stock.sort.year')} {getSortIcon('year')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('km')}
                  className="flex items-center space-x-2 px-4 py-2 h-auto border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  {t('stock.sort.km')} {getSortIcon('km')}
                </Button>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr items-stretch">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto border border-slate-200">
                  <Car className="h-10 w-10 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium text-slate-900">
                    {t('stock.empty.title')}
                  </h3>
                  <p className="text-slate-600 text-lg">
                    {t('stock.empty.subtitle')}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/sourcing'}
                  className="px-8 py-3"
                >
                  {t('stock.empty.cta')}
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-600 italic max-w-2xl mx-auto">
              {t('stock.disclaimer')}
            </p>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
