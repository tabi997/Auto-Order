import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test leads endpoint called')
    
    const supabase = createClient()
    
    // Try to get leads without any auth
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .limit(10)
    
    console.log('📊 Direct database query result:', { 
      hasData: !!leads, 
      count: leads?.length || 0,
      hasError: !!error,
      error: error?.message 
    })
    
    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      count: leads?.length || 0,
      leads: leads || [],
      message: 'Direct database access successful'
    })
    
  } catch (error: any) {
    console.error('❌ Test endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}
