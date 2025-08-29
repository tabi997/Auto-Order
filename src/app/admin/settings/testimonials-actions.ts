'use server';

import { createClient } from '@/lib/supabase/server';
import { Testimonial, CreateTestimonial, UpdateTestimonial } from '@/schemas/testimonials';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function createTestimonial(input: CreateTestimonial): Promise<{ success: boolean; error?: string; data?: Testimonial }> {
  try {
    const supabase = createClient();
    
    // Get the highest order_index and add 1
    const { data: maxOrder } = await supabase
      .from('testimonials')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const orderIndex = (maxOrder?.order_index || 0) + 1;
    
    // Add badge value based on is_featured status
    const badgeValue = input.is_featured ? 'Featured' : 'Standard';
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ 
        ...input, 
        order_index: orderIndex,
        badge: badgeValue
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      return { success: false, error: error.message };
    }

    revalidateTag('testimonials');
    revalidatePath('/admin/settings/testimonials');

    return { success: true, data };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}

export async function updateTestimonial(id: string, input: UpdateTestimonial): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Add badge value based on is_featured status if it's being updated
    let updateData = { ...input };
    if (input.is_featured !== undefined) {
      updateData.badge = input.is_featured ? 'Featured' : 'Standard';
    }
    
    const { error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error: error.message };
    }

    revalidateTag('testimonials');
    revalidatePath('/admin/settings/testimonials');

    return { success: true };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, error: error.message };
    }

    revalidateTag('testimonials');
    revalidatePath('/admin/settings/testimonials');

    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}

export async function updateTestimonialOrder(updates: { id: string; order_index: number }[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Update each testimonial's order_index
    for (const update of updates) {
      const { error } = await supabase
        .from('testimonials')
        .update({ order_index: update.order_index })
        .eq('id', update.id);

      if (error) {
        console.error('Error updating testimonial order:', error);
        return { success: false, error: error.message };
      }
    }

    revalidateTag('testimonials');
    revalidatePath('/admin/settings/testimonials');

    return { success: true };
  } catch (error) {
    console.error('Error updating testimonial order:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}

export async function toggleTestimonialFeatured(id: string, isFeatured: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('testimonials')
      .update({ is_featured: isFeatured })
      .eq('id', id);

    if (error) {
      console.error('Error toggling testimonial featured status:', error);
      return { success: false, error: error.message };
    }

    revalidateTag('testimonials');
    revalidatePath('/admin/settings/testimonials');

    return { success: true };
  } catch (error) {
    console.error('Error toggling testimonial featured status:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}
