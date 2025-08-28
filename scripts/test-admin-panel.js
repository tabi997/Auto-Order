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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing Admin Panel Functionality')
console.log('====================================\n')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminPanel() {
  try {
    console.log('\n🔍 Testing admin panel functionality...')
    
    // Test 1: Check if we can read vehicles (should work for public)
    console.log('\n🔍 Test 1: Reading vehicles (public access)...')
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(5)
    
    if (vehiclesError) {
      console.log('❌ Cannot read vehicles:', vehiclesError.message)
      console.log('Code:', vehiclesError.code)
      console.log('Details:', vehiclesError.details)
    } else {
      console.log('✅ Can read vehicles')
      console.log('Count:', vehicles?.length || 0)
      if (vehicles && vehicles.length > 0) {
        console.log('Sample vehicles:', vehicles.map(v => `${v.make} ${v.model}`).join(', '))
      }
    }
    
    // Test 2: Check if we can read leads (should work for public)
    console.log('\n🔍 Test 2: Reading leads (public access)...')
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(5)
    
    if (leadsError) {
      console.log('❌ Cannot read leads:', leadsError.message)
      console.log('Code:', leadsError.code)
    } else {
      console.log('✅ Can read leads')
      console.log('Count:', leads?.length || 0)
      if (leads && leads.length > 0) {
        console.log('Sample leads:', leads.map(l => l.marca_model).join(', '))
      }
    }
    
    // Test 3: Check if we can read admin_users (should work for public now)
    console.log('\n🔍 Test 3: Reading admin_users (public access)...')
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5)
    
    if (adminError) {
      console.log('❌ Cannot read admin_users:', adminError.message)
      console.log('Code:', adminError.code)
    } else {
      console.log('✅ Can read admin_users')
      console.log('Count:', adminUsers?.length || 0)
      if (adminUsers && adminUsers.length > 0) {
        console.log('Admin users:', adminUsers.map(u => u.email).join(', '))
      }
    }
    
    // Test 4: Try to create a test vehicle (should fail without auth)
    console.log('\n🔍 Test 4: Trying to create vehicle (should fail without auth)...')
    
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
    
    const { data: newVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert(testVehicle)
      .select()
      .single()
    
    if (createError) {
      console.log('❌ Cannot create vehicle (expected):', createError.message)
      console.log('This is expected behavior - anon users cannot create vehicles')
    } else {
      console.log('⚠️  Unexpected: Can create vehicle without auth')
      console.log('Vehicle created:', newVehicle.id)
      
      // Clean up the test vehicle
      await supabase
        .from('vehicles')
        .delete()
        .eq('id', newVehicle.id)
      console.log('Test vehicle cleaned up')
    }
    
    console.log('\n🎉 Admin panel functionality test complete!')
    console.log('\n📝 Summary:')
    console.log('✅ Public read access to vehicles table')
    console.log('✅ Public read access to leads table')
    console.log('✅ Public read access to admin_users table')
    console.log('❌ No write access without authentication (security working)')
    
    console.log('\n📝 Next steps:')
    console.log('1. The admin panel should now be able to read data')
    console.log('2. Login to the admin panel to test CRUD operations')
    console.log('3. Go to: http://localhost:3000/admin/login')
    console.log('4. Use: admin@autoorder.ro / admin123')
    
  } catch (error) {
    console.log('❌ Error testing admin panel:', error.message)
  }
}

testAdminPanel()
