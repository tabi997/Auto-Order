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

console.log('🔐 Setting up Admin User in Supabase Auth')
console.log('==========================================\n')

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

async function setupAdminUser() {
  try {
    console.log('\n🔍 Checking if admin user exists...')
    
    // Check if admin user already exists
    const { data: existingUser, error: searchError } = await supabase.auth.admin.listUsers()
    
    if (searchError) {
      console.log('❌ Error searching for users:', searchError.message)
      return
    }
    
    const adminUser = existingUser.users.find(user => user.email === 'admin@autoorder.ro')
    
    if (adminUser) {
      console.log('✅ Admin user already exists:', adminUser.email)
      console.log('ID:', adminUser.id)
      console.log('Role:', adminUser.user_metadata?.role || 'Not set')
      
      // Update role if not set
      if (!adminUser.user_metadata?.role) {
        console.log('\n🔧 Updating user role to admin...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
          user_metadata: { role: 'admin' }
        })
        
        if (updateError) {
          console.log('❌ Error updating user role:', updateError.message)
        } else {
          console.log('✅ User role updated to admin')
        }
      }
      
      return
    }
    
    console.log('\n🔧 Creating admin user...')
    
    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@autoorder.ro',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })
    
    if (createError) {
      console.log('❌ Error creating admin user:', createError.message)
      return
    }
    
    console.log('✅ Admin user created successfully!')
    console.log('Email:', newUser.user.email)
    console.log('ID:', newUser.user.id)
    console.log('Role:', newUser.user.user_metadata?.role)
    
    console.log('\n🎉 Admin user setup complete!')
    console.log('You can now login with:')
    console.log('Email: admin@autoorder.ro')
    console.log('Password: admin123')
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

setupAdminUser()
