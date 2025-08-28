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

console.log('🔍 Checking Current Vehicles in Database')
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

async function checkVehicles() {
  try {
    console.log('\n🔍 Checking all vehicles in database...')
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (vehiclesError) {
      console.log('❌ Error fetching vehicles:', vehiclesError.message)
      return
    }
    
    console.log(`✅ Found ${vehicles?.length || 0} vehicles in database`)
    
    if (vehicles && vehicles.length > 0) {
      console.log('\n📋 Vehicle Details:')
      vehicles.forEach((vehicle, index) => {
        console.log(`\n${index + 1}. ${vehicle.make} ${vehicle.model}`)
        console.log(`   ID: ${vehicle.id}`)
        console.log(`   Year: ${vehicle.year}`)
        console.log(`   KM: ${vehicle.km.toLocaleString()}`)
        console.log(`   Price: ${vehicle.price_est.toLocaleString()} €`)
        console.log(`   Fuel: ${vehicle.fuel}`)
        console.log(`   Transmission: ${vehicle.transmission}`)
        console.log(`   Featured: ${vehicle.featured ? 'Yes' : 'No'}`)
        console.log(`   Created: ${new Date(vehicle.created_at).toLocaleString()}`)
        console.log(`   Updated: ${new Date(vehicle.updated_at).toLocaleString()}`)
      })
    } else {
      console.log('❌ No vehicles found in database')
    }
    
    // Check for any duplicate or invalid data
    console.log('\n🔍 Checking for data issues...')
    
    if (vehicles && vehicles.length > 0) {
      const ids = vehicles.map(v => v.id)
      const uniqueIds = [...new Set(ids)]
      
      if (ids.length !== uniqueIds.length) {
        console.log('⚠️  Warning: Duplicate IDs found!')
      } else {
        console.log('✅ All vehicle IDs are unique')
      }
      
      // Check for vehicles with missing required fields
      const invalidVehicles = vehicles.filter(v => 
        !v.make || !v.model || !v.year || !v.km || !v.price_est
      )
      
      if (invalidVehicles.length > 0) {
        console.log(`⚠️  Warning: ${invalidVehicles.length} vehicles with missing required fields`)
        invalidVehicles.forEach(v => {
          console.log(`   - ${v.make} ${v.model} (ID: ${v.id})`)
        })
      } else {
        console.log('✅ All vehicles have required fields')
      }
    }
    
    console.log('\n🎉 Vehicle check complete!')
    
  } catch (error) {
    console.log('❌ Error checking vehicles:', error.message)
  }
}

checkVehicles()
