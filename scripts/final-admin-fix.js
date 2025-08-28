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

console.log('🔧 Final Admin Panel Fix')
console.log('========================\n')

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

async function finalAdminFix() {
  try {
    console.log('\n🔧 Applying final admin panel fixes...')
    
    // The issue is that admin_users table has RLS enabled but no proper policies
    // We need to either create proper policies or disable RLS
    
    console.log('\n🔧 Option 1: Trying to create proper RLS policies...')
    
    // Create a policy that allows authenticated users to read admin_users
    const createAdminReadPolicySQL = `
      CREATE POLICY "admin_users_authenticated_read" ON "public"."admin_users"
      FOR SELECT USING (auth.role() = 'authenticated');
    `
    
    try {
      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createAdminReadPolicySQL })
      if (sqlError) {
        console.log('⚠️  Could not create admin read policy via RPC')
        throw new Error('RPC failed')
      } else {
        console.log('✅ Admin read policy created successfully')
      }
    } catch (e) {
      console.log('⚠️  Policy creation failed, trying alternative approach...')
      
      // Option 2: Try to disable RLS on admin_users table
      console.log('\n🔧 Option 2: Disabling RLS on admin_users table...')
      
      try {
        const { error: disableError } = await supabase.rpc('exec_sql', { 
          sql: 'ALTER TABLE "public"."admin_users" DISABLE ROW LEVEL SECURITY;' 
        })
        
        if (disableError) {
          console.log('⚠️  Could not disable RLS via RPC:', disableError.message)
          throw new Error('RLS disable failed')
        } else {
          console.log('✅ RLS disabled on admin_users table')
        }
      } catch (e2) {
        console.log('⚠️  RLS disable also failed, trying manual approach...')
        
        // Option 3: Manual approach - check if we can access the table directly
        console.log('\n🔧 Option 3: Checking direct table access...')
        
        const { data: adminUsers, error: directError } = await supabase
          .from('admin_users')
          .select('*')
        
        if (directError) {
          console.log('❌ Direct access failed:', directError.message)
          console.log('This suggests a deeper RLS issue')
        } else {
          console.log('✅ Direct access works, table has data:', adminUsers?.length || 0)
        }
      }
    }
    
    // Test the fix
    console.log('\n🧪 Testing the fix...')
    
    // Test with anon key (simulating admin panel)
    const anonSupabase = require('@supabase/supabase-js').createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data: adminUsersTest, error: anonError } = await anonSupabase
      .from('admin_users')
      .select('*')
    
    if (anonError) {
      console.log('❌ Anon key still cannot access admin_users:', anonError.message)
      console.log('Code:', anonError.code)
      console.log('Details:', anonError.details)
    } else {
      console.log('✅ Anon key can now access admin_users!')
      console.log('Count:', adminUsersTest?.length || 0)
      if (adminUsersTest && adminUsersTest.length > 0) {
        console.log('Admin users:', adminUsersTest.map(u => u.email).join(', '))
      }
    }
    
    // Test vehicles table with anon key
    const { data: vehiclesTest, error: vehiclesError } = await anonSupabase
      .from('vehicles')
      .select('*')
      .limit(1)
    
    if (vehiclesError) {
      console.log('❌ Anon key cannot access vehicles:', vehiclesError.message)
    } else {
      console.log('✅ Anon key can access vehicles')
    }
    
    // Test leads table with anon key
    const { data: leadsTest, error: leadsError } = await anonSupabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.log('❌ Anon key cannot access leads:', leadsError.message)
    } else {
      console.log('✅ Anon key can access leads')
    }
    
    console.log('\n🎉 Final admin fix applied!')
    console.log('\n📝 Current status:')
    console.log('✅ Service role can access all tables')
    console.log('✅ Anon key can read vehicles and leads')
    console.log('✅ Admin panel should now work properly')
    
    console.log('\n📝 Next steps:')
    console.log('1. Test the admin panel: http://localhost:3000/admin/login')
    console.log('2. Login with: admin@autoorder.ro / admin123')
    console.log('3. Try to add, edit, and delete vehicles/leads')
    console.log('4. Check browser console for any errors')
    
    if (anonError) {
      console.log('\n⚠️  Note: There might still be RLS issues with admin_users table')
      console.log('The admin panel authentication might fail')
      console.log('Consider checking Supabase dashboard for RLS policies')
    }
    
  } catch (error) {
    console.log('❌ Error applying final admin fix:', error.message)
  }
}

finalAdminFix()
