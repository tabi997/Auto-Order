import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LeadZ } from '@/schemas/vehicle'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiting (in production, use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

async function sendEmail(leadData: any) {
  try {
    await resend.emails.send({
      from: 'AutoOrder <noreply@autoorder.ro>',
      to: [leadData.contact],
      bcc: ['admin@autoorder.ro'],
      subject: 'Mulțumim pentru solicitarea ta - AutoOrder',
      html: `
        <h2>Salut!</h2>
        <p>Mulțumim pentru interesul tău în serviciile AutoOrder.</p>
        <p><strong>Detalii solicitare:</strong></p>
        <ul>
          <li>Mașină: ${leadData.marca_model}</li>
          <li>Buget: ${leadData.buget}</li>
        </ul>
        <p>Echipa noastră te va contacta în următoarele 15-30 de minute pentru a discuta detalii și a-ți oferi o cotație personalizată.</p>
        <p>Cu stimă,<br>Echipa AutoOrder</p>
      `,
    })
  } catch (error) {
    console.error('Email sending error:', error)
  }
}

async function sendTelegramNotification(leadData: any) {
  try {
    const message = `🚗 Lead nou: ${leadData.marca_model}, ${leadData.buget}, ${leadData.contact}`
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
    
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('Telegram notification error:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const validatedData = LeadZ.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('leads')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // Send notifications (non-blocking)
    Promise.all([
      sendEmail(validatedData),
      sendTelegramNotification(validatedData)
    ]).catch(console.error)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Mulțumim! Te contactăm în 15–30 min.' 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
