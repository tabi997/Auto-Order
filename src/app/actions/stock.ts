'use server'

import { createClient } from '@/lib/supabase/server'

export async function getStock(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
  sortBy?: string
  sortOrder?: string
  brand?: string
  model?: string
  body?: string
  fuel?: string
  yearMin?: string
  yearMax?: string
  kmMax?: string
  priceMin?: string
  priceMax?: string
  country?: string
  gearbox?: string
}) {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      status = '', 
      type = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      brand = '',
      model = '',
      body = '',
      fuel = '',
      yearMin = '',
      yearMax = '',
      kmMax = '',
      priceMin = '',
      priceMax = '',
      country = '',
      gearbox = ''
    } = params
    
    const supabase = createClient()
    
    let query = supabase
      .from('vehicles')
      .select('*')
    
    // Apply search filter
    if (search) {
      query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%`)
    }
    
    // Apply status filter
    if (status) {
      query = query.eq('featured', status === 'featured')
    }
    
    // Apply brand filter
    if (brand) {
      query = query.eq('make', brand)
    }
    
    // Apply model filter
    if (model) {
      query = query.eq('model', model)
    }
    
    // Apply fuel filter
    if (fuel) {
      query = query.eq('fuel', fuel)
    }
    
    // Apply year range filter
    if (yearMin) {
      query = query.gte('year', parseInt(yearMin))
    }
    if (yearMax) {
      query = query.lte('year', parseInt(yearMax))
    }
    
    // Apply km filter
    if (kmMax) {
      query = query.lte('km', parseInt(kmMax))
    }
    
    // Apply price range filter
    if (priceMin) {
      query = query.gte('price_est', parseInt(priceMin))
    }
    if (priceMax) {
      query = query.lte('price_est', parseInt(priceMax))
    }
    
    // Apply transmission filter
    if (gearbox) {
      query = query.eq('transmission', gearbox)
    }
    
    const offset = (page - 1) * limit
    
    // Apply sorting
    const ascending = sortOrder === 'asc'
    let sortField = sortBy
    
    // Map frontend sort fields to database fields
    if (sortBy === 'price') sortField = 'price_est'
    if (sortBy === 'year') sortField = 'year'
    if (sortBy === 'km') sortField = 'km'
    
    const { data: vehicles, error } = await query
      .order(sortField, { ascending })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Count error:', countError)
      throw new Error('Database error')
    }
    
    // Transform database vehicles to ApiVehicle format
    const transformedVehicles = (vehicles || []).map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      km: vehicle.km,
      price: vehicle.price_est,
      body: '', // Not available in current schema
      fuel: vehicle.fuel,
      gearbox: vehicle.transmission,
      country: '', // Not available in current schema
      image: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '',
      images: (vehicle.images || []).map((img: string) => ({ url: img, alt: `${vehicle.make} ${vehicle.model}` })),
      description: `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.km}km - ${vehicle.fuel} - ${vehicle.transmission}`,
      sourceUrl: vehicle.source || '',
      sourceName: vehicle.source || '',
      type: vehicle.featured ? 'FEATURED' : 'BUY_NOW',
      status: vehicle.featured ? 'featured' : 'available'
    }))
    
    return {
      listings: transformedVehicles,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Stock action error:', error)
    throw error
  }
}
