import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Funcție pentru a crea client cu service role pentru operații critice
function createServiceRoleClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 Settings API PUT - Start');
    
    // Check admin authentication
    const adminCheck = await requireAdmin();
    if (!adminCheck) {
      console.log('❌ Admin check failed - Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Admin check passed');

    const body = await request.json();
    const { key, value } = body;

    console.log('📝 Request data:', { key, valueType: typeof value });

    if (!key || value === undefined) {
      console.log('❌ Missing key or value');
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Încearcă mai întâi cu client-ul normal
    let supabase = createClient();
    
    // Get current user for debugging
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 Current user:', {
      id: user?.id,
      email: user?.email,
      role: user?.user_metadata?.role,
      hasError: !!userError
    });

    // Update or insert setting
    console.log('💾 Attempting to upsert setting with normal client...');
    let { data, error } = await supabase
      .from('settings')
      .upsert(
        { 
          key, 
          value,
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'key',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    // Dacă operația eșuează din cauza RLS, încearcă cu service role
    if (error && (error.code === 'PGRST301' || error.message.includes('RLS') || error.message.includes('policy'))) {
      console.log('⚠️ RLS error detected, trying with service role...');
      
      const serviceClient = createServiceRoleClient();
      const result = await serviceClient
        .from('settings')
        .upsert(
          { 
            key, 
            value,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'key',
            ignoreDuplicates: false
          }
        )
        .select()
        .single();
        
      data = result.data;
      error = result.error;
      
      if (!error) {
        console.log('✅ Setting updated successfully with service role');
      }
    }

    if (error) {
      console.error('❌ Error updating setting:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to update setting',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('✅ Setting updated successfully');
    console.log('📄 Updated data:', data);

    return NextResponse.json({
      success: true,
      data: {
        key: data.key,
        value: data.value,
        updated_at: data.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Settings API POST - Start');
    
    // Check admin authentication
    const adminCheck = await requireAdmin();
    if (!adminCheck) {
      console.log('❌ Admin check failed - Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Admin check passed');

    const body = await request.json();
    const { settings } = body;

    console.log('📝 Request data:', { settingsCount: settings?.length });

    if (!settings || !Array.isArray(settings)) {
      console.log('❌ Settings array is required');
      return NextResponse.json(
        { error: 'Settings array is required' },
        { status: 400 }
      );
    }

    // Încearcă mai întâi cu client-ul normal
    let supabase = createClient();
    
    // Get current user for debugging
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 Current user:', {
      id: user?.id,
      email: user?.email,
      role: user?.user_metadata?.role,
      hasError: !!userError
    });

    // Update multiple settings
    const updates = settings.map((setting: any) => ({
      key: setting.key,
      value: setting.value,
      updated_at: new Date().toISOString()
    }));

    console.log('💾 Attempting to upsert multiple settings with normal client...');
    let { data, error } = await supabase
      .from('settings')
      .upsert(updates, { 
        onConflict: 'key',
        ignoreDuplicates: false
      })
      .select();

    // Dacă operația eșuează din cauza RLS, încearcă cu service role
    if (error && (error.code === 'PGRST301' || error.message.includes('RLS') || error.message.includes('policy'))) {
      console.log('⚠️ RLS error detected, trying with service role...');
      
      const serviceClient = createServiceRoleClient();
      const result = await serviceClient
        .from('settings')
        .upsert(updates, { 
          onConflict: 'key',
          ignoreDuplicates: false
        })
        .select();
        
      data = result.data;
      error = result.error;
      
      if (!error) {
        console.log('✅ Settings updated successfully with service role');
      }
    }

    if (error) {
      console.error('❌ Error updating settings:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to update settings',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('✅ Settings updated successfully');
    console.log('📄 Updated count:', data?.length);

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
