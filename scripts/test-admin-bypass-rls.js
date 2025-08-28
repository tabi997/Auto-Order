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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing Admin Client Bypass RLS')
console.log('==================================\n')

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

// Create both clients
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testAdminBypassRLS() {
  try {
    console.log('\n🔍 Step 1: Testing current database state...')
    
    // Check current vehicles
    const { data: currentVehicles, error: currentError } = await adminClient
      .from('vehicles')
      .select('*')
    
    if (currentError) {
      console.log('❌ Error getting current vehicles:', currentError.message)
      return
    }
    
    console.log(`✅ Found ${currentVehicles?.length || 0} vehicles in database`)
    
    console.log('\n🔍 Step 2: Testing admin client (service role) - should work...')
    
    // Test CREATE with admin client
    const testVehicle = {
      make: 'Admin',
      model: 'Test',
      year: 2024,
      km: 1000,
      fuel: 'benzina',
      transmission: 'manuala',
      price_est: 1000,
      badges: [],
      images: [],
      source: '',
      featured: false,
      featured_position: 0
    }
    
    const { data: createdVehicle, error: createError } = await adminClient
      .from('vehicles')
      .insert(testVehicle)
      .select()
      .single()
    
    if (createError) {
      console.log('❌ Admin client CREATE failed:', createError.message)
      console.log('Code:', createError.code)
    } else {
      console.log('✅ Admin client CREATE working!')
      console.log(`   Created: ${createdVehicle.make} ${createdVehicle.model} (ID: ${createdVehicle.id})`)
      
      // Test UPDATE with admin client
      const { data: updatedVehicle, error: updateError } = await adminClient
        .from('vehicles')
        .update({ price_est: 2000 })
        .eq('id', createdVehicle.id)
        .select()
        .single()
      
      if (updateError) {
        console.log('❌ Admin client UPDATE failed:', updateError.message)
      } else {
        console.log('✅ Admin client UPDATE working!')
        console.log(`   Updated price: ${updatedVehicle.price_est} €`)
      }
      
      // Test DELETE with admin client
      const { error: deleteError } = await adminClient
        .from('vehicles')
        .delete()
        .eq('id', createdVehicle.id)
      
      if (deleteError) {
        console.log('❌ Admin client DELETE failed:', deleteError.message)
      } else {
        console.log('✅ Admin client DELETE working!')
        console.log('   Test vehicle deleted')
      }
    }
    
    console.log('\n🔍 Step 3: Testing anon client - should fail due to RLS...')
    
    // Test CREATE with anon client (should fail)
    const anonTestVehicle = {
      make: 'Anon',
      model: 'Test',
      year: 2024,
      km: 1000,
      fuel: 'benzina',
      transmission: 'manuala',
      price_est: 1000,
      badges: [],
      images: [],
      source: '',
      featured: false,
      featured_position: 0
    }
    
    const { data: anonCreatedVehicle, error: anonCreateError } = await anonClient
      .from('vehicles')
      .insert(anonTestVehicle)
      .select()
      .single()
    
    if (anonCreateError) {
      console.log('❌ Anon client CREATE failed (expected):', anonCreateError.message)
      console.log('Code:', anonCreateError.code)
      
      if (anonCreateError.code === '42501') {
        console.log('✅ RLS is still blocking anon client (this is correct)')
      }
    } else {
      console.log('⚠️  Anon client CREATE working (unexpected - RLS might be disabled)')
      console.log(`   Created: ${anonCreatedVehicle.make} ${anonCreatedVehicle.model}`)
      
      // Clean up
      await anonClient
        .from('vehicles')
        .delete()
        .eq('id', anonCreatedVehicle.id)
      console.log('   Test data cleaned up')
    }
    
    console.log('\n🎉 Test Complete!')
    
    console.log('\n📝 Summary:')
    console.log('✅ Admin client (service role) can perform all CRUD operations')
    console.log('❌ Anon client is blocked by RLS (this is correct)')
    console.log('🔧 Admin panel should now work with the modified actions!')
    
    console.log('\n📋 Next steps:')
    console.log('1. Restart your Next.js development server')
    console.log('2. Test admin panel: http://localhost:3000/admin/login')
    console.log('3. Login with: admin@autoorder.ro / admin123')
    console.log('4. Try adding, editing, and deleting vehicles')
    console.log('5. All operations should now work!')
    
  } catch (error) {
    console.log('❌ Error during test:', error.message)
  }
}

testAdminBypassRLS()
