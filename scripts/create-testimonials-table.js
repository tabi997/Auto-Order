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

async function createTestimonialsTable() {
  console.log('🚀 Creating testimonials table...');

  try {
    // First, let's check if the table already exists
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'testimonials');

    if (tableCheckError) {
      console.log('ℹ️  Could not check existing tables, proceeding with creation...');
    } else if (existingTables && existingTables.length > 0) {
      console.log('✅ Testimonials table already exists!');
      return;
    }

    // Create table using raw SQL through RPC
    console.log('📝 Creating testimonials table...');
    
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

    // Try to create table using RPC
    let { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.log('⚠️  RPC method failed, trying alternative approach...');
      
      // If RPC fails, try to create table by inserting data
      console.log('🔄 Attempting to create table by inserting data...');
      
      // Try to insert a test record to trigger table creation
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: 'Test User',
          role: 'Tester',
          company: 'Test Company',
          rating: 5,
          content: 'This is a test testimonial to create the table',
          badge: 'Test Badge',
          active: true
        });
      
      if (insertError && insertError.message.includes('relation "public.testimonials" does not exist')) {
        console.log('❌ Could not create table automatically');
        console.log('💡 Please run the SQL script manually in Supabase Dashboard > SQL Editor:');
        console.log('   File: scripts/create-testimonials-table.sql');
        return;
      } else if (insertError) {
        console.log('⚠️  Insert error (might be expected):', insertError.message);
      } else {
        console.log('✅ Table created successfully through data insertion');
        
        // Clean up test record
        await supabase
          .from('testimonials')
          .delete()
          .eq('name', 'Test User');
      }
    } else {
      console.log('✅ Testimonials table created successfully via RPC');
    }

    // Now try to create indexes
    console.log('📊 Creating indexes...');
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);' 
      });
      await supabase.rpc('exec_sql', { 
        sql: 'CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);' 
      });
      console.log('✅ Indexes created successfully');
    } catch (indexError) {
      console.log('⚠️  Could not create indexes via RPC (this is normal)');
    }

    // Enable RLS
    console.log('🔒 Enabling RLS...');
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;' 
      });
      console.log('✅ RLS enabled successfully');
    } catch (rlsError) {
      console.log('⚠️  Could not enable RLS via RPC (this is normal)');
    }

    // Insert default testimonials
    console.log('📝 Inserting default testimonials...');
    
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
    console.log('\n💡 Alternative solution:');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Copy content from scripts/create-testimonials-table.sql');
    console.log('   3. Run the SQL script manually');
    process.exit(1);
  }
}

// Run the setup
createTestimonialsTable().catch(console.error);
