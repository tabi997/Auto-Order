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

async function testLeadsDeleteServerAction() {
  try {
    console.log('🧪 Testing leads delete with server actions...')
    
    // Step 1: Create a test lead for deletion
    console.log('📝 Creating test lead for deletion...')
    
    const { data: testLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        marca_model: 'Server Action Test Car',
        buget: '60.000 EUR',
        contact: 'server@action.com',
        extra: { test: true, purpose: 'server_action_test' },
        status: 'new'
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error creating test lead:', insertError)
      return
    }
    
    console.log('✅ Test lead created:', testLead.id)
    console.log('   Model:', testLead.marca_model)
    console.log('   Status:', testLead.status)
    
    // Step 2: Verify the lead exists
    console.log('\n🔍 Verifying lead exists...')
    
    const { data: verifyLead, error: verifyError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', testLead.id)
      .single()
    
    if (verifyError || !verifyLead) {
      console.error('❌ Lead not found after creation:', verifyError)
      return
    }
    
    console.log('✅ Lead verified:', verifyLead.marca_model)
    
    // Step 3: Test delete operation with service role (simulating server action)
    console.log('\n🗑️ Testing delete operation with service role...')
    
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', testLead.id)
    
    if (deleteError) {
      console.error('❌ Delete failed:', deleteError)
      return
    }
    
    console.log('✅ Delete operation successful!')
    
    // Step 4: Verify lead was deleted
    console.log('\n🔍 Verifying lead was deleted...')
    
    const { data: deletedLead, error: checkDeletedError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', testLead.id)
      .single()
    
    if (checkDeletedError && checkDeletedError.code === 'PGRST116') {
      console.log('✅ Lead successfully deleted (not found in database)')
    } else if (deletedLead) {
      console.error('❌ Lead still exists after deletion:', deletedLead)
    } else {
      console.log('✅ Lead successfully deleted')
    }
    
    // Step 5: Test RLS policies
    console.log('\n🔐 Testing RLS policies...')
    
    // Create another test lead
    const { data: testLead2, error: insertError2 } = await supabase
      .from('leads')
      .insert({
        marca_model: 'RLS Test Car',
        buget: '70.000 EUR',
        contact: 'rls@test.com',
        extra: { test: true, purpose: 'rls_test' },
        status: 'new'
      })
      .select()
      .single()
    
    if (insertError2) {
      console.error('❌ Error creating second test lead:', insertError2)
    } else {
      console.log('✅ Second test lead created:', testLead2.id)
      
      // Test update with service role
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'qualified' })
        .eq('id', testLead2.id)
      
      if (updateError) {
        console.error('❌ Update failed:', updateError)
      } else {
        console.log('✅ Update successful')
        
        // Test delete with service role
        const { error: deleteError2 } = await supabase
          .from('leads')
          .delete()
          .eq('id', testLead2.id)
        
        if (deleteError2) {
          console.error('❌ Delete failed:', deleteError2)
        } else {
          console.log('✅ Delete successful')
        }
      }
    }
    
    console.log('\n🎉 Server action delete test completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testLeadsDeleteServerAction()
