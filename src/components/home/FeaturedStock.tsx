'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Gauge, Zap, Star, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { getVehicles } from '@/app/actions/vehicles'

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
        const data = await getVehicles({ featured: true })
        
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
    
    // Navigate to contact page instead of scrolling to lead form
    window.location.href = '/contact';
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4">
              Stoc recomandat
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Vehicule recomandate
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Selecția noastră de mașini cu cel mai bun raport calitate-preț din licitațiile B2B
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="animate-pulse border-0 shadow-lg">
                  <div className="h-64 bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-3" />
                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (vehicles.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4">
              Stoc recomandat
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Vehicule recomandate
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Selecția noastră de mașini cu cel mai bun raport calitate-preț din licitațiile B2B
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Momentan nu avem mașini recomandate
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Cere o ofertă personalizată pentru mașina dorită și îți găsim opțiunile perfecte
            </p>
                          <Button 
                onClick={() => window.location.href = '/contact'}
                size="lg"
                className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                data-analytics-id="featured_empty_cta"
              >
                Cere ofertă personalizată
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">
            Stoc recomandat
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Vehicule recomandate
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Selecția noastră de mașini cu cel mai bun raport calitate-preț din licitațiile B2B
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => {
            const FuelIcon = fuelIcons[vehicle.fuel as keyof typeof fuelIcons] || Fuel
            
            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card 
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm"
                  onClick={() => handleCardClick(vehicle)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={vehicle.images[0] || '/placeholder-car.jpg'}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {vehicle.badges.includes('Fără accidente') && (
                        <Badge className="bg-green-500 hover:bg-green-600 border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Fără accidente
                        </Badge>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-2xl font-bold text-lg shadow-lg">
                        {formatPrice(vehicle.price_est)}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{vehicle.year}</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>Germania</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatKm(vehicle.km)} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FuelIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium capitalize">{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        <span className="font-medium capitalize">{vehicle.transmission}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-105" 
                      variant="outline"
                      size="lg"
                      data-analytics-id="stock_card_click"
                    >
                      Rezervă consultanță
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Nu găsești ce cauți?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Completează formularul și îți găsim exact mașina dorită din licitațiile B2B
            </p>
            <Button 
              onClick={() => window.location.href = '/contact'}
              size="lg"
              className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              Cere ofertă personalizată
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
