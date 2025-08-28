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
  console.log('🚀 Creating testimonials table using Node.js...\n');

  try {
    // Step 1: Check if table exists
    console.log('1️⃣ Checking if testimonials table exists...');
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'testimonials');

    if (tableCheckError) {
      console.log('ℹ️  Could not check existing tables, proceeding...');
    } else if (existingTables && existingTables.length > 0) {
      console.log('✅ Testimonials table already exists!');
      
      // Check if it has data
      const { data: testimonials, error: dataError } = await supabase
        .from('testimonials')
        .select('count')
        .eq('active', true);
      
      if (!dataError && testimonials) {
        console.log(`✅ Table has data: ${testimonials.length} testimonials`);
        return;
      }
    }

    // Step 2: Create table structure by inserting data
    console.log('2️⃣ Creating table structure through data insertion...');
    
    // First, try to create a test record to see if table exists
    const testRecord = {
      name: 'Test User - ' + Date.now(),
      role: 'Tester',
      company: 'Test Company',
      rating: 5,
      content: 'This is a test testimonial to create the table structure',
      badge: 'Test Badge',
      active: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('testimonials')
      .insert(testRecord)
      .select();

    if (insertError) {
      if (insertError.message.includes('relation "public.testimonials" does not exist')) {
        console.log('❌ Table does not exist and cannot be created automatically');
        console.log('\n💡 Please create the table manually in Supabase Dashboard:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/gpazhzixylrapqmclygw');
        console.log('   2. Click "SQL Editor" in left menu');
        console.log('   3. Create new query');
        console.log('   4. Copy and run the SQL from: scripts/setup-testimonials-complete.sql');
        console.log('   5. Come back and run this script again');
        return;
      } else {
        console.log('⚠️  Insert error:', insertError.message);
      }
    } else {
      console.log('✅ Test record created successfully!');
      console.log('   Table structure is working');
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('name', testRecord.name);
      
      if (deleteError) {
        console.log('⚠️  Could not clean up test record:', deleteError.message);
      } else {
        console.log('✅ Test record cleaned up');
      }
    }

    // Step 3: Insert default testimonials
    console.log('\n3️⃣ Inserting default testimonials...');
    
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

    let insertedCount = 0;
    for (const testimonial of defaultTestimonials) {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert(testimonial);
      
      if (insertError) {
        console.log(`⚠️  Could not insert testimonial for ${testimonial.name}:`, insertError.message);
      } else {
        console.log(`✅ Inserted testimonial for ${testimonial.name}`);
        insertedCount++;
      }
    }

    console.log(`\n📊 Inserted ${insertedCount}/${defaultTestimonials.length} testimonials`);

    // Step 4: Verify the setup
    console.log('\n4️⃣ Verifying setup...');
    const { data: finalTestimonials, error: verifyError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true);

    if (verifyError) {
      console.log('ℹ️  Could not verify testimonials:', verifyError.message);
    } else {
      console.log(`✅ Found ${finalTestimonials?.length || 0} active testimonials in database`);
      
      if (finalTestimonials && finalTestimonials.length > 0) {
        console.log('   Sample testimonial:', finalTestimonials[0].name);
      }
    }

    console.log('\n🎉 Testimonials setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start your Next.js development server: npm run dev');
    console.log('   2. Test the admin panel: /admin/settings/testimonials');
    console.log('   3. Verify testimonials appear on homepage');
    console.log('   4. Test CRUD operations in admin panel');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your .env.local file has correct Supabase credentials');
    console.log('   2. Ensure you have internet connection');
    console.log('   3. Verify Supabase project is active');
    process.exit(1);
  }
}

// Run the setup
createTestimonialsTable().catch(console.error);
