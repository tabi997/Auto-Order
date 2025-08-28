import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

async function verifyAdminAccess() {
  try {
    console.log('🔐 Verifying admin access...')
    
    const cookieStore = cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            'Cookie': cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
          }
        }
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Auth error:', error)
      return false
    }
    
    if (!user) {
      console.log('❌ No user found')
      return false
    }
    
    console.log('👤 User found:', user.id)
    console.log('📋 User metadata:', user.user_metadata)
    
    const userMetadata = user.user_metadata
    const isAdmin = userMetadata?.role === 'admin'
    
    console.log('🔑 Is admin?', isAdmin)
    
    return isAdmin
  } catch (error) {
    console.error('💥 Admin verification error:', error)
    return false
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE request received for leads')
    
    // Verify admin access
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) {
      console.log('❌ Admin access denied')
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    console.log('✅ Admin access verified')

    const { id } = await request.json()
    console.log('🆔 Lead ID to delete:', id)

    if (!id || typeof id !== 'string') {
      console.log('❌ Invalid lead ID')
      return NextResponse.json(
        { error: 'Lead ID is required and must be a string' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First check if the lead exists
    console.log('🔍 Checking if lead exists...')
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, marca_model')
      .eq('id', id)
      .single()

    if (checkError || !existingLead) {
      console.log('❌ Lead not found:', checkError)
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    console.log('✅ Lead found:', existingLead.marca_model)

    // Delete the lead
    console.log('🗑️ Deleting lead...')
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting lead:', error)
      return NextResponse.json(
        { error: 'Failed to delete lead' },
        { status: 500 }
      )
    }

    console.log('✅ Lead deleted successfully')
    return NextResponse.json({ 
      success: true, 
      message: `Lead "${existingLead.marca_model}" deleted successfully` 
    })
  } catch (error: any) {
    console.error('💥 Delete lead API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
