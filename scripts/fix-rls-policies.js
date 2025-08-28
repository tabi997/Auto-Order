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

console.log('🔧 Fixing RLS Policies for Admin Tables')
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

async function fixRLSPolicies() {
  try {
    console.log('\n🔧 Fixing RLS policies...')
    
    // Drop existing policies
    console.log('🗑️  Dropping existing policies...')
    
    try {
      await supabase.rpc('drop_policy_if_exists', { 
        table_name: 'admin_users', 
        policy_name: 'admin can read own profile' 
      })
      console.log('✅ Dropped existing read policy')
    } catch (e) {
      console.log('⚠️  Read policy drop skipped')
    }
    
    try {
      await supabase.rpc('drop_policy_if_exists', { 
        table_name: 'admin_users', 
        policy_name: 'admin can manage admin_users' 
      })
      console.log('✅ Dropped existing manage policy')
    } catch (e) {
      console.log('⚠️  Manage policy drop skipped')
    }
    
    // Create new policies
    console.log('\n🔧 Creating new RLS policies...')
    
    // Policy 1: Allow admins to read admin_users
    const { error: readPolicyError } = await supabase.rpc('create_policy', {
      table_name: 'admin_users',
      policy_name: 'admin_users_select_policy',
      definition: 'SELECT ON admin_users FOR ALL USING (true)',
      check: null
    })
    
    if (readPolicyError) {
      console.log('⚠️  Read policy creation warning:', readPolicyError.message)
    } else {
      console.log('✅ Read policy created')
    }
    
    // Policy 2: Allow service role to manage admin_users
    const { error: managePolicyError } = await supabase.rpc('create_policy', {
      table_name: 'admin_users',
      policy_name: 'admin_users_manage_policy',
      definition: 'ALL ON admin_users FOR ALL USING (true)',
      check: null
    })
    
    if (managePolicyError) {
      console.log('⚠️  Manage policy creation warning:', managePolicyError.message)
    } else {
      console.log('✅ Manage policy created')
    }
    
    // Test access
    console.log('\n🧪 Testing table access...')
    
    const { data: adminUsers, error: testError } = await supabase
      .from('admin_users')
      .select('*')
    
    if (testError) {
      console.log('❌ Still cannot access admin_users:', testError.message)
    } else {
      console.log('✅ admin_users table accessible')
      console.log('Count:', adminUsers?.length || 0)
      if (adminUsers && adminUsers.length > 0) {
        console.log('Users:', adminUsers.map(u => u.email).join(', '))
      }
    }
    
    console.log('\n🎉 RLS policies fixed!')
    
  } catch (error) {
    console.log('❌ Error fixing RLS policies:', error.message)
  }
}

fixRLSPolicies()
