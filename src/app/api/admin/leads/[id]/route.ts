import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' }, 
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update lead' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(lead)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}
