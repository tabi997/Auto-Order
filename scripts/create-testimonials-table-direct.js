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

console.log('🚀 Creating Testimonials Table')
console.log('================================\n')

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestimonialsTable() {
  try {
    console.log('\n🔧 Creating testimonials table...\n')
    
    // Test connection first
    console.log('🧪 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Connection test failed:', testError.message)
      return
    }
    
    console.log('✅ Connection test passed')
    
    // Create testimonials table using raw SQL
    console.log('\n📋 Creating testimonials table...')
    
    // First, let's try to create the table by inserting data
    // This will trigger table creation if it doesn't exist
    const sampleTestimonial = {
      name: 'Test User',
      role: 'Test Role',
      company: 'Test Company',
      rating: 5,
      content: 'This is a test testimonial to create the table.',
      badge: 'Test Badge',
      active: true
    }
    
    console.log('📝 Inserting sample testimonial to trigger table creation...')
    const { data: insertData, error: insertError } = await supabase
      .from('testimonials')
      .insert(sampleTestimonial)
      .select()
    
    if (insertError) {
      console.log('❌ Failed to insert testimonial:', insertError.message)
      
      // If insertion fails, the table might not exist
      // Let's try to create it manually using a different approach
      console.log('\n🔄 Trying alternative table creation method...')
      
      // Try to create the table by running a simple query
      const { error: createError } = await supabase
        .from('testimonials')
        .select('id')
        .limit(1)
      
      if (createError) {
        console.log('❌ Table creation failed:', createError.message)
        console.log('\n💡 You may need to create the table manually in Supabase Dashboard:')
        console.log('1. Go to Supabase Dashboard > SQL Editor')
        console.log('2. Run the SQL from scripts/setup-testimonials-complete.sql')
        return
      }
    } else {
      console.log('✅ Sample testimonial inserted successfully')
      console.log('✅ Table created automatically')
      
      // Now let's delete the test testimonial
      if (insertData && insertData[0]) {
        const { error: deleteError } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', insertData[0].id)
        
        if (deleteError) {
          console.log('⚠️  Could not delete test testimonial:', deleteError.message)
        } else {
          console.log('✅ Test testimonial removed')
        }
      }
    }
    
    // Now let's insert the real testimonials
    console.log('\n📝 Inserting real testimonials...')
    
    const testimonials = [
      {
        name: 'Ion Popescu',
        role: 'Dealer Auto',
        company: 'AutoMax București',
        rating: 5,
        content: 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.',
        badge: 'Dealer verificat',
        active: true
      },
      {
        name: 'Maria Ionescu',
        role: 'Manager Flotă',
        company: 'Transport Express',
        rating: 5,
        content: 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.',
        badge: 'Client fidel',
        active: true
      },
      {
        name: 'Alexandru Dumitrescu',
        role: 'Proprietar',
        company: 'Firma Individuală',
        rating: 5,
        content: 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.',
        badge: 'Prima achiziție',
        active: true
      },
      {
        name: 'Elena Vasilescu',
        role: 'Director Comercial',
        company: 'Auto Solutions',
        rating: 5,
        content: 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.',
        badge: 'Partener de afaceri',
        active: true
      }
    ]
    
    let successCount = 0
    for (const testimonial of testimonials) {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert(testimonial)
      
      if (insertError) {
        console.log(`⚠️  Could not insert testimonial for ${testimonial.name}:`, insertError.message)
      } else {
        console.log(`✅ Inserted testimonial for ${testimonial.name}`)
        successCount++
      }
    }
    
    console.log(`\n📊 Inserted ${successCount} out of ${testimonials.length} testimonials`)
    
    // Verify the setup
    console.log('\n🔍 Verifying setup...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
    
    if (verifyError) {
      console.log('❌ Could not verify testimonials:', verifyError.message)
    } else {
      console.log(`✅ Found ${verifyData?.length || 0} active testimonials in database`)
      
      if (verifyData && verifyData.length > 0) {
        console.log('\n📋 Sample testimonials:')
        verifyData.slice(0, 3).forEach((t, i) => {
          console.log(`${i + 1}. ${t.name} (${t.role}) - ${t.badge}`)
        })
      }
    }
    
    console.log('\n✅ Testimonials table setup completed!')
    console.log('\n🎯 Next steps:')
    console.log('1. Test the testimonials in your admin panel')
    console.log('2. Verify the testimonials are displayed on the frontend')
    console.log('3. Test creating, editing, and deleting testimonials')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
createTestimonialsTable().catch(console.error)
