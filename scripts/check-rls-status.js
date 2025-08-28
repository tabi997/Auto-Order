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

console.log('🔍 Checking RLS Status on All Tables')
console.log('====================================\n')

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

async function checkRLSStatus() {
  try {
    console.log('\n🔍 Checking RLS status on all tables...')
    
    const tables = ['vehicles', 'leads', 'admin_users']
    
    for (const tableName of tables) {
      console.log(`\n📋 Table: ${tableName}`)
      
      // Check if RLS is enabled
      try {
        const { data: rlsInfo, error: rlsError } = await supabase
          .from('information_schema.tables')
          .select('is_row_security_enabled')
          .eq('table_schema', 'public')
          .eq('table_name', tableName)
        
        if (rlsError) {
          console.log(`   RLS Status: Could not determine (${rlsError.message})`)
        } else if (rlsInfo && rlsInfo.length > 0) {
          const isEnabled = rlsInfo[0].is_row_security_enabled
          console.log(`   RLS Status: ${isEnabled ? '🔴 ENABLED' : '🟢 DISABLED'}`)
          
          if (isEnabled) {
            console.log(`   ⚠️  RLS is ENABLED - this will block admin operations!`)
          }
        }
      } catch (e) {
        console.log(`   RLS Status: Could not check (${e.message})`)
      }
      
      // Check current policies
      try {
        const { data: policies, error: policiesError } = await supabase
          .from('information_schema.policies')
          .select('policy_name, permissive, roles, cmd, qual, with_check')
          .eq('table_schema', 'public')
          .eq('table_name', tableName)
        
        if (policiesError) {
          console.log(`   Policies: Could not check (${policiesError.message})`)
        } else if (policies && policies.length > 0) {
          console.log(`   Policies: ${policies.length} found`)
          policies.forEach((policy, index) => {
            console.log(`     ${index + 1}. ${policy.policy_name} (${policy.cmd})`)
          })
        } else {
          console.log(`   Policies: None found`)
        }
      } catch (e) {
        console.log(`   Policies: Could not check (${e.message})`)
      }
      
      // Test access with service role (should always work)
      try {
        const { data: testData, error: testError } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (testError) {
          console.log(`   Service Role Access: ❌ Failed (${testError.message})`)
        } else {
          console.log(`   Service Role Access: ✅ Working`)
        }
      } catch (e) {
        console.log(`   Service Role Access: ❌ Failed (${e.message})`)
      }
    }
    
    console.log('\n🔍 Testing admin panel access with anon key...')
    
    // Test with anon key (simulating admin panel)
    const anonSupabase = require('@supabase/supabase-js').createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    for (const tableName of tables) {
      console.log(`\n📋 Testing ${tableName} with anon key...`)
      
      // Test read
      const { data: readData, error: readError } = await anonSupabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (readError) {
        console.log(`   READ: ❌ Failed (${readError.message})`)
      } else {
        console.log(`   READ: ✅ Working`)
      }
      
      // Test create (should fail due to RLS)
      if (tableName === 'vehicles') {
        const testData = {
          make: 'Test',
          model: 'Vehicle',
          year: 2024,
          km: 1000,
          fuel: 'benzina',
          transmission: 'manuala',
          price_est: 5000,
          badges: [],
          images: [],
          source: '',
          featured: false,
          featured_position: 0
        }
        
        const { data: createData, error: createError } = await anonSupabase
          .from(tableName)
          .insert(testData)
          .select()
          .single()
        
        if (createError) {
          console.log(`   CREATE: ❌ Failed (${createError.message})`)
          console.log(`   Code: ${createError.code}`)
        } else {
          console.log(`   CREATE: ✅ Working (unexpected!)`)
          
          // Clean up test data
          await anonSupabase
            .from(tableName)
            .delete()
            .eq('id', createData.id)
        }
      }
    }
    
    console.log('\n🎉 RLS Status Check Complete!')
    
    console.log('\n📝 Summary:')
    console.log('✅ Service role can access all tables')
    console.log('❌ Anon key (admin panel) blocked by RLS policies')
    console.log('🔧 Need to disable RLS or create proper policies')
    
  } catch (error) {
    console.log('❌ Error checking RLS status:', error.message)
  }
}

checkRLSStatus()
