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

async function testMiddleware() {
  try {
    console.log('🔧 Testing middleware functionality...')
    
    // Step 1: Test admin routes without authentication
    console.log('📋 Testing admin routes without authentication...')
    
    const adminRoutes = [
      '/admin',
      '/admin/leads',
      '/admin/vehicles',
      '/admin/settings',
      '/admin/contact-settings'
    ]
    
    for (const route of adminRoutes) {
      try {
        const response = await fetch(`http://localhost:3000${route}`)
        console.log(`   ${route}: ${response.status}`)
        
        if (response.status === 307) {
          const location = response.headers.get('location')
          console.log(`     ✅ Redirects to: ${location}`)
        } else if (response.status === 200) {
          console.log(`     ⚠️ Unexpected: Accessible without auth`)
        } else {
          console.log(`     ❓ Unexpected status: ${response.status}`)
        }
      } catch (error) {
        console.log(`   ${route}: ❌ Error - ${error.message}`)
      }
    }
    
    // Step 2: Test non-admin routes (should be accessible)
    console.log('\n🌐 Testing non-admin routes...')
    
    const publicRoutes = [
      '/',
      '/contact',
      '/stock',
      '/faq'
    ]
    
    for (const route of publicRoutes) {
      try {
        const response = await fetch(`http://localhost:3000${route}`)
        console.log(`   ${route}: ${response.status}`)
        
        if (response.status === 200) {
          console.log(`     ✅ Accessible (expected)`)
        } else {
          console.log(`     ❓ Unexpected status: ${response.status}`)
        }
      } catch (error) {
        console.log(`   ${route}: ❌ Error - ${error.message}`)
      }
    }
    
    // Step 3: Test API endpoints
    console.log('\n🔌 Testing API endpoints...')
    
    const apiEndpoints = [
      '/api/admin/leads'
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: 'test-id' }),
        })
        
        console.log(`   ${endpoint} (DELETE): ${response.status}`)
        
        if (response.status === 401) {
          console.log(`     ✅ Returns unauthorized (expected)`)
        } else {
          console.log(`     ❓ Unexpected status: ${response.status}`)
        }
      } catch (error) {
        console.log(`   ${endpoint}: ❌ Error - ${error.message}`)
      }
    }
    
    // Step 4: Check middleware configuration
    console.log('\n⚙️ Checking middleware configuration...')
    
    const middlewarePath = path.join(__dirname, '../src/middleware.ts')
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8')
      
      if (middlewareContent.includes('/admin/:path*')) {
        console.log('   ✅ Middleware matcher configured correctly')
      } else {
        console.log('   ❌ Middleware matcher not configured correctly')
      }
      
      if (middlewareContent.includes('user.user_metadata?.role !== \'admin\'')) {
        console.log('   ✅ Admin role check configured correctly')
      } else {
        console.log('   ❌ Admin role check not configured correctly')
      }
    } else {
      console.log('   ❌ Middleware file not found')
    }
    
    console.log('\n🎉 Middleware test completed!')
    
    // Step 5: Provide troubleshooting tips
    console.log('\n💡 Troubleshooting Tips:')
    console.log('1. Middleware should protect ALL /admin/* routes')
    console.log('2. Routes should redirect to /admin/login when not authenticated')
    console.log('3. If some routes are accessible without auth, check middleware')
    console.log('4. Try restarting the Next.js server')
    console.log('5. Check browser console for any errors')
    
    console.log('\n🔧 If middleware is not working:')
    console.log('1. Restart the Next.js server: npm run dev')
    console.log('2. Check that middleware.ts is in the src/ directory')
    console.log('3. Verify that the matcher pattern is correct')
    console.log('4. Check that the file is being compiled correctly')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testMiddleware()
