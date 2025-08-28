import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/app/actions/leads'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    const result = await createLead(body, clientIp)
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Solicitarea a fost trimisă cu succes!',
      data: result 
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        ok: false, 
        message: error.message || 'A apărut o eroare la trimiterea solicitării',
        details: error.stack || error.toString(),
        errorType: error.constructor.name
      }, 
      { status: 400 }
    )
  }
}
