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

console.log('🚀 Populating Testimonials Table')
console.log('=================================\n')

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

async function populateTestimonials() {
  try {
    console.log('\n🔧 Populating testimonials table...\n')
    
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
    
    // Check if testimonials table exists
    console.log('\n🔍 Checking if testimonials table exists...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Testimonials table does not exist:', tableError.message)
      console.log('\n💡 Please create the table first by running:')
      console.log('1. Go to Supabase Dashboard > SQL Editor')
      console.log('2. Run the SQL from supabase/migrations/007_create_testimonials_complete.sql')
      console.log('3. Then run this script again')
      return
    }
    
    console.log('✅ Testimonials table exists')
    
    // Check if table already has data
    const { data: existingData, error: countError } = await supabase
      .from('testimonials')
      .select('id')
    
    if (countError) {
      console.log('❌ Could not check existing data:', countError.message)
      return
    }
    
    if (existingData && existingData.length > 0) {
      console.log(`ℹ️  Table already contains ${existingData.length} testimonials`)
      
      const response = await new Promise((resolve) => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        })
        
        readline.question('Do you want to add more testimonials? (y/N): ', (answer) => {
          readline.close()
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
      })
      
      if (!response) {
        console.log('✅ No additional testimonials needed')
        return
      }
    }
    
    // Insert testimonials
    console.log('\n📝 Inserting testimonials...')
    
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
      },
      {
        name: 'Vasile Marin',
        role: 'Proprietar Flotă',
        company: 'Marin Transport',
        rating: 5,
        content: 'Serviciul de sourcing este excepțional. Am găsit vehicule de calitate la prețuri mult mai bune decât pe piața locală.',
        badge: 'Client fidel',
        active: true
      },
      {
        name: 'Ana Popa',
        role: 'Manager Comercial',
        company: 'Auto Premium',
        rating: 5,
        content: 'Colaborarea cu AutoOrder ne-a permis să diversificăm oferta și să oferim clienților noștri opțiuni mai bune.',
        badge: 'Dealer verificat',
        active: true
      }
    ]
    
    let successCount = 0
    let skippedCount = 0
    
    for (const testimonial of testimonials) {
      try {
        // Check if testimonial already exists
        const { data: existing, error: checkError } = await supabase
          .from('testimonials')
          .select('id')
          .eq('name', testimonial.name)
          .eq('role', testimonial.role)
          .limit(1)
        
        if (checkError) {
          console.log(`⚠️  Could not check existing testimonial for ${testimonial.name}:`, checkError.message)
          continue
        }
        
        if (existing && existing.length > 0) {
          console.log(`⏭️  Skipping ${testimonial.name} - already exists`)
          skippedCount++
          continue
        }
        
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert(testimonial)
        
        if (insertError) {
          console.log(`⚠️  Could not insert testimonial for ${testimonial.name}:`, insertError.message)
        } else {
          console.log(`✅ Inserted testimonial for ${testimonial.name}`)
          successCount++
        }
      } catch (insertError) {
        console.log(`⚠️  Error inserting testimonial for ${testimonial.name}:`, insertError.message)
      }
    }
    
    console.log(`\n📊 Results:`)
    console.log(`✅ Inserted: ${successCount}`)
    console.log(`⏭️  Skipped: ${skippedCount}`)
    console.log(`📝 Total processed: ${testimonials.length}`)
    
    // Verify the setup
    console.log('\n🔍 Verifying final state...')
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
        verifyData.slice(0, 5).forEach((t, i) => {
          console.log(`${i + 1}. ${t.name} (${t.role}) - ${t.badge}`)
        })
        
        if (verifyData.length > 5) {
          console.log(`... and ${verifyData.length - 5} more`)
        }
      }
    }
    
    console.log('\n✅ Testimonials population completed!')
    console.log('\n🎯 Next steps:')
    console.log('1. Test the testimonials in your admin panel')
    console.log('2. Verify the testimonials are displayed on the frontend')
    console.log('3. Test creating, editing, and deleting testimonials')
    
  } catch (error) {
    console.error('❌ Population failed:', error)
    process.exit(1)
  }
}

// Run the population
populateTestimonials().catch(console.error)
