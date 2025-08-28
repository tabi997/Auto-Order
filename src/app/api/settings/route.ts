import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get all settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value, description, updated_at')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Transform settings into a more usable format
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        ...setting.value,
        _meta: {
          description: setting.description,
          updated_at: setting.updated_at
        }
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
