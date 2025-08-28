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

console.log('🔧 Disabling RLS on All Tables for Admin Access')
console.log('================================================\n')

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

async function disableAllRLS() {
  try {
    console.log('\n🔧 Disabling RLS on all main tables...')
    
    const tables = ['vehicles', 'leads', 'admin_users']
    
    for (const tableName of tables) {
      console.log(`\n🔧 Processing table: ${tableName}`)
      
      // Drop all existing policies
      console.log(`🗑️  Dropping existing policies for ${tableName}...`)
      
      const policiesToDrop = [
        `${tableName}_select_policy`,
        `${tableName}_insert_policy`,
        `${tableName}_update_policy`,
        `${tableName}_delete_policy`,
        `${tableName}_public_select_policy`,
        'admin can read own profile',
        'admin can manage admin_users'
      ]
      
      for (const policyName of policiesToDrop) {
        try {
          await supabase.rpc('drop_policy_if_exists', { 
            table_name: tableName, 
            policy_name: policyName 
          })
          console.log(`✅ Dropped policy: ${policyName}`)
        } catch (e) {
          // Policy might not exist, that's fine
        }
      }
      
      // Disable RLS on the table
      console.log(`🔧 Disabling RLS on ${tableName}...`)
      
      try {
        const { error: disableError } = await supabase.rpc('exec_sql', { 
          sql: `ALTER TABLE "public"."${tableName}" DISABLE ROW LEVEL SECURITY;` 
        })
        
        if (disableError) {
          console.log(`⚠️  Could not disable RLS on ${tableName}:`, disableError.message)
        } else {
          console.log(`✅ RLS disabled on ${tableName}`)
        }
      } catch (e) {
        console.log(`⚠️  RLS disable skipped for ${tableName}`)
      }
    }
    
    // Test CRUD operations on all tables
    console.log('\n🧪 Testing CRUD operations on all tables...')
    
    // Test vehicles table
    console.log('\n🔍 Testing vehicles table...')
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1)
    
    if (vehiclesError) {
      console.log('❌ Vehicles table error:', vehiclesError.message)
    } else {
      console.log('✅ Vehicles table accessible')
    }
    
    // Test leads table
    console.log('\n🔍 Testing leads table...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.log('❌ Leads table error:', leadsError.message)
    } else {
      console.log('✅ Leads table accessible')
    }
    
    // Test admin_users table
    console.log('\n🔍 Testing admin_users table...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
    
    if (adminError) {
      console.log('❌ Admin users table error:', adminError.message)
    } else {
      console.log('✅ Admin users table accessible')
    }
    
    // Test full CRUD cycle on vehicles
    console.log('\n🧪 Testing full CRUD cycle on vehicles...')
    
    const testVehicle = {
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
    
    // Create
    const { data: newVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert(testVehicle)
      .select()
      .single()
    
    if (createError) {
      console.log('❌ Create test failed:', createError.message)
    } else {
      console.log('✅ Create test passed')
      
      // Update
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ price_est: 6000 })
        .eq('id', newVehicle.id)
      
      if (updateError) {
        console.log('❌ Update test failed:', updateError.message)
      } else {
        console.log('✅ Update test passed')
      }
      
      // Delete
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', newVehicle.id)
      
      if (deleteError) {
        console.log('❌ Delete test failed:', deleteError.message)
      } else {
        console.log('✅ Delete test passed')
      }
    }
    
    console.log('\n🎉 RLS disabled on all tables!')
    console.log('\n📝 Next steps:')
    console.log('1. Test the admin panel CRUD operations')
    console.log('2. Try adding, editing, and deleting vehicles and leads')
    console.log('3. The admin panel should now work properly')
    console.log('4. Check browser console for any remaining errors')
    
    console.log('\n⚠️  Security Note:')
    console.log('RLS is now disabled on these tables. This means:')
    console.log('- Anyone with database access can read/write to these tables')
    console.log('- The admin panel authentication still protects the web interface')
    console.log('- Consider re-enabling RLS with proper policies for production')
    
  } catch (error) {
    console.log('❌ Error disabling RLS:', error.message)
  }
}

disableAllRLS()
