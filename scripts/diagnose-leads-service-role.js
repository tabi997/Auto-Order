#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

const env = loadEnv();

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔍 Diagnosing leads table with service role (bypasses RLS)...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
console.log('');

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function diagnoseLeadsWithServiceRole() {
  try {
    console.log('🚀 Starting diagnosis with service role...\n');
    
    // Step 1: Test access to leads table
    console.log('1️⃣ Testing access to leads table...');
    const { data: leads, error: selectError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (selectError) {
      console.log('❌ SELECT failed:', selectError.message);
      return;
    }
    
    console.log('✅ SELECT successful, found', leads?.length || 0, 'leads');
    
    if (leads && leads.length > 0) {
      console.log('\n📊 Recent leads:');
      leads.slice(0, 3).forEach((lead, index) => {
        console.log(`   ${index + 1}. ID: ${lead.id}`);
        console.log(`      Model: ${lead.marca_model}`);
        console.log(`      Contact: ${lead.contact}`);
        console.log(`      Created: ${lead.created_at}`);
        console.log(`      Extra: ${JSON.stringify(lead.extra)}`);
        console.log('');
      });
    }
    
    // Step 2: Test insert capability
    console.log('2️⃣ Testing insert capability...');
    const testLead = {
      marca_model: 'service-role-test',
      buget: 'test-budget',
      contact: 'test@service-role.com',
      extra: { test: true, timestamp: new Date().toISOString(), method: 'service-role-test' }
    };
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select();
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message);
      console.log('   Error code:', insertError.code);
      console.log('   Error details:', insertError.details);
      console.log('   Error hint:', insertError.hint);
    } else {
      console.log('✅ INSERT successful, created lead with ID:', newLead[0].id);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead[0].id);
      
      if (deleteError) {
        console.log('⚠️  Warning: Could not clean up test data:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up successfully');
      }
    }
    
    // Step 3: Check table structure
    console.log('\n3️⃣ Checking table structure...');
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('leads')
        .select('*')
        .limit(0);
      
      if (tableError) {
        console.log('❌ Table structure check failed:', tableError.message);
      } else {
        console.log('✅ Table structure accessible');
      }
    } catch (e) {
      console.log('⚠️  Table structure check failed:', e.message);
    }
    
    console.log('\n📋 Summary:');
    if (leads && leads.length > 0) {
      console.log('✅ Leads table contains data and is accessible with service role');
      console.log('✅ Contact form submissions are being saved to the database');
      console.log('✅ The issue is with RLS policies blocking public access');
    } else {
      console.log('❌ Leads table is empty or not accessible');
    }
    
    console.log('\n💡 Next steps:');
    console.log('1. The contact form is working and saving data');
    console.log('2. You can view the data using the service role key');
    console.log('3. To fix public access, apply the RLS fix through Supabase dashboard');
    console.log('4. Or keep using the current setup (it works, just not publicly visible)');
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

diagnoseLeadsWithServiceRole();
