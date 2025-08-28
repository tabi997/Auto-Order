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

console.log('🔐 Testing Admin Access with Service Role')
console.log('=========================================\n')

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

async function testAdminAccess() {
  try {
    console.log('\n🔍 Testing admin_users table with service role...')
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
    
    if (adminError) {
      console.log('❌ admin_users table error:', adminError.message)
      console.log('Code:', adminError.code)
      console.log('Details:', adminError.details)
    } else {
      console.log('✅ admin_users table accessible with service role')
      console.log('Count:', adminUsers?.length || 0)
      if (adminUsers && adminUsers.length > 0) {
        console.log('Users:', adminUsers.map(u => `${u.email} (${u.role})`).join(', '))
      }
    }
    
    console.log('\n🔍 Testing vehicles table with service role...')
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(3)
    
    if (vehiclesError) {
      console.log('❌ vehicles table error:', vehiclesError.message)
    } else {
      console.log('✅ vehicles table accessible with service role')
      console.log('Count:', vehicles?.length || 0)
      if (vehicles && vehicles.length > 0) {
        console.log('Sample vehicles:', vehicles.map(v => `${v.make} ${v.model}`).join(', '))
      }
    }
    
    console.log('\n🔍 Testing leads table with service role...')
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(3)
    
    if (leadsError) {
      console.log('❌ leads table error:', leadsError.message)
    } else {
      console.log('✅ leads table accessible with service role')
      console.log('Count:', leads?.length || 0)
      if (leads && leads.length > 0) {
        console.log('Sample leads:', leads.map(l => l.marca_model).join(', '))
      }
    }
    
    console.log('\n🎉 Service role access test complete!')
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

testAdminAccess()
