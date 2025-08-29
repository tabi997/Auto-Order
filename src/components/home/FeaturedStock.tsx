'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Fuel, Gauge, Zap, Star, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { getVehicles } from '@/app/actions/vehicles'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import styles from './FeaturedStock.module.css'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

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
  const [swiper, setSwiper] = useState<any>(null)

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
    
    // Navigate to the specific vehicle details page
    window.location.href = `/stock/${vehicle.id}`;
  }

  const goNext = () => {
    if (swiper) {
      swiper.slideNext()
    }
  }

  const goPrev = () => {
    if (swiper) {
      swiper.slidePrev()
    }
  }

  if (loading) {
    return (
      <section className="py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Stoc recomandat
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
              Vehicule recomandate
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
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
                transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
              >
                <Card className="animate-pulse border-0 shadow-sm overflow-hidden border border-slate-100">
                  {/* Enhanced skeleton with better visual hierarchy */}
                  <div className="h-64 bg-slate-100 animate-pulse" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-6 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
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
      <section className="py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Stoc recomandat
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
              Vehicule recomandate
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Selecția noastră de mașini cu cel mai bun raport calitate-preț din licitațiile B2B
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <Car className="h-12 w-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-medium text-slate-900 mb-6">
              Momentan nu avem mașini recomandate
            </h3>
            <p className="text-slate-600 mb-10 text-lg font-light">
              Cere o ofertă personalizată pentru mașina dorită și îți găsim opțiunile perfecte
            </p>
            <Button 
              onClick={() => window.location.href = '/contact'}
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
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
    <section className="py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Stoc recomandat
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Vehicule recomandate
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Selecția noastră de mașini cu cel mai bun raport calitate-preț din licitațiile B2B
          </p>
        </motion.div>
        
        {/* Premium Automotive Slider Container */}
        <div className={styles.premiumSliderContainer}>
          {/* Enhanced Premium Navigation Buttons */}
          <div className={styles.navButtonContainer}>
            <button
              onClick={goPrev}
              className={styles.premiumNavButton}
              aria-label="Previous vehicle"
            >
              <ChevronLeft className="h-7 w-7 text-slate-700" />
            </button>
          </div>
          
          <div className={styles.navButtonContainerRight}>
            <button
              onClick={goNext}
              className={styles.premiumNavButton}
              aria-label="Next vehicle"
            >
              <ChevronRight className="h-7 w-7 text-slate-700" />
            </button>
          </div>

          {/* Premium Swiper Slider with Automotive Industry Standards */}
          <Swiper
            onSwiper={setSwiper}
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              // Mobile: 1 card
              320: {
                slidesPerView: 1,
                spaceBetween: 24,
              },
              // Tablet: 2 cards
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              // Desktop: Maximum 3 cards for premium feel
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              // Large Desktop: Keep 3 cards for consistency
              1280: {
                slidesPerView: 3,
                spaceBetween: 48,
              },
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            className={styles.premiumSwiper}
            speed={800}
            effect="slide"
            grabCursor={true}
          >
            {vehicles.map((vehicle: Vehicle, index: number) => {
              const FuelIcon = fuelIcons[vehicle.fuel as keyof typeof fuelIcons] || Fuel
              
              return (
                <SwiperSlide key={vehicle.id} className={styles.premiumSlide}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 * index, ease: "easeOut" }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group h-full"
                  >
                    <Card 
                      className={styles.premiumCard}
                      onClick={() => handleCardClick(vehicle)}
                    >
                      <div className={styles.imageContainer}>
                        <Image
                          src={vehicle.images[0] || '/placeholder-car.jpg'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className={styles.cardImage}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        
                        {/* Premium gradient overlay */}
                        <div className={styles.imageOverlay} />
                        
                        {/* Enhanced badges with premium styling */}
                        <div className={styles.badgesContainer}>
                          {vehicle.badges && vehicle.badges.indexOf('Fără accidente') !== -1 && (
                            <div className={styles.premiumBadge}>
                              <Star className="h-3 w-3 mr-1 inline" />
                              Fără accidente
                            </div>
                          )}
                        </div>
                        
                        {/* Premium price display */}
                        <div className={styles.priceContainer}>
                          <div className={styles.priceBadge}>
                            {formatPrice(vehicle.price_est)}
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <h3 className={styles.vehicleTitle}>
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <div className={styles.featuredBadge}>
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">Featured</span>
                          </div>
                        </div>
                        
                        <div className={styles.vehicleInfo}>
                          <Calendar className="h-4 w-4" />
                          <span>{vehicle.year}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>Germania</span>
                        </div>
                        
                        <div className={styles.specsGrid}>
                          <div className={styles.specItem}>
                            <Gauge className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-700">{formatKm(vehicle.km)} km</span>
                          </div>
                          <div className={styles.specItem}>
                            <FuelIcon className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-700 capitalize">{vehicle.fuel}</span>
                          </div>
                          <div className={styles.specItem}>
                            <Car className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-700 capitalize">{vehicle.transmission}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className={styles.cardFooter}>
                        <Button 
                          className={styles.premiumButton}
                          variant="outline"
                          size="lg"
                          onClick={() => handleCardClick(vehicle)}
                          data-analytics-id="stock_card_click"
                        >
                          Rezervă consultanță
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Premium Pagination */}
          <div className={styles.premiumPaginationContainer}>
            <div className="swiper-pagination" />
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="bg-slate-50 rounded-3xl p-12 md:p-16 max-w-3xl mx-auto border border-slate-100 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-light mb-6 text-slate-900">
              Nu găsești ce cauți?
            </h3>
            <p className="text-lg text-slate-600 mb-10 font-light">
              Completează formularul și îți găsim exact mașina dorită din licitațiile B2B
            </p>
            <Button 
              onClick={() => window.location.href = '/contact'}
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
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
