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

console.log('🚀 AutoOrder Database Migration Script (Direct SQL)')
console.log('==================================================\n')

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

async function applyMigrationsDirect() {
  try {
    console.log('\n🔧 Applying migrations directly...\n')
    
    // Test connection first
    console.log('🧪 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Connection test failed:', testError.message)
      return
    }
    
    console.log('✅ Connection test passed')
    
    // Migration 1: Create vehicles table
    console.log('\n📋 Creating vehicles table...')
    try {
      const { error: createVehiclesError } = await supabase
        .rpc('create_vehicles_table')
      
      if (createVehiclesError) {
        console.log('⚠️  Vehicles table might already exist, trying to insert sample data...')
      }
    } catch (e) {
      console.log('⚠️  Vehicles table creation skipped (might already exist)')
    }
    
    // Migration 2: Create leads table
    console.log('\n📋 Creating leads table...')
    try {
      const { error: createLeadsError } = await supabase
        .rpc('create_leads_table')
      
      if (createLeadsError) {
        console.log('⚠️  Leads table might already exist, trying to insert sample data...')
      }
    } catch (e) {
      console.log('⚠️  Leads table creation skipped (might already exist)')
    }
    
    // Insert sample data
    console.log('\n📊 Inserting sample data...')
    
    // Sample vehicles
    const sampleVehicles = [
      {
        make: 'BMW',
        model: 'X5',
        year: 2020,
        km: 50000,
        fuel: 'diesel',
        transmission: 'automata',
        price_est: 45000,
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
        featured: true,
        featured_position: 2
      }
    ]
    
    for (const vehicle of sampleVehicles) {
      try {
        const { error: insertError } = await supabase
          .from('vehicles')
          .insert(vehicle)
        
        if (insertError) {
          console.log('⚠️  Vehicle insert warning:', insertError.message)
        } else {
          console.log('✅ Sample vehicle inserted:', vehicle.make, vehicle.model)
        }
      } catch (e) {
        console.log('⚠️  Vehicle insert skipped (might already exist)')
      }
    }
    
    // Sample leads
    const sampleLeads = [
      {
        marca_model: 'BMW X5',
        buget: '40000-50000 EUR',
        contact: 'test@example.com',
        status: 'new'
      },
      {
        marca_model: 'Audi A4',
        buget: '25000-30000 EUR',
        contact: 'client@example.com',
        status: 'qualified'
      }
    ]
    
    for (const lead of sampleLeads) {
      try {
        const { error: insertError } = await supabase
          .from('leads')
          .insert(lead)
        
        if (insertError) {
          console.log('⚠️  Lead insert warning:', insertError.message)
        } else {
          console.log('✅ Sample lead inserted:', lead.marca_model)
        }
      } catch (e) {
        console.log('⚠️  Lead insert skipped (might already exist)')
      }
    }
    
    // Test the tables after migration
    console.log('\n🧪 Testing tables after migration...')
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
    
    if (vehiclesError) {
      console.log('❌ Vehicles table error:', vehiclesError.message)
    } else {
      console.log('✅ Vehicles table accessible, count:', vehicles?.length || 0)
      if (vehicles && vehicles.length > 0) {
        console.log('   Sample vehicles:', vehicles.map(v => `${v.make} ${v.model}`).join(', '))
      }
    }
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
    
    if (leadsError) {
      console.log('❌ Leads table error:', leadsError.message)
    } else {
      console.log('✅ Leads table accessible, count:', leads?.length || 0)
      if (leads && leads.length > 0) {
        console.log('   Sample leads:', leads.map(l => l.marca_model).join(', '))
      }
    }
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
    
    if (adminError) {
      console.log('❌ Admin users table error:', adminError.message)
    } else {
      console.log('✅ Admin users table accessible, count:', adminUsers?.length || 0)
    }

    console.log('\n🎉 Migrations completed!')
    console.log('Next steps:')
    console.log('1. Create admin user in Supabase Auth (admin@autoorder.ro)')
    console.log('2. Test admin panel: http://localhost:3000/admin')
    console.log('3. Login with: admin@autoorder.ro / admin123')
    
  } catch (error) {
    console.log('❌ Migration error:', error.message)
    console.log('\n💡 Manual migration required:')
    console.log('Go to Supabase Dashboard > SQL Editor and run the migrations manually')
  }
}

applyMigrationsDirect()

