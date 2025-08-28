'use server'

import { createClient } from '@/lib/supabase/server'
import { LeadZ } from '@/schemas/vehicle'

// Email notifications are handled conditionally in sendEmail function

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
    if (!process.env.RESEND_API_KEY) {
      console.log('Email notification skipped - RESEND_API_KEY not configured')
      return
    }
    
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
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

export async function createLead(data: any, clientIp?: string) {
  try {
    // Rate limiting
    const ip = clientIp || 'unknown'
    if (!checkRateLimit(ip)) {
      throw new Error('Too many requests. Please try again later.')
    }
    
    const validatedData = LeadZ.parse(data)
    
    const supabase = createClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }
    
    // Send email notification (non-blocking)
    sendEmail(validatedData).catch(error => {
      console.error('Email notification error:', error)
    })
    
    return lead
  } catch (error) {
    console.error('Create lead action error:', error)
    throw error
  }
}

export async function getLeads(params: {
  page?: number
  limit?: number
  status?: string
}) {
  try {
    const { page = 1, limit = 20, status } = params
    
    const supabase = createClient()
    
    let query = supabase
      .from('leads')
      .select('*')
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const offset = (page - 1) * limit
    
    const { data: leads, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }

    // Get total count for pagination
    let countQuery = supabase.from('leads').select('*', { count: 'exact', head: true })
    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    
    const { count, error: countError } = await countQuery
    
    if (countError) {
      console.error('Count error:', countError)
    }
    
    return {
      data: leads || [],
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('Get leads action error:', error)
    throw error
  }
}
