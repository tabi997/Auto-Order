import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Validation schema for lead submission
const LeadSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  phone: z.string().min(10, 'Telefonul trebuie să aibă cel puțin 10 caractere'),
  email: z.string().email('Email invalid'),
  requestType: z.enum(['offer', 'evaluation', 'question']),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
  gdpr: z.boolean().refine(val => val === true, 'Trebuie să fii de acord cu GDPR'),
  source: z.string().optional(),
  vehicleId: z.string().optional(),
  budget: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = LeadSchema.parse(body);
    
    // Create lead object with timestamp
    const lead = {
      ...validatedData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
    };
    
    // Ensure .temp directory exists
    const tempDir = path.join(process.cwd(), '.temp');
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }
    
    // Read existing leads or create new file
    const leadsFile = path.join(tempDir, 'leads.json');
    let leads = [];
    
    try {
      const existingData = await fs.readFile(leadsFile, 'utf-8');
      leads = JSON.parse(existingData);
    } catch {
      // File doesn't exist or is invalid, start with empty array
    }
    
    // Add new lead
    leads.push(lead);
    
    // Write back to file
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
    
    // Log to console for demo purposes
    console.log('New lead received:', lead);
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Lead-ul a fost trimis cu succes!',
      leadId: lead.id 
    });
    
  } catch (error) {
    console.error('Error processing lead:', error);
    
    if (error instanceof z.ZodError) {
              return NextResponse.json(
          { 
            ok: false, 
            message: 'Date invalide',
            errors: error.issues 
          },
          { status: 400 }
        );
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        message: 'A apărut o eroare la procesarea cererii' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tempDir = path.join(process.cwd(), '.temp');
    const leadsFile = path.join(tempDir, 'leads.json');
    
    try {
      const data = await fs.readFile(leadsFile, 'utf-8');
      const leads = JSON.parse(data);
      
      return NextResponse.json({ 
        ok: true, 
        leads,
        count: leads.length 
      });
    } catch {
      return NextResponse.json({ 
        ok: true, 
        leads: [],
        count: 0 
      });
    }
    
  } catch (error) {
    console.error('Error reading leads:', error);
    return NextResponse.json(
      { 
        ok: false, 
        message: 'A apărut o eroare la citirea lead-urilor' 
      },
      { status: 500 }
    );
  }
}
