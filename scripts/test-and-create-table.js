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

async function testAndCreateTable() {
  console.log('🧪 Testing testimonials table...\n');

  try {
    // Test 1: Try to read from testimonials table
    console.log('1️⃣ Testing if testimonials table exists...');
    const { data: testimonials, error: readError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);

    if (readError) {
      if (readError.message.includes('relation "public.testimonials" does not exist')) {
        console.log('❌ Testimonials table does not exist');
        console.log('\n💡 To create the table, please:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Copy content from scripts/setup-testimonials-complete.sql');
        console.log('   3. Run the SQL script');
        console.log('   4. Come back and run this script again');
        return;
      } else {
        console.log('⚠️  Unexpected error:', readError.message);
      }
    } else {
      console.log('✅ Testimonials table exists!');
      console.log(`   Found ${testimonials?.length || 0} testimonials`);
      
      if (testimonials && testimonials.length > 0) {
        console.log('   Sample testimonial:', testimonials[0].name);
      }
    }

    // Test 2: Try to insert a test record
    console.log('\n2️⃣ Testing insert functionality...');
    const { data: insertData, error: insertError } = await supabase
      .from('testimonials')
      .insert({
        name: 'Test User - ' + Date.now(),
        role: 'Tester',
        company: 'Test Company',
        rating: 5,
        content: 'This is a test testimonial to verify functionality',
        badge: 'Test Badge',
        active: true
      })
      .select();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
    } else {
      console.log('✅ Insert successful!');
      console.log('   Created testimonial ID:', insertData[0].id);
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('name', insertData[0].name);
      
      if (deleteError) {
        console.log('⚠️  Could not clean up test record:', deleteError.message);
      } else {
        console.log('✅ Test record cleaned up');
      }
    }

    // Test 3: Test API endpoint
    console.log('\n3️⃣ Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API endpoint working!');
        console.log(`   Found ${data.testimonials?.length || 0} testimonials via API`);
      } else {
        console.log('⚠️  API endpoint returned:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.log('ℹ️  API test skipped (server might not be running)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎯 Test completed!');
}

// Run the test
testAndCreateTable().catch(console.error);
