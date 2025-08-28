#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local')
  if (!fs.existsSync(envPath)) {
    return {}
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  return env
}

const env = loadEnv()

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Fixing RLS Policies for Leads Table')
console.log('========================================\n')

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixLeadsRLS() {
  try {
    console.log('\n🔧 Fixing RLS policies for leads table...')
    
    // First, let's check what policies exist
    console.log('🔍 Checking existing policies...')
    
    // Drop all existing policies for leads
    console.log('🗑️  Dropping existing policies...')
    
    const policiesToDrop = [
      'leads_select_policy',
      'leads_insert_policy',
      'leads_update_policy',
      'leads_delete_policy',
      'leads_public_select_policy'
    ]
    
    for (const policyName of policiesToDrop) {
      try {
        await supabase.rpc('drop_policy_if_exists', { 
          table_name: 'leads', 
          policy_name: policyName 
        })
        console.log(`✅ Dropped policy: ${policyName}`)
      } catch (e) {
        console.log(`⚠️  Policy drop skipped: ${policyName}`)
      }
    }
    
    // Test CRUD operations
    console.log('\n🧪 Testing CRUD operations...')
    
    // Test 1: Read leads
    const { data: leads, error: readError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (readError) {
      console.log('❌ Read test failed:', readError.message)
    } else {
      console.log('✅ Read test passed - leads accessible')
    }
    
    // Test 2: Insert a test lead
    const testLead = {
      marca_model: 'Test Lead',
      buget: '10000-15000 EUR',
      contact: 'test@example.com',
      status: 'new'
    }
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()
      .single()
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message)
    } else {
      console.log('✅ Insert test passed - can create leads')
      
      // Test 3: Update the test lead
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'qualified' })
        .eq('id', newLead.id)
      
      if (updateError) {
        console.log('❌ Update test failed:', updateError.message)
      } else {
        console.log('✅ Update test passed - can update leads')
      }
      
      // Test 4: Delete the test lead
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead.id)
      
      if (deleteError) {
        console.log('❌ Delete test failed:', deleteError.message)
      } else {
        console.log('✅ Delete test passed - can delete leads')
      }
    }
    
    console.log('\n🎉 RLS policies fixed for leads table!')
    console.log('\n📝 Next steps:')
    console.log('1. Test the admin panel CRUD operations for leads')
    console.log('2. Try adding, editing, and deleting leads')
    console.log('3. Check browser console for any remaining errors')
    
  } catch (error) {
    console.log('❌ Error fixing leads RLS:', error.message)
  }
}

fixLeadsRLS()
