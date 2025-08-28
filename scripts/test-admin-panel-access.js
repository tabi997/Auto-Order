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

async function testAdminPanelAccess() {
  try {
    console.log('🔐 Testing admin panel access...')
    
    // Step 1: Check current leads count
    console.log('📊 Checking current leads...')
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (leadsError) {
      console.error('❌ Error fetching leads:', leadsError)
      return
    }
    
    console.log(`✅ Found ${leads.length} leads`)
    
    if (leads.length > 0) {
      console.log('   Recent leads:')
      leads.forEach((lead, index) => {
        console.log(`   ${index + 1}. ${lead.marca_model} (${lead.status})`)
      })
    }
    
    // Step 2: Test browser access simulation
    console.log('\n🌐 Testing browser access simulation...')
    
    // Test without authentication (should redirect to login)
    try {
      const response = await fetch('http://localhost:3000/admin')
      console.log('   Admin page (no auth) status:', response.status)
      
      if (response.status === 307) {
        const location = response.headers.get('location')
        console.log('   ✅ Redirect location:', location)
      } else if (response.status === 200) {
        console.log('   ⚠️ Unexpected: Admin page accessible without auth')
      }
    } catch (error) {
      console.log('   ❌ Could not test admin page:', error.message)
    }
    
    // Test leads page (should also redirect to login)
    try {
      const leadsResponse = await fetch('http://localhost:3000/admin/leads')
      console.log('   Leads page (no auth) status:', leadsResponse.status)
      
      if (leadsResponse.status === 307) {
        const location = leadsResponse.headers.get('location')
        console.log('   ✅ Redirect location:', location)
      } else if (leadsResponse.status === 200) {
        console.log('   ⚠️ Unexpected: Leads page accessible without auth')
      }
    } catch (error) {
      console.log('   ❌ Could not test leads page:', error.message)
    }
    
    // Step 3: Test API endpoint (should return unauthorized)
    console.log('\n🔌 Testing API endpoint...')
    
    try {
      const apiResponse = await fetch('http://localhost:3000/api/admin/leads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 'test-id' }),
      })
      
      console.log('   API endpoint status:', apiResponse.status)
      
      if (apiResponse.status === 401) {
        console.log('   ✅ API properly returns unauthorized (expected)')
      } else {
        console.log('   ⚠️ Unexpected API response status')
      }
      
      const responseText = await apiResponse.text()
      console.log('   Response:', responseText)
    } catch (error) {
      console.log('   ❌ Could not test API endpoint:', error.message)
    }
    
    // Step 4: Check RLS policies
    console.log('\n🔍 Checking RLS policies...')
    
    try {
      // Test with service role (should work)
      const { data: testLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          marca_model: 'Access Test Car',
          buget: '90.000 EUR',
          contact: 'access@test.com',
          extra: { test: true, purpose: 'access_test' },
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
    
    console.log('\n🎉 Admin panel access test completed!')
    
    // Step 5: Provide instructions for manual testing
    console.log('\n📋 Manual Testing Instructions:')
    console.log('1. Open your browser and go to: http://localhost:3000/admin')
    console.log('2. You should be redirected to: http://localhost:3000/admin/login')
    console.log('3. Log in with your admin credentials')
    console.log('4. After successful login, you should be redirected to: http://localhost:3000/admin')
    console.log('5. Navigate to Leads section and test:')
    console.log('   - Changing lead status')
    console.log('   - Deleting leads')
    console.log('6. Check browser console for any JavaScript errors')
    
    console.log('\n🔧 If you still get "unauthorized" errors:')
    console.log('1. Make sure you are logged in as admin')
    console.log('2. Check that your user has role: "admin" in user_metadata')
    console.log('3. Try refreshing the page after login')
    console.log('4. Check if cookies are enabled in your browser')
    console.log('5. Try logging out and logging back in')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testAdminPanelAccess()
