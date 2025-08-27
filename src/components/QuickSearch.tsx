'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';

export function QuickSearch() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (brand) params.set('brand', brand);
    if (bodyType) params.set('body', bodyType);
    if (maxPrice) params.set('maxPrice', maxPrice);
    
    const queryString = params.toString();
    router.push(`/stock${queryString ? `?${queryString}` : ''}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('quickSearch.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('quickSearch.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-2xl p-6 md:p-8 shadow-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Search input */}
              <div className="lg:col-span-2">
                <Input
                  placeholder={t('quickSearch.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12"
                />
              </div>

              {/* Brand filter */}
              <div>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('quickSearch.brandPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('quickSearch.allBrands')}</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes">Mercedes</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="Ford">Ford</SelectItem>
                    <SelectItem value="Opel">Opel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Body type filter */}
              <div>
                <Select value={bodyType} onValueChange={setBodyType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('quickSearch.bodyPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('quickSearch.allBodyTypes')}</SelectItem>
                    <SelectItem value="sedan">{t('bodyTypes.sedan')}</SelectItem>
                    <SelectItem value="hatchback">{t('bodyTypes.hatchback')}</SelectItem>
                    <SelectItem value="suv">{t('bodyTypes.suv')}</SelectItem>
                    <SelectItem value="wagon">{t('bodyTypes.wagon')}</SelectItem>
                    <SelectItem value="coupe">{t('bodyTypes.coupe')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Max price */}
              <div>
                <Input
                  type="number"
                  placeholder={t('quickSearch.maxPricePlaceholder')}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Search button */}
              <div className="md:col-span-2">
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 text-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {t('quickSearch.searchButton')}
                </Button>
              </div>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/stock?maxPrice=5000')}
                className="text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('quickSearch.under5k')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/stock?maxPrice=10000')}
                className="text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('quickSearch.under10k')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/stock?body=suv')}
                className="text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('quickSearch.suvs')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/stock?maxPrice=15000')}
                className="text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('quickSearch.under15k')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
