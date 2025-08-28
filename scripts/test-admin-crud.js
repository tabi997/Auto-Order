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

console.log('🧪 Testing Admin Panel CRUD Operations')
console.log('======================================\n')

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

async function testAdminCRUD() {
  try {
    console.log('\n🔍 Step 1: Checking current database state...')
    
    const { data: vehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.log('❌ Error fetching vehicles:', fetchError.message)
      return
    }
    
    console.log(`✅ Found ${vehicles?.length || 0} vehicles in database`)
    
    if (vehicles && vehicles.length > 0) {
      console.log('\n📋 Current vehicles:')
      vehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`)
      })
    }
    
    console.log('\n🔍 Step 2: Testing CREATE operation...')
    
    const newVehicle = {
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
    
    const { data: createdVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert(newVehicle)
      .select()
      .single()
    
    if (createError) {
      console.log('❌ CREATE test failed:', createError.message)
      console.log('Code:', createError.code)
      console.log('Details:', createError.details)
    } else {
      console.log('✅ CREATE test passed')
      console.log(`   Created vehicle: ${createdVehicle.make} ${createdVehicle.model} (ID: ${createdVehicle.id})`)
      
      console.log('\n🔍 Step 3: Testing UPDATE operation...')
      
      const updateData = {
        price_est: 6000,
        km: 1500
      }
      
      const { data: updatedVehicle, error: updateError } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', createdVehicle.id)
        .select()
        .single()
      
      if (updateError) {
        console.log('❌ UPDATE test failed:', updateError.message)
        console.log('Code:', updateError.code)
        console.log('Details:', updateError.details)
      } else {
        console.log('✅ UPDATE test passed')
        console.log(`   Updated vehicle: ${updatedVehicle.make} ${updatedVehicle.model}`)
        console.log(`   New price: ${updatedVehicle.price_est} €, New KM: ${updatedVehicle.km}`)
        
        console.log('\n🔍 Step 4: Testing DELETE operation...')
        
        const { error: deleteError } = await supabase
          .from('vehicles')
          .delete()
          .eq('id', createdVehicle.id)
        
        if (deleteError) {
          console.log('❌ DELETE test failed:', deleteError.message)
          console.log('Code:', deleteError.code)
        } else {
          console.log('✅ DELETE test passed')
          console.log(`   Deleted vehicle: ${createdVehicle.make} ${createdVehicle.model}`)
        }
      }
    }
    
    console.log('\n🔍 Step 5: Final database state...')
    
    const { data: finalVehicles, error: finalError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (finalError) {
      console.log('❌ Error fetching final state:', finalError.message)
    } else {
      console.log(`✅ Final state: ${finalVehicles?.length || 0} vehicles in database`)
      
      if (finalVehicles && finalVehicles.length > 0) {
        console.log('\n📋 Final vehicles:')
        finalVehicles.forEach((vehicle, index) => {
          console.log(`${index + 1}. ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`)
        })
      }
    }
    
    console.log('\n🎉 Admin Panel CRUD Test Complete!')
    
    if (createError || updateError || deleteError) {
      console.log('\n❌ Some CRUD operations failed')
      console.log('This suggests there are still database permission issues')
      console.log('Check the error details above for specific problems')
    } else {
      console.log('\n✅ All CRUD operations working perfectly!')
      console.log('The admin panel should now function correctly')
    }
    
    console.log('\n📝 Next steps:')
    console.log('1. Test the admin panel: http://localhost:3000/admin/login')
    console.log('2. Login with: admin@autoorder.ro / admin123')
    console.log('3. Try adding, editing, and deleting vehicles')
    console.log('4. Check browser console for any errors')
    
  } catch (error) {
    console.log('❌ Unexpected error during CRUD test:', error.message)
  }
}

testAdminCRUD()
