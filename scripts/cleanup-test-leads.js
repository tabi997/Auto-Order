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

async function cleanupTestLeads() {
  try {
    console.log('🧹 Cleaning up test leads...')
    
    // Find and delete test leads
    const testPatterns = [
      'test-fix',
      'test-rls-fix',
      'Test Car - Status Update',
      'Test Car - Delete Test',
      'Browser Test Car 1',
      'Browser Test Car 2'
    ]
    
    let totalDeleted = 0
    
    for (const pattern of testPatterns) {
      console.log(`🔍 Looking for leads matching: "${pattern}"`)
      
      const { data: matchingLeads, error: searchError } = await supabase
        .from('leads')
        .select('id, marca_model')
        .ilike('marca_model', `%${pattern}%`)
      
      if (searchError) {
        console.error(`❌ Error searching for pattern "${pattern}":`, searchError)
        continue
      }
      
      if (matchingLeads && matchingLeads.length > 0) {
        console.log(`   Found ${matchingLeads.length} matching leads`)
        
        for (const lead of matchingLeads) {
          console.log(`   Deleting: ${lead.marca_model} (${lead.id})`)
          
          const { error: deleteError } = await supabase
            .from('leads')
            .delete()
            .eq('id', lead.id)
          
          if (deleteError) {
            console.error(`   ❌ Failed to delete:`, deleteError)
          } else {
            console.log(`   ✅ Deleted successfully`)
            totalDeleted++
          }
        }
      } else {
        console.log(`   No leads found matching pattern`)
      }
    }
    
    // Also clean up leads with test emails
    console.log('\n🔍 Looking for leads with test emails...')
    
    const testEmails = [
      'test@fix.com',
      'test@rls.com',
      'test@status.com',
      'delete@test.com',
      'browser1@test.com',
      'browser2@test.com'
    ]
    
    for (const email of testEmails) {
      const { data: emailLeads, error: emailError } = await supabase
        .from('leads')
        .select('id, marca_model, contact')
        .ilike('contact', `%${email}%`)
      
      if (emailError) {
        console.error(`❌ Error searching for email "${email}":`, emailError)
        continue
      }
      
      if (emailLeads && emailLeads.length > 0) {
        console.log(`   Found ${emailLeads.length} leads with email: ${email}`)
        
        for (const lead of emailLeads) {
          console.log(`   Deleting: ${lead.marca_model} (${lead.contact})`)
          
          const { error: deleteError } = await supabase
            .from('leads')
            .delete()
            .eq('id', lead.id)
          
          if (deleteError) {
            console.error(`   ❌ Failed to delete:`, deleteError)
          } else {
            console.log(`   ✅ Deleted successfully`)
            totalDeleted++
          }
        }
      }
    }
    
    console.log(`\n🎉 Cleanup completed! Total leads deleted: ${totalDeleted}`)
    
    // Show remaining leads count
    const { data: remainingLeads, error: countError } = await supabase
      .from('leads')
      .select('id', { count: 'exact' })
    
    if (countError) {
      console.error('❌ Error counting remaining leads:', countError)
    } else {
      console.log(`📊 Remaining leads in database: ${remainingLeads?.length || 0}`)
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the cleanup
cleanupTestLeads()
