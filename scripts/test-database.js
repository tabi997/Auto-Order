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
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Database Connection')
console.log('==============================\n')

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n🔍 Testing basic connection...')
    
    // Test 1: Check if we can connect
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth test:', authError ? `❌ ${authError.message}` : '✅ Connected')
    
    // Test 2: Check if vehicles table exists
    console.log('\n🔍 Testing vehicles table...')
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1)
    
    if (vehiclesError) {
      console.log('❌ Vehicles table error:', vehiclesError.message)
      console.log('Code:', vehiclesError.code)
      console.log('Details:', vehiclesError.details)
      console.log('Hint:', vehiclesError.hint)
    } else {
      console.log('✅ Vehicles table accessible')
      console.log('Data:', vehicles)
    }
    
    // Test 3: Check if leads table exists
    console.log('\n🔍 Testing leads table...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.log('❌ Leads table error:', leadsError.message)
      console.log('Code:', leadsError.code)
    } else {
      console.log('✅ Leads table accessible')
      console.log('Data:', leads)
    }
    
    // Test 4: Check if admin_users table exists
    console.log('\n🔍 Testing admin_users table...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
    
    if (adminError) {
      console.log('❌ Admin users table error:', adminError.message)
      console.log('Code:', adminError.code)
    } else {
      console.log('✅ Admin users table accessible')
      console.log('Data:', adminUsers)
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

testConnection()
