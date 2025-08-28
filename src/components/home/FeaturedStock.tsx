'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Gauge, Zap } from 'lucide-react'

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
  featured: boolean
  featured_position: number
}

const fuelIcons = {
  benzina: Fuel,
  diesel: Fuel,
  hibrid: Zap,
  electric: Zap,
}

export default function FeaturedStock() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedVehicles() {
      try {
        const response = await fetch('/api/vehicles?featured=true')
        const data = await response.json()
        
        if (data.data) {
          setVehicles(data.data)
        }
      } catch (error) {
        console.error('Error fetching featured vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedVehicles()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('ro-RO').format(km)
  }

  const handleCardClick = (vehicle: Vehicle) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'featured_stock',
        event_label: `${vehicle.make} ${vehicle.model}`,
        data_analytics_id: 'stock_card_click'
      })
    }
    
    // Scroll to lead form and pre-fill
    const leadForm = document.getElementById('lead-quick')
    if (leadForm) {
      leadForm.scrollIntoView({ behavior: 'smooth' })
      // You can add logic here to pre-fill the form
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mașini disponibile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (vehicles.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mașini disponibile</h2>
          <div className="text-center py-12">
            <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Momentan nu avem mașini recomandate
            </h3>
            <p className="text-gray-500 mb-6">
              Cere o ofertă personalizată pentru mașina dorită
            </p>
            <Button 
              onClick={() => document.getElementById('lead-quick')?.scrollIntoView({ behavior: 'smooth' })}
              data-analytics-id="featured_empty_cta"
            >
              Cere ofertă personalizată
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Mașini disponibile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const FuelIcon = fuelIcons[vehicle.fuel as keyof typeof fuelIcons] || Fuel
            
            return (
              <Card 
                key={vehicle.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(vehicle)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={vehicle.images[0] || '/placeholder-car.jpg'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  {vehicle.badges.includes('Fără accidente') && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      Fără accidente
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                    {formatPrice(vehicle.price_est)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-600 mb-3">{vehicle.year}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      <span>{formatKm(vehicle.km)} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FuelIcon className="h-4 w-4" />
                      <span className="capitalize">{vehicle.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span className="capitalize">{vehicle.transmission}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    data-analytics-id="stock_card_click"
                  >
                    Rezervă consultanță
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
