const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env file manually
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '../.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          if (value && !process.env[key]) {
            process.env[key] = value
          }
        }
      })
    }
  } catch (error) {
    console.log('Could not load .env.local file, using existing environment variables')
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function testAdminAuth() {
  try {
    console.log('🔐 Testing admin authentication...')
    
    // Step 1: Check if we can access the database with service role
    console.log('📊 Checking database access with service role...')
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.error('❌ Error accessing leads table:', leadsError)
      return
    }
    
    console.log('✅ Database access successful')
    console.log(`   Found ${leads?.length || 0} leads`)
    
    // Step 2: Check RLS policies
    console.log('\n🔍 Checking RLS policies...')
    
    try {
      // Try to create a test lead (should work with service role)
      const { data: testLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          marca_model: 'Auth Test Car',
          buget: '80.000 EUR',
          contact: 'auth@test.com',
          extra: { test: true, purpose: 'auth_test' },
          status: 'new'
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Error creating test lead:', insertError)
      } else {
        console.log('✅ Test lead created:', testLead.id)
        
        // Test update
        const { error: updateError } = await supabase
          .from('leads')
          .update({ status: 'qualified' })
          .eq('id', testLead.id)
        
        if (updateError) {
          console.error('❌ Update failed:', updateError)
        } else {
          console.log('✅ Update successful')
          
          // Test delete
          const { error: deleteError } = await supabase
            .from('leads')
            .delete()
            .eq('id', testLead.id)
          
          if (deleteError) {
            console.error('❌ Delete failed:', deleteError)
          } else {
            console.log('✅ Delete successful')
          }
        }
      }
    } catch (error) {
      console.error('❌ Error during CRUD operations:', error)
    }
    
    // Step 3: Check if there are any admin users in the database
    console.log('\n👥 Checking for admin users...')
    
    try {
      // This might not work due to RLS, but let's try
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (usersError) {
        console.log('⚠️ Could not list users (expected with RLS):', usersError.message)
      } else {
        console.log('✅ Users found:', users?.length || 0)
        
        // Look for admin users
        const adminUsers = users?.filter(user => user.user_metadata?.role === 'admin') || []
        console.log('🔑 Admin users found:', adminUsers.length)
        
        adminUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.id})`)
        })
      }
    } catch (error) {
      console.log('⚠️ Could not check users (expected):', error.message)
    }
    
    // Step 4: Check auth configuration
    console.log('\n⚙️ Checking auth configuration...')
    
    console.log('   Supabase URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('   Service Role Key:', serviceRoleKey ? 'SET' : 'MISSING')
    
    // Step 5: Test browser endpoints
    console.log('\n🌐 Testing browser endpoints...')
    
    try {
      const response = await fetch('http://localhost:3000/admin')
      console.log('   Admin page status:', response.status)
      
      if (response.status === 302) {
        const location = response.headers.get('location')
        console.log('   Redirect location:', location)
      }
    } catch (error) {
      console.log('   ❌ Could not test admin page:', error.message)
    }
    
    console.log('\n🎉 Admin auth test completed!')
    
    // Step 6: Provide troubleshooting tips
    console.log('\n💡 Troubleshooting Tips:')
    console.log('1. Make sure you are logged in as admin in the browser')
    console.log('2. Check that your user has role: "admin" in user_metadata')
    console.log('3. Verify that RLS policies are correctly set')
    console.log('4. Check browser console for JavaScript errors')
    console.log('5. Check server logs for authentication errors')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testAdminAuth()
