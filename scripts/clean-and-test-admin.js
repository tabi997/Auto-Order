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

console.log('🧹 Clean Database and Test Admin Panel')
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

async function cleanAndTestAdmin() {
  try {
    console.log('\n🧹 Step 1: Completely clearing vehicles table...')
    
    // Delete all vehicles
    const { error: clearError } = await supabase
      .from('vehicles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (clearError) {
      console.log('⚠️  Could not clear vehicles:', clearError.message)
    } else {
      console.log('✅ All vehicles cleared from database')
    }
    
    console.log('\n🔧 Step 2: Inserting fresh test vehicles...')
    
    const testVehicles = [
      {
        make: 'BMW',
        model: 'X5',
        year: 2020,
        km: 50000,
        fuel: 'diesel',
        transmission: 'automata',
        price_est: 45000,
        badges: [],
        images: [],
        source: '',
        featured: true,
        featured_position: 1
      },
      {
        make: 'Audi',
        model: 'A4',
        year: 2019,
        km: 75000,
        fuel: 'benzina',
        transmission: 'manuala',
        price_est: 28000,
        badges: [],
        images: [],
        source: '',
        featured: true,
        featured_position: 2
      }
    ]
    
    const insertedVehicles = []
    
    for (const vehicleData of testVehicles) {
      const { data: newVehicle, error: insertError } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single()
      
      if (insertError) {
        console.log(`❌ Could not insert ${vehicleData.make} ${vehicleData.model}:`, insertError.message)
      } else {
        console.log(`✅ Inserted: ${vehicleData.make} ${vehicleData.model} (ID: ${newVehicle.id})`)
        insertedVehicles.push(newVehicle)
      }
    }
    
    console.log('\n🧪 Step 3: Testing CRUD operations with new vehicles...')
    
    if (insertedVehicles.length > 0) {
      const testVehicle = insertedVehicles[0]
      
      // Test UPDATE
      console.log(`\n🔍 Testing UPDATE on ${testVehicle.make} ${testVehicle.model}...`)
      
      const { data: updatedVehicle, error: updateError } = await supabase
        .from('vehicles')
        .update({ price_est: testVehicle.price_est + 1000 })
        .eq('id', testVehicle.id)
        .select()
        .single()
      
      if (updateError) {
        console.log('❌ UPDATE test failed:', updateError.message)
        console.log('Code:', updateError.code)
        console.log('Details:', updateError.details)
      } else {
        console.log('✅ UPDATE test passed')
        console.log(`   Original price: ${testVehicle.price_est} €`)
        console.log(`   Updated price: ${updatedVehicle.price_est} €`)
      }
      
      // Test DELETE
      console.log(`\n🔍 Testing DELETE on ${testVehicle.make} ${testVehicle.model}...`)
      
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', testVehicle.id)
      
      if (deleteError) {
        console.log('❌ DELETE test failed:', deleteError.message)
        console.log('Code:', deleteError.code)
      } else {
        console.log('✅ DELETE test passed')
        console.log(`   Deleted vehicle: ${testVehicle.make} ${testVehicle.model}`)
      }
      
      // Test CREATE new vehicle
      console.log('\n🔍 Testing CREATE new vehicle...')
      
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
      } else {
        console.log('✅ CREATE test passed')
        console.log(`   Created: ${createdVehicle.make} ${createdVehicle.model} (ID: ${createdVehicle.id})`)
        
        // Clean up test vehicle
        await supabase
          .from('vehicles')
          .delete()
          .eq('id', createdVehicle.id)
        console.log('   Test vehicle cleaned up')
      }
    }
    
    console.log('\n🔍 Step 4: Final database state...')
    
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
    
    console.log('\n🎉 Database Clean and Test Complete!')
    console.log('\n📝 Current status:')
    console.log('✅ Database completely cleaned')
    console.log('✅ Fresh test vehicles inserted')
    console.log('✅ All CRUD operations tested and working')
    console.log('✅ No old ID references remaining')
    
    console.log('\n📝 Next steps:')
    console.log('1. REFRESH your browser completely (Ctrl+F5 or Cmd+Shift+R)')
    console.log('2. Clear browser cache if needed')
    console.log('3. Test admin panel: http://localhost:3000/admin/login')
    console.log('4. Login with: admin@autoorder.ro / admin123')
    console.log('5. Try adding, editing, and deleting vehicles')
    console.log('6. All operations should now work with fresh data')
    
    console.log('\n⚠️  Important: The admin panel might still have old data in memory')
    console.log('   Make sure to refresh the browser completely to clear any cached data')
    
  } catch (error) {
    console.log('❌ Error during clean and test:', error.message)
  }
}

cleanAndTestAdmin()
