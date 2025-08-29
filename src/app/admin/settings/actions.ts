'use server';

import { createClient } from '@/lib/supabase/server';
import { SiteSettingsSchema, SiteSettings, DEFAULT_SETTINGS } from '@/schemas/siteSettings';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      console.warn('Failed to fetch site settings, using defaults:', error);
      return DEFAULT_SETTINGS;
    }

    // Validate the data against our schema
    const validatedData = SiteSettingsSchema.parse(data.data);
    return validatedData;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(input: SiteSettings): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Validate input
    const validatedInput = SiteSettingsSchema.parse(input);
    
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'main',
        data: validatedInput,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving site settings:', error);
      return { success: false, error: error.message };
    }

    // Revalidate all relevant paths and tags
    revalidateTag('site_settings');
    revalidatePath('/');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/settings/site');

    return { success: true };
  } catch (error) {
    console.error('Error saving site settings:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}
