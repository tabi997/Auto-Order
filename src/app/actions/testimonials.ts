'use server'

import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth'

export interface Testimonial {
  id?: string
  name: string
  content: string
  rating: number
  vehicle?: string
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface TestimonialFilters {
  active?: boolean
  limit?: number
  offset?: number
}

export async function getTestimonials(filters: TestimonialFilters = {}) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.active !== undefined) {
      query = query.eq('active', filters.active)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching testimonials:', error)
      throw new Error('Failed to fetch testimonials')
    }

    return data || []
  } catch (error: any) {
    console.error('Testimonials action error:', error)
    throw new Error(error.message || 'Failed to fetch testimonials')
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      throw new Error('Failed to create testimonial')
    }

    return data
  } catch (error: any) {
    console.error('Create testimonial action error:', error)
    throw new Error(error.message || 'Failed to create testimonial')
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating testimonial:', error)
      throw new Error('Failed to update testimonial')
    }

    return data
  } catch (error: any) {
    console.error('Update testimonial action error:', error)
    throw new Error(error.message || 'Failed to update testimonial')
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requireAdmin()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting testimonial:', error)
      throw new Error('Failed to delete testimonial')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete testimonial action error:', error)
    throw new Error(error.message || 'Failed to delete testimonial')
  }
}
