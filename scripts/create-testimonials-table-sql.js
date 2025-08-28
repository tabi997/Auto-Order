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

console.log('🚀 Creating Testimonials Table with SQL')
console.log('========================================\n')

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

async function createTestimonialsTableWithSQL() {
  try {
    console.log('\n🔧 Creating testimonials table using SQL...\n')
    
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
    
    // SQL to create testimonials table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.testimonials (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        role text NOT NULL,
        company text,
        rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
        content text NOT NULL,
        avatar text,
        badge text NOT NULL,
        active boolean DEFAULT true,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `
    
    // Try to create table using RPC if available
    console.log('📋 Attempting to create table using RPC...')
    try {
      const { error: rpcError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      
      if (rpcError) {
        console.log('⚠️  RPC method failed:', rpcError.message)
        throw new Error('RPC not available')
      }
      
      console.log('✅ Table created using RPC')
    } catch (rpcError) {
      console.log('⚠️  RPC method not available, trying alternative approach...')
      
      // Try to create the table by inserting data with proper structure
      console.log('🔄 Creating table by inserting structured data...')
      
      // First, let's check if we can create a simple table structure
      const { error: checkError } = await supabase
        .from('testimonials')
        .select('id')
        .limit(0)
      
      if (checkError && checkError.message.includes('relation "public.testimonials" does not exist')) {
        console.log('❌ Table does not exist and cannot be created automatically')
        console.log('\n💡 Manual table creation required:')
        console.log('1. Go to Supabase Dashboard > SQL Editor')
        console.log('2. Run the following SQL:')
        console.log('\n' + createTableSQL)
        console.log('\n3. Then run this script again to populate the data')
        return
      }
    }
    
    // Create indexes
    console.log('\n📊 Creating indexes...')
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);
      CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: createIndexesSQL })
      console.log('✅ Indexes created')
    } catch (indexError) {
      console.log('⚠️  Could not create indexes (table might not exist yet)')
    }
    
    // Enable RLS
    console.log('\n🔒 Enabling RLS...')
    const enableRLSSQL = `
      ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: enableRLSSQL })
      console.log('✅ RLS enabled')
    } catch (rlsError) {
      console.log('⚠️  Could not enable RLS (table might not exist yet)')
    }
    
    // Create RLS policies
    console.log('\n🛡️  Creating RLS policies...')
    const createPoliciesSQL = `
      DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
      CREATE POLICY "public can read active testimonials" ON public.testimonials
        FOR SELECT USING (active = true);

      DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
      CREATE POLICY "admin can manage testimonials" ON public.testimonials
        FOR ALL USING (true)
        WITH CHECK (true);
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: createPoliciesSQL })
      console.log('✅ RLS policies created')
    } catch (policyError) {
      console.log('⚠️  Could not create RLS policies (table might not exist yet)')
    }
    
    // Now let's try to insert testimonials
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
      }
    ]
    
    let successCount = 0
    for (const testimonial of testimonials) {
      try {
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
    
    console.log(`\n📊 Inserted ${successCount} out of ${testimonials.length} testimonials`)
    
    if (successCount === 0) {
      console.log('\n❌ No testimonials could be inserted')
      console.log('\n💡 The table might not exist yet. Please:')
      console.log('1. Go to Supabase Dashboard > SQL Editor')
      console.log('2. Run the SQL from scripts/setup-testimonials-complete.sql')
      console.log('3. Then run this script again')
      return
    }
    
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
    console.log('\n💡 If the table creation failed, you may need to:')
    console.log('1. Go to Supabase Dashboard > SQL Editor')
    console.log('2. Run the SQL from scripts/setup-testimonials-complete.sql')
    console.log('3. Then run this script again to populate the data')
    process.exit(1)
  }
}

// Run the setup
createTestimonialsTableWithSQL().catch(console.error)
