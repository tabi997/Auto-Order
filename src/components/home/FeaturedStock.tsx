'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Gauge, Euro } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  body: string;
  fuel: string;
  gearbox: string;
  country: string;
  image: string;
  type: string;
  description: string;
}

export function FeaturedStock() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles?limit=6&sortBy=price&sortOrder=asc');
        const data = await response.json();
        
        if (data.ok) {
          setVehicles(data.vehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Fallback vehicles if API fails
  const fallbackVehicles: Vehicle[] = [
    {
      id: '1',
      brand: 'Volkswagen',
      model: 'Passat',
      year: 2019,
      km: 85000,
      price: 18500,
      body: 'Sedan',
      fuel: 'Diesel',
      gearbox: 'Manuală',
      country: 'Germania',
      image: '/api/placeholder/400/300',
      type: 'BUY_NOW',
      description: 'VW Passat în stare excelentă'
    },
    {
      id: '2',
      brand: 'BMW',
      model: 'X3',
      year: 2020,
      km: 65000,
      price: 32000,
      body: 'SUV',
      fuel: 'Diesel',
      gearbox: 'Automată',
      country: 'Germania',
      image: '/api/placeholder/400/300',
      type: 'BUY_NOW',
      description: 'BMW X3 xDrive20d'
    },
    {
      id: '3',
      brand: 'Audi',
      model: 'A4',
      year: 2018,
      km: 95000,
      price: 16500,
      body: 'Sedan',
      fuel: 'Benzină',
      gearbox: 'Manuală',
      country: 'Germania',
      image: '/api/placeholder/400/300',
      type: 'BUY_NOW',
      description: 'Audi A4 2.0 TDI'
    }
  ];

  const displayVehicles = vehicles.length > 0 ? vehicles : fallbackVehicles;

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Stoc disponibil
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mașini disponibile în licitații
            </h2>
            <p className="text-xl text-muted-foreground">
              Oportunități actuale din licitațiile B2B
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Stoc disponibil
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mașini disponibile în licitații
          </h2>
          <p className="text-xl text-muted-foreground">
            Oportunități actuale din licitațiile B2B
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-600">
                  Fără accidente
                </Badge>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">
                  {vehicle.brand} {vehicle.model}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {vehicle.year}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4 mr-2" />
                    {vehicle.km.toLocaleString()} km
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Car className="h-4 w-4 mr-2" />
                    {vehicle.fuel} • {vehicle.gearbox}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-1 text-primary" />
                    <span className="text-lg font-semibold text-primary">
                      {vehicle.price.toLocaleString()} €
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Preț estimat all-in
                  </span>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/stock/${vehicle.id}`}>
                    Rezervă consultanță
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/stock">
              Vezi toate mașinile disponibile
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
