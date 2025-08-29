'use server'

import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth'
import { Vehicle } from '@/types/vehicle'
import { VehicleInput } from '@/schemas/vehicle'

export interface AdminLeadsFilters {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export interface AdminVehiclesFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export async function getAdminLeads(filters: AdminLeadsFilters = {}) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const page = filters.page || 1
    const limit = filters.limit || 50
    const offset = (page - 1) * limit

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(`marca_model.ilike.%${filters.search}%,contact.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching admin leads:', error)
      throw new Error('Failed to fetch leads')
    }

    const total = count || 0
    const pages = Math.ceil(total / limit)

    return {
      data: data || [],
      total,
      pages,
      currentPage: page
    }
  } catch (error: any) {
    console.error('Admin leads action error:', error)
    throw new Error(error.message || 'Failed to fetch leads')
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    console.log('Admin action: Updating lead status:', { id, status })
    
    // Validate status value first
    const validStatuses = ['new', 'qualified', 'quoted', 'approved', 'ordered', 'delivered']
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status value: ${status}`)
    }

    // Validate ID format
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid lead ID')
    }

    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First check if the lead exists
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, status')
      .eq('id', id)
      .single()

    if (checkError || !existingLead) {
      console.error('Error checking lead existence:', checkError)
      throw new Error('Lead not found')
    }

    console.log('Lead found:', existingLead)

    // Update the lead status
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead status:', error)
      throw new Error(`Failed to update lead status: ${error.message}`)
    }

    console.log('Lead status updated successfully:', data)
    return data
  } catch (error: any) {
    console.error('Update lead status action error:', error)
    
    // Don't expose internal errors to the client
    if (error.message?.includes('Lead not found')) {
      throw new Error('Lead not found')
    } else if (error.message?.includes('Invalid status')) {
      throw new Error('Status invalid')
    } else if (error.message?.includes('Invalid lead ID')) {
      throw new Error('ID invalid')
    } else {
      throw new Error('Failed to update lead status')
    }
  }
}

export async function deleteAdminLead(id: string) {
  try {
    console.log('Admin action: Deleting lead:', { id })
    
    // Validate ID format
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid lead ID')
    }

    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First check if the lead exists
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, marca_model')
      .eq('id', id)
      .single()

    if (checkError || !existingLead) {
      console.error('Error checking lead existence:', checkError)
      throw new Error('Lead not found')
    }

    console.log('Lead found:', existingLead)

    // Delete the lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lead:', error)
      throw new Error(`Failed to delete lead: ${error.message}`)
    }

    console.log('Lead deleted successfully')
    return { 
      success: true, 
      message: `Lead "${existingLead.marca_model}" deleted successfully` 
    }
  } catch (error: any) {
    console.error('Delete admin lead action error:', error)
    
    // Don't expose internal errors to the client
    if (error.message?.includes('Lead not found')) {
      throw new Error('Lead not found')
    } else if (error.message?.includes('Invalid lead ID')) {
      throw new Error('ID invalid')
    } else {
      throw new Error('Failed to delete lead')
    }
  }
}

export async function getAdminVehicles(filters: AdminVehiclesFilters = {}) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const page = filters.page || 1
    const limit = filters.limit || 50
    const offset = (page - 1) * limit

    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching admin vehicles:', error)
      throw new Error('Failed to fetch vehicles')
    }

    const total = count || 0
    const pages = Math.ceil(total / limit)

    return {
      data: data || [],
      total,
      pages,
      currentPage: page
    }
  } catch (error: any) {
    console.error('Admin vehicles action error:', error)
    throw new Error(error.message || 'Failed to fetch vehicles')
  }
}

export async function createAdminVehicle(vehicle: VehicleInput) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single()

    if (error) {
      console.error('Error creating vehicle:', error)
      throw new Error('Failed to create vehicle')
    }

    return data
  } catch (error: any) {
    console.error('Create admin vehicle action error:', error)
    throw new Error(error.message || 'Failed to create vehicle')
  }
}

export async function updateAdminVehicle(id: string, updates: Partial<VehicleInput>) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vehicle:', error)
      throw new Error('Failed to update vehicle')
    }

    return data
  } catch (error: any) {
    console.error('Update admin vehicle action error:', error)
    throw new Error(error.message || 'Failed to update vehicle')
  }
}

export async function deleteAdminVehicle(id: string) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting vehicle:', error)
      throw new Error('Failed to delete vehicle')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete admin vehicle action error:', error)
    throw new Error(error.message || 'Failed to delete vehicle')
  }
}

export interface PageContent {
  id: string
  page_id: string
  section_key: string
  title: string
  content: string
  subtitle?: string
  language: string
  created_at: string
  updated_at: string
}

export async function getPageContent(pageId: string, language: string = 'ro'): Promise<PageContent[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_id', pageId)
      .eq('language', language)
      .order('section_key')

    if (error) {
      console.error('Error fetching page content:', error)
      throw new Error('Failed to fetch page content')
    }

    return data || []
  } catch (error: any) {
    console.error('Get page content error:', error)
    throw new Error(error.message || 'Failed to fetch page content')
  }
}
