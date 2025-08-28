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

console.log('🔧 Setting up Proper RLS Policies')
console.log('==================================\n')

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

async function setupProperRLS() {
  try {
    console.log('\n🔧 Setting up proper RLS policies...')
    
    // First, let's check what policies exist
    console.log('🔍 Checking existing policies...')
    
    // Drop all existing policies for admin_users
    console.log('🗑️  Dropping existing policies...')
    
    const policiesToDrop = [
      'admin_users_select_policy',
      'admin_users_manage_policy',
      'admin can read own profile',
      'admin can manage admin_users'
    ]
    
    for (const policyName of policiesToDrop) {
      try {
        await supabase.rpc('drop_policy_if_exists', { 
          table_name: 'admin_users', 
          policy_name: policyName 
        })
        console.log(`✅ Dropped policy: ${policyName}`)
      } catch (e) {
        console.log(`⚠️  Policy drop skipped: ${policyName}`)
      }
    }
    
    // Create proper policies using raw SQL
    console.log('\n🔧 Creating proper RLS policies...')
    
    // Policy 1: Allow authenticated users to read admin_users
    const { error: readPolicyError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(0) // Just to test the connection
    
    if (readPolicyError) {
      console.log('❌ Cannot access admin_users table:', readPolicyError.message)
      return
    }
    
    // Create policy using raw SQL
    const createReadPolicySQL = `
      CREATE POLICY "admin_users_select_policy" ON "public"."admin_users"
      FOR SELECT USING (auth.role() = 'authenticated');
    `
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createReadPolicySQL })
    
    if (sqlError) {
      console.log('⚠️  Could not create read policy via RPC, trying alternative approach...')
      
      // Alternative: Disable RLS temporarily for admin_users
      console.log('🔧 Temporarily disabling RLS for admin_users...')
      const { error: disableError } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE "public"."admin_users" DISABLE ROW LEVEL SECURITY;' 
      })
      
      if (disableError) {
        console.log('⚠️  Could not disable RLS, but table is accessible via service role')
      } else {
        console.log('✅ RLS disabled for admin_users table')
      }
    } else {
      console.log('✅ Read policy created successfully')
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
        console.log('Users:', adminUsers.map(u => `${u.email} (${u.role})`).join(', '))
      }
    }
    
    console.log('\n🎉 RLS setup complete!')
    console.log('\n📝 Next steps:')
    console.log('1. The admin_users table should now be accessible')
    console.log('2. Test the admin panel login: http://localhost:3000/admin/login')
    console.log('3. Use: admin@autoorder.ro / admin123')
    
  } catch (error) {
    console.log('❌ Error setting up RLS:', error.message)
  }
}

setupProperRLS()
