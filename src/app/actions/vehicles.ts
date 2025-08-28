'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getVehicles(params: {
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  try {
    const { featured, page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = params
    
    const supabase = createClient()
    
    let query = supabase
      .from('vehicles')
      .select('*')
    
    if (featured === true) {
      query = query.eq('featured', true)
    }
    
    const offset = (page - 1) * limit
    
    const { data: vehicles, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(featured === true ? 0 : offset, featured === true ? 5 : offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }

    // Get total count for pagination
    let total = 0
    if (featured !== true) {
      const { count, error: countError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
      
      if (!countError) {
        total = count || 0
      }
    }
    
    return { 
      data: vehicles || [],
      total: featured === true ? undefined : total,
      pages: featured === true ? undefined : Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Vehicles action error:', error)
    throw new Error('Internal server error')
  }
}

export async function getVehicleById(id: string) {
  try {
    const supabase = createClient()
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Vehicle not found')
    }
    
    return vehicle
  } catch (error) {
    console.error('Vehicle by ID action error:', error)
    throw new Error('Internal server error')
  }
}

export async function createVehicle(data: any) {
  try {
    const supabase = createAdminClient()
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to create vehicle')
    }
    
    return vehicle
  } catch (error) {
    console.error('Create vehicle action error:', error)
    throw new Error('Internal server error')
  }
}

export async function updateVehicle(id: string, data: any) {
  try {
    const supabase = createAdminClient()
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to update vehicle')
    }
    
    return vehicle
  } catch (error) {
    console.error('Update vehicle action error:', error)
    throw new Error('Internal server error')
  }
}

export async function deleteVehicle(id: string) {
  try {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to delete vehicle')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Delete vehicle action error:', error)
    throw new Error('Internal server error')
  }
}
