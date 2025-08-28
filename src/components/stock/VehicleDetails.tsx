'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Car, 
  MapPin, 
  Calendar, 
  Gauge, 
  Euro, 
  Star, 
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  km: number
  fuel: string
  transmission: string
  price_est: number
  badges: string[]
  images: string[]
  source: string
  featured: boolean
  featured_position: number
  created_at: string
}

interface VehicleDetailsProps {
  vehicle: Vehicle
}

export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const shareVehicle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.make} ${vehicle.model}`,
          text: `Vezi ${vehicle.make} ${vehicle.model} ${vehicle.year} - €${vehicle.price_est.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="ghost" asChild>
          <Link href="/stock" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Înapoi la stoc</span>
          </Link>
        </Button>
      </div>

      {/* Vehicle Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Image */}
        <div className="lg:w-2/3">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {vehicle.images[selectedImage] ? (
              <Image
                src={vehicle.images[selectedImage]}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            
            {/* Image Navigation */}
            {vehicle.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {vehicle.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === selectedImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {vehicle.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video bg-muted rounded-md overflow-hidden relative ${
                    index === selectedImage ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${vehicle.make} ${vehicle.model} - Imagine ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 16vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="lg:w-1/3 space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {vehicle.make} {vehicle.model}
            </h1>
            <div className="text-4xl font-bold text-primary mb-4">
              €{vehicle.price_est.toLocaleString()}
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {vehicle.featured && (
                <Badge variant="default" className="bg-orange-500">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {vehicle.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFavorite}
              className={isFavorite ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorit' : 'Adaugă la favorite'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={shareVehicle}>
              <Share2 className="h-4 w-4 mr-2" />
              Partajează
            </Button>
          </div>

          {/* Contact Actions */}
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Solicită verificare / ofertă
            </Button>
            
            <Button variant="outline" className="w-full" size="lg">
              <Mail className="h-4 w-4 mr-2" />
              Trimite email
            </Button>

            {vehicle.source && (
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href={vehicle.source} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Vezi sursa licitației
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specificații tehnice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">{vehicle.year}</div>
              <div className="text-sm text-muted-foreground">An de fabricație</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {vehicle.km.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Kilometri</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2 capitalize">
                {vehicle.fuel}
              </div>
              <div className="text-sm text-muted-foreground">Combustibil</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2 capitalize">
                {vehicle.transmission}
              </div>
              <div className="text-sm text-muted-foreground">Transmisie</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informații suplimentare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Data adăugării:</span>
              <span>{new Date(vehicle.created_at).toLocaleDateString('ro-RO')}</span>
            </div>
            
            {vehicle.featured && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Poziție featured:</span>
                <span>{vehicle.featured_position}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ID vehicul:</span>
              <span className="font-mono text-sm">{vehicle.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicule similare</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            În curând vor fi afișate vehicule similare cu acest model.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
