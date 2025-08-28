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

// Enhanced email templates based on request type
function getEmailTemplate(leadData: any) {
  const { requestType, vehicleDetails, company } = leadData.extra || {}
  
  let subject = 'Mulțumim pentru solicitarea ta - AutoOrder'
  let html = ''
  
  switch (requestType) {
    case 'offer':
      subject = 'Ofertă personalizată - AutoOrder'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">AutoOrder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Mașini la comandă din licitații B2B</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Salut ${leadData.contact.split(' - ')[0]}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Mulțumim pentru interesul tău în serviciile AutoOrder. Am primit solicitarea ta pentru o ofertă personalizată.
            </p>
            
            ${vehicleDetails?.make && vehicleDetails?.model ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Detalii vehicul:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                ${vehicleDetails.make ? `<li><strong>Marcă:</strong> ${vehicleDetails.make}</li>` : ''}
                ${vehicleDetails.model ? `<li><strong>Model:</strong> ${vehicleDetails.model}</li>` : ''}
                ${vehicleDetails.year ? `<li><strong>An:</strong> ${vehicleDetails.year}</li>` : ''}
                ${vehicleDetails.budget ? `<li><strong>Buget estimat:</strong> ${vehicleDetails.budget}</li>` : ''}
              </ul>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Următorii pași:</h3>
              <ol style="margin: 0; padding-left: 20px; color: #555;">
                <li>Echipa noastră va analiza solicitarea în următoarele 2 ore</li>
                <li>Vei primi o listă cu 3-5 mașini potrivite din licitații B2B</li>
                <li>Vom discuta opțiunile și vom pregăti oferta finală</li>
                <li>Dacă ești mulțumit, organizăm achiziția și transportul</li>
              </ol>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              <strong>Răspuns garantat în maxim 2 ore</strong> în timpul programului de lucru (Luni-Vineri, 9:00-18:00).
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+40123456789" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📞 Sună acum
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Cu stimă,<br>
              <strong>Echipa AutoOrder</strong><br>
              📧 contact@autoorder.ro<br>
              📱 +40 123 456 789
            </p>
          </div>
        </div>
      `
      break
      
    case 'evaluation':
      subject = 'Evaluare gratuită - AutoOrder'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">AutoOrder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Evaluare gratuită pentru nevoile tale</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Salut ${leadData.contact.split(' - ')[0]}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Mulțumim pentru solicitarea ta de evaluare gratuită. Echipa noastră va analiza nevoile tale și îți va oferi recomandări personalizate.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Ce include evaluarea:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                <li>Analiza cerințelor și bugetului</li>
                <li>Recomandări pentru sursele cele mai potrivite</li>
                <li>Estimarea costurilor totale (achiziție + transport + taxe)</li>
                <li>Planul de implementare</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              <strong>Evaluarea este complet gratuită</strong> și nu implică nicio obligație din partea ta.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Vom reveni cu o evaluare detaliată în maxim 2 ore în timpul programului de lucru.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+40123456789" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📞 Sună pentru detalii
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Cu stimă,<br>
              <strong>Echipa AutoOrder</strong><br>
              📧 contact@autoorder.ro<br>
              📱 +40 123 456 789
            </p>
          </div>
        </div>
      `
      break
      
    case 'question':
      subject = 'Răspuns la întrebarea ta - AutoOrder'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">AutoOrder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Răspundem la toate întrebările tale</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Salut ${leadData.contact.split(' - ')[0]}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Mulțumim pentru întrebarea ta. Echipa noastră va analiza solicitarea și îți va răspunde cu toate informațiile necesare.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Vom reveni cu un răspuns detaliat în maxim 2 ore în timpul programului de lucru.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+40123456789" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📞 Sună pentru răspuns imediat
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Cu stimă,<br>
              <strong>Echipa AutoOrder</strong><br>
              📧 contact@autoorder.ro<br>
              📱 +40 123 456 789
            </p>
          </div>
        </div>
      `
      break
      
    case 'partnership':
      subject = 'Propunere parteneriat - AutoOrder'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">AutoOrder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Parteneriate strategice</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Salut ${leadData.contact.split(' - ')[0]}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Mulțumim pentru propunerea de parteneriat. Echipa noastră va analiza oportunitatea și va reveni cu o propunere detaliată.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Vom programa o întâlnire pentru a discuta detalii în următoarele 24-48 de ore.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+40123456789" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📞 Programează o întâlnire
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Cu stimă,<br>
              <strong>Echipa AutoOrder</strong><br>
              📧 contact@autoorder.ro<br>
              📱 +40 123 456 789
            </p>
          </div>
        </div>
      `
      break
      
    default:
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">AutoOrder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Mulțumim pentru solicitarea ta</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Salut ${leadData.contact.split(' - ')[0]}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Mulțumim pentru interesul tău în serviciile AutoOrder. Am primit solicitarea ta și vom reveni cu un răspuns în cel mai scurt timp.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Cu stimă,<br>
              <strong>Echipa AutoOrder</strong><br>
              📧 contact@autoorder.ro<br>
              📱 +40 123 456 789
            </p>
          </div>
        </div>
      `
  }
  
  return { subject, html }
}

async function sendEmail(leadData: any) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('Email notification skipped - RESEND_API_KEY not configured')
      return
    }
    
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { subject, html } = getEmailTemplate(leadData)
    
    await resend.emails.send({
      from: 'AutoOrder <noreply@autoorder.ro>',
      to: [leadData.contact.split(' - ')[2]], // Extract email from contact string
      bcc: ['admin@autoorder.ro'],
      subject,
      html,
    })
    
    console.log(`Email sent successfully for ${leadData.extra?.requestType || 'unknown'} request`)
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
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Database error: ${error.message}`)
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
  search?: string
}) {
  try {
    const { page = 1, limit = 50, status, search } = params
    
    const supabase = createClient()
    
    let query = supabase
      .from('leads')
      .select('*')
    
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`marca_model.ilike.%${search}%,contact.ilike.%${search}%,buget.ilike.%${search}%`)
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
    if (search) {
      countQuery = countQuery.or(`marca_model.ilike.%${search}%,contact.ilike.%${search}%,buget.ilike.%${search}%`)
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
