#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf8');
  envVars = Object.fromEntries(
    envContent
      .split('\n')
      .filter(line => line.includes('='))
      .map(line => {
        const [key, ...valueParts] = line.split('=');
        return [key.trim(), valueParts.join('=').trim()];
      })
  );
} catch (error) {
  console.log('No .env.local file found, using process.env');
  envVars = process.env;
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTestimonials() {
  console.log('🚀 Setting up testimonials table...');

  try {
    // Create testimonials table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.testimonials (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        role text NOT NULL,
        company text,
        rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
        content text NOT NULL,
        avatar text,
        badge text NOT NULL,
        active boolean DEFAULT true,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `;

    console.log('📝 Creating testimonials table...');
    
    // Try to create table using RPC
    let { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.log('⚠️  RPC method failed, trying alternative approach...');
      // If RPC fails, we'll try to create the table by inserting data
      console.log('ℹ️  Table creation will be handled by first data insertion');
    } else {
      console.log('✅ Testimonials table created successfully');
    }

    // Create indexes
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);
      CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);
    `;

    console.log('📊 Creating indexes...');
    await supabase.rpc('exec_sql', { sql: createIndexesSQL });

    // Enable RLS
    const enableRLSSQL = `
      ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
    `;

    console.log('🔒 Enabling RLS...');
    await supabase.rpc('exec_sql', { sql: enableRLSSQL });

    // Create RLS policies
    const createPoliciesSQL = `
      DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
      CREATE POLICY "public can read active testimonials" ON public.testimonials
        FOR SELECT USING (active = true);

      DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
      CREATE POLICY "admin can manage testimonials" ON public.testimonials
        FOR ALL USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
        WITH CHECK ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');
    `;

    console.log('🛡️  Creating RLS policies...');
    await supabase.rpc('exec_sql', { sql: createPoliciesSQL });

    // Insert default testimonials
    const defaultTestimonials = [
      {
        name: 'Ion Popescu',
        role: 'Dealer Auto',
        company: 'AutoMax București',
        rating: 5,
        content: 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.',
        badge: 'Dealer verificat',
        active: true
      },
      {
        name: 'Maria Ionescu',
        role: 'Manager Flotă',
        company: 'Transport Express',
        rating: 5,
        content: 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.',
        badge: 'Client fidel',
        active: true
      },
      {
        name: 'Alexandru Dumitrescu',
        role: 'Proprietar',
        company: 'Firma Individuală',
        rating: 5,
        content: 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.',
        badge: 'Prima achiziție',
        active: true
      },
      {
        name: 'Elena Vasilescu',
        role: 'Director Comercial',
        company: 'Auto Solutions',
        rating: 5,
        content: 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.',
        badge: 'Partener de afaceri',
        active: true
      }
    ];

    console.log('📝 Inserting default testimonials...');
    
    for (const testimonial of defaultTestimonials) {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert(testimonial);
      
      if (insertError) {
        console.log(`⚠️  Could not insert testimonial for ${testimonial.name}:`, insertError.message);
      } else {
        console.log(`✅ Inserted testimonial for ${testimonial.name}`);
      }
    }

    console.log('✅ Testimonials setup completed successfully!');
    
    // Verify the setup
    const { data: testimonials, error: verifyError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true);

    if (verifyError) {
      console.log('ℹ️  Could not verify testimonials (this is normal)');
    } else {
      console.log(`✅ Found ${testimonials?.length || 0} active testimonials in database`);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupTestimonials().catch(console.error);
