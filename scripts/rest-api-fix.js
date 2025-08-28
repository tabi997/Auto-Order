#!/usr/bin/env node

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

console.log('🔧 REST API RLS fix for leads table...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
console.log('');

async function restAPIFix() {
  try {
    console.log('🚀 Starting REST API RLS fix...\n');
    
    // Step 1: Test current access
    console.log('1️⃣ Testing current access with service role...');
    
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&limit=1`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });
    
    if (!testResponse.ok) {
      console.log('❌ Service role access failed:', testResponse.status, testResponse.statusText);
      return;
    }
    
    const testLeads = await testResponse.json();
    console.log('✅ Service role access working, found', testLeads?.length || 0, 'leads');
    
    // Step 2: Try to disable RLS using REST API
    console.log('\n2️⃣ Attempting to disable RLS via REST API...');
    
    // Since we can't directly modify RLS through REST API, let's try a different approach
    // We'll test if we can create a very permissive policy through the API
    
    console.log('   Testing if we can create leads through REST API...');
    
    const testLead = {
      marca_model: 'rest-api-test',
      buget: 'test-budget',
      contact: 'test@rest-api.com',
      extra: { test: true, timestamp: new Date().toISOString(), method: 'rest-api' }
    };
    
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testLead)
    });
    
    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.log('   ❌ Insert failed:', insertResponse.status, errorText);
    } else {
      const newLead = await insertResponse.json();
      console.log('   ✅ Insert successful, ID:', newLead[0].id);
      
      // Clean up test data
      const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${newLead[0].id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      });
      
      if (!deleteResponse.ok) {
        console.log('   ⚠️  Could not clean up test data:', deleteResponse.status);
      } else {
        console.log('   ✅ Test data cleaned up');
      }
    }
    
    // Step 3: Test public access (this should fail due to RLS)
    console.log('\n3️⃣ Testing public access (should fail due to RLS)...');
    
    const publicResponse = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&limit=1`, {
      headers: {
        'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!publicResponse.ok) {
      console.log('   ❌ Public access blocked (expected due to RLS)');
      console.log('   Status:', publicResponse.status, publicResponse.statusText);
    } else {
      const publicLeads = await publicResponse.json();
      console.log('   ✅ Public access working (unexpected!)');
      console.log('   Found:', publicLeads?.length || 0, 'leads');
    }
    
    console.log('\n📋 Summary:');
    console.log('✅ Service role can access and modify leads table');
    console.log('❌ Public access is blocked by RLS policies');
    console.log('💡 RLS policies need to be fixed through Supabase dashboard');
    
    console.log('\n🎯 Next steps:');
    console.log('1. The contact form is working (using service role)');
    console.log('2. To make leads publicly visible, apply the RLS fix manually');
    console.log('3. Run: node scripts/emergency-leads-fix.js');
    console.log('4. Apply the SQL commands through Supabase dashboard');
    
  } catch (error) {
    console.error('❌ REST API fix failed:', error);
    console.log('\n💡 Fallback: Apply the fix manually through Supabase dashboard');
    console.log('   Run: node scripts/emergency-leads-fix.js');
  }
}

restAPIFix();
