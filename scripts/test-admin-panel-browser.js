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

async function testAdminPanelBrowser() {
  try {
    console.log('🌐 Testing admin panel browser functionality...')
    
    // Step 1: Check if server is running
    console.log('🔍 Checking if Next.js server is running...')
    
    try {
      const response = await fetch('http://localhost:3000')
      if (response.ok) {
        console.log('✅ Next.js server is running on port 3000')
      } else {
        console.log(`⚠️ Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Could not connect to Next.js server:', error.message)
      console.log('💡 Make sure to run: npm run dev')
      return
    }
    
    // Step 2: Check admin panel accessibility
    console.log('\n🔐 Checking admin panel accessibility...')
    
    try {
      const adminResponse = await fetch('http://localhost:3000/admin')
      if (adminResponse.status === 200) {
        console.log('✅ Admin panel page is accessible')
      } else if (adminResponse.status === 302) {
        console.log('✅ Admin panel redirecting to login (expected)')
      } else {
        console.log(`⚠️ Admin panel responded with status: ${adminResponse.status}`)
      }
    } catch (error) {
      console.error('❌ Error accessing admin panel:', error.message)
    }
    
    // Step 3: Check leads page accessibility
    console.log('\n📋 Checking leads page accessibility...')
    
    try {
      const leadsResponse = await fetch('http://localhost:3000/admin/leads')
      if (leadsResponse.status === 200) {
        console.log('✅ Leads page is accessible')
      } else if (leadsResponse.status === 302) {
        console.log('✅ Leads page redirecting to login (expected)')
      } else {
        console.log(`⚠️ Leads page responded with status: ${leadsResponse.status}`)
      }
    } catch (error) {
      console.error('❌ Error accessing leads page:', error.message)
    }
    
    // Step 4: Check API endpoint accessibility
    console.log('\n🔌 Checking API endpoint accessibility...')
    
    try {
      const apiResponse = await fetch('http://localhost:3000/api/admin/leads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 'test-id' }),
      })
      
      if (apiResponse.status === 401) {
        console.log('✅ API endpoint properly returns unauthorized (expected)')
      } else {
        console.log(`⚠️ API endpoint responded with status: ${apiResponse.status}`)
      }
    } catch (error) {
      console.error('❌ Error accessing API endpoint:', error.message)
    }
    
    // Step 5: Create test data for browser testing
    console.log('\n📝 Creating test data for browser testing...')
    
    const testLeads = [
      {
        marca_model: 'Browser Test Car 1',
        buget: '35.000 EUR',
        contact: 'browser1@test.com',
        extra: { test: true, purpose: 'browser_test' },
        status: 'new'
      },
      {
        marca_model: 'Browser Test Car 2',
        buget: '55.000 EUR',
        contact: 'browser2@test.com',
        extra: { test: true, purpose: 'browser_test' },
        status: 'qualified'
      }
    ]
    
    for (const testLead of testLeads) {
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert(testLead)
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Error creating test lead:', insertError)
      } else {
        console.log('✅ Test lead created:', newLead.marca_model)
      }
    }
    
    // Step 6: Provide testing instructions
    console.log('\n📋 Browser Testing Instructions:')
    console.log('1. Open your browser and go to: http://localhost:3000/admin')
    console.log('2. Log in with your admin credentials')
    console.log('3. Navigate to the Leads section')
    console.log('4. Try changing a lead status from "new" to "qualified"')
    console.log('5. Try deleting a test lead using the delete button')
    console.log('6. Verify that the UI updates correctly without errors')
    
    console.log('\n🔍 Test Data Created:')
    console.log('- Browser Test Car 1 (new status)')
    console.log('- Browser Test Car 2 (qualified status)')
    
    console.log('\n🎉 Browser test setup completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testAdminPanelBrowser()
