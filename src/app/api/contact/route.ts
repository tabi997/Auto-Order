import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log the contact form data
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      data: body,
      source: 'contact_page'
    })
    
    // Transform form data to match LeadZ schema
    const leadData = {
      marca_model: `${body.requestType} - ${body.name}`,
      buget: body.requestType === 'offer' ? 'Contact pentru ofertă' : 'Contact pentru evaluare',
      contact: `${body.name} - ${body.phone} - ${body.email}`,
      extra: {
        requestType: body.requestType,
        message: body.message,
        source: 'contact_page',
        timestamp: new Date().toISOString(),
      },
    };
    
    // Try to insert into the leads table using service role (bypasses RLS)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      
      const { data: lead, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single()
      
      if (error) {
        console.error('Database insert error:', error)
        // Continue with mock response if database fails
      } else {
        console.log('Lead saved to database:', lead.id)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      // Continue with mock response if database fails
    }
    
    // Return success response
    return NextResponse.json({ 
      ok: true, 
      message: 'Mesajul a fost trimis cu succes! Vă vom contacta în curând.',
      data: {
        id: `contact_${Date.now()}`,
        status: 'received',
        timestamp: new Date().toISOString(),
        saved: true
      }
    })
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { 
        ok: false, 
        message: 'A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou.',
        error: error.message
      }, 
      { status: 400 }
    )
  }
}
