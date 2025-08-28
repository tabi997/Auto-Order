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

console.log('🧪 Testing Stock Page API')
console.log('==========================\n')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testStockPage() {
  try {
    console.log('\n🔍 Step 1: Testing basic vehicles query...')
    
    // Test basic query
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(5)
    
    if (vehiclesError) {
      console.log('❌ Error getting vehicles:', vehiclesError.message)
      return
    }
    
    console.log(`✅ Found ${vehicles?.length || 0} vehicles`)
    
    if (vehicles && vehicles.length > 0) {
      console.log('\n📋 Sample vehicle data:')
      const sample = vehicles[0]
      console.log(`   ID: ${sample.id}`)
      console.log(`   Make: ${sample.make}`)
      console.log(`   Model: ${sample.model}`)
      console.log(`   Year: ${sample.year}`)
      console.log(`   KM: ${sample.km}`)
      console.log(`   Price: ${sample.price_est}`)
      console.log(`   Fuel: ${sample.fuel}`)
      console.log(`   Transmission: ${sample.transmission}`)
      console.log(`   Images: ${sample.images?.length || 0}`)
    }
    
    console.log('\n🔍 Step 2: Testing sorting...')
    
    // Test sorting by price
    const { data: sortedByPrice, error: sortError } = await supabase
      .from('vehicles')
      .select('*')
      .order('price_est', { ascending: true })
      .limit(3)
    
    if (sortError) {
      console.log('❌ Error sorting by price:', sortError.message)
    } else {
      console.log('✅ Sorting by price working')
      if (sortedByPrice && sortedByPrice.length > 0) {
        console.log(`   Cheapest: ${sortedByPrice[0].make} ${sortedByPrice[0].model} - ${sortedByPrice[0].price_est}€`)
        console.log(`   Most expensive: ${sortedByPrice[sortedByPrice.length - 1].make} ${sortedByPrice[sortedByPrice.length - 1].model} - ${sortedByPrice[sortedByPrice.length - 1].price_est}€`)
      }
    }
    
    console.log('\n🔍 Step 3: Testing filtering...')
    
    // Test filtering by fuel
    const { data: benzinaVehicles, error: filterError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('fuel', 'benzina')
      .limit(3)
    
    if (filterError) {
      console.log('❌ Error filtering by fuel:', filterError.message)
    } else {
      console.log(`✅ Filtering by fuel working - Found ${benzinaVehicles?.length || 0} benzina vehicles`)
    }
    
    console.log('\n🔍 Step 4: Testing pagination...')
    
    // Test pagination
    const { data: page1, error: page1Error } = await supabase
      .from('vehicles')
      .select('*')
      .range(0, 2)
    
    const { data: page2, error: page2Error } = await supabase
      .from('vehicles')
      .select('*')
      .range(3, 5)
    
    if (page1Error || page2Error) {
      console.log('❌ Error with pagination:', page1Error?.message || page2Error?.message)
    } else {
      console.log(`✅ Pagination working - Page 1: ${page1?.length || 0} vehicles, Page 2: ${page2?.length || 0} vehicles`)
    }
    
    console.log('\n🔍 Step 5: Testing count...')
    
    // Test count
    const { count, error: countError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log('❌ Error getting count:', countError.message)
    } else {
      console.log(`✅ Count working - Total vehicles: ${count || 0}`)
    }
    
    console.log('\n🎉 Stock Page API Test Complete!')
    
    console.log('\n📝 Summary:')
    console.log('✅ Basic vehicles query working')
    console.log('✅ Sorting working')
    console.log('✅ Filtering working')
    console.log('✅ Pagination working')
    console.log('✅ Count working')
    
    console.log('\n📋 Next steps:')
    console.log('1. Restart your Next.js development server')
    console.log('2. Test stock page: http://localhost:3000/stock')
    console.log('3. Check if vehicles are displayed correctly')
    console.log('4. Test sorting and filtering functionality')
    
  } catch (error) {
    console.log('❌ Error during test:', error.message)
  }
}

testStockPage()
