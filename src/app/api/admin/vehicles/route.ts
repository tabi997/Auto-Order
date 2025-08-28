import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { VehicleZ } from '@/schemas/vehicle'

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()
    
    const body = await request.json()
    const validatedData = VehicleZ.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
