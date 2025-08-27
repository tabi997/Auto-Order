'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Gauge, Fuel, Settings, Euro, Truck, Calculator } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { LeadForm } from '@/components/LeadForm';
import { PriceCalc } from '@/components/PriceCalc';

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

interface VehicleDetailContentProps {
  vehicleId: string;
}

export function VehicleDetailContent({ vehicleId }: VehicleDetailContentProps) {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock images for demo
  const vehicleImages = [
    vehicle?.image || '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
  ];

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const data = await response.json();
        
        if (data.ok) {
          setVehicle(data.vehicle);
          setRelatedVehicles(data.relatedVehicles || []);
        } else {
          setError(data.message || 'Vehiculul nu a fost găsit');
        }
      } catch (err) {
        setError('A apărut o eroare la încărcarea vehiculului');
        console.error('Error fetching vehicle:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

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

  const getBodyTypeLabel = (body: string) => t(`bodyTypes.${body}`) || body;
  const getFuelTypeLabel = (fuel: string) => t(`fuelType.${fuel}`) || fuel;
  const getTransmissionLabel = (transmission: string) => t(`transmission.${transmission}`) || transmission;
  const getCountryLabel = (country: string) => t(`countries.${country}`) || country;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Se încarcă vehiculul...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Vehiculul nu a fost găsit
          </h3>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild>
            <Link href="/stock">
              Înapoi la stock
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          href="/stock" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi la stock
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Title and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-muted-foreground">{vehicle.year}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Salvat' : 'Salvează'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partajează
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                <Image
                  src={vehicleImages[selectedImage]}
                  alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {vehicle.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge === 'Buy Now' ? 'default' : 'secondary'}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {vehicleImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-[4/3] w-20 overflow-hidden rounded border-2 transition-colors ${
                        selectedImage === index 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} - Imagine ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specificații tehnice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">An de fabricație</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kilometraj</p>
                    <p className="font-medium">{formatKm(vehicle.km)} km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Combustibil</p>
                    <p className="font-medium">{getFuelTypeLabel(vehicle.fuel)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cutie de viteze</p>
                    <p className="font-medium">{getTransmissionLabel(vehicle.transmission)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tip caroserie</p>
                    <p className="font-medium">{getBodyTypeLabel(vehicle.body)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Țara de origine</p>
                    <p className="font-medium">{getCountryLabel(vehicle.country)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descriere</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {vehicle.description}
              </p>
            </CardContent>
          </Card>

          {/* Related Vehicles */}
          {relatedVehicles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicule similare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedVehicles.map((relatedVehicle) => (
                    <Link
                      key={relatedVehicle.id}
                      href={`/stock/${relatedVehicle.id}`}
                      className="block p-4 border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 overflow-hidden rounded">
                          <Image
                            src={relatedVehicle.image}
                            alt={`${relatedVehicle.brand} ${relatedVehicle.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {relatedVehicle.brand} {relatedVehicle.model}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {relatedVehicle.year} • {formatKm(relatedVehicle.km)} km
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {formatPrice(relatedVehicle.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acțiuni rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setIsLeadFormOpen(true)}
                className="w-full"
                size="lg"
              >
                <Euro className="h-4 w-4 mr-2" />
                Solicită ofertă
              </Button>
              <Button variant="outline" className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                Calculează transport
              </Button>
            </CardContent>
          </Card>

          {/* Price Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculator estimativ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Preț achiziție:</span>
                  <span className="font-medium">{formatPrice(vehicle.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comision (5%):</span>
                  <span className="font-medium">{formatPrice(vehicle.price * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport (3%):</span>
                  <span className="font-medium">{formatPrice(vehicle.price * 0.03)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total estimat:</span>
                  <span className="text-primary">{formatPrice(vehicle.price * 1.08)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informații contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Ai întrebări despre acest vehicul? Contactează-ne pentru mai multe detalii.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> contact@autoorder.ro</p>
                <p><strong>Telefon:</strong> +40 123 456 789</p>
                <p><strong>Program:</strong> Luni-Vineri, 9:00-18:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
