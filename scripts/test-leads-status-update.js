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

async function testLeadsStatusUpdate() {
  try {
    console.log('🧪 Testing leads status update functionality...')
    
    // Step 1: Check if leads table exists and has data
    console.log('📊 Checking leads table...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(5)
    
    if (leadsError) {
      console.error('❌ Error fetching leads:', leadsError)
      return
    }
    
    console.log(`✅ Found ${leads.length} leads`)
    
    if (leads.length === 0) {
      console.log('⚠️ No leads found, creating test lead...')
      
      const { data: testLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          marca_model: 'Test Car - Status Update',
          buget: '25.000 EUR',
          contact: 'test@status.com',
          extra: { test: true, purpose: 'status_update_test' },
          status: 'new'
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Error creating test lead:', insertError)
        return
      }
      
      console.log('✅ Test lead created:', testLead.id)
      leads.push(testLead)
    }
    
    // Step 2: Test status update for each lead
    for (const lead of leads) {
      console.log(`\n🔄 Testing status update for lead: ${lead.marca_model} (${lead.id})`)
      console.log(`   Current status: ${lead.status}`)
      
      // Try to update to 'qualified' status
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({ status: 'qualified' })
        .eq('id', lead.id)
        .select()
        .single()
      
      if (updateError) {
        console.error(`   ❌ Update failed:`, updateError)
        
        // Check RLS policies
        console.log('   🔍 Checking RLS policies...')
        const { data: policies, error: policiesError } = await supabase
          .from('information_schema.policies')
          .select('*')
          .eq('table_name', 'leads')
          .eq('table_schema', 'public')
        
        if (policiesError) {
          console.error('   ❌ Error checking policies:', policiesError)
        } else {
          console.log('   📋 Current policies:')
          policies.forEach(policy => {
            console.log(`     - ${policy.policy_name} (${policy.action})`)
          })
        }
        
        // Check table permissions
        console.log('   🔍 Checking table permissions...')
        const { data: permissions, error: permError } = await supabase
          .from('information_schema.table_privileges')
          .select('*')
          .eq('table_name', 'leads')
          .eq('table_schema', 'public')
        
        if (permError) {
          console.error('   ❌ Error checking permissions:', permError)
        } else {
          console.log('   📋 Table privileges:')
          permissions.forEach(perm => {
            console.log(`     - ${perm.grantee}: ${perm.privilege_type}`)
          })
        }
        
      } else {
        console.log(`   ✅ Update successful! New status: ${updatedLead.status}`)
        
        // Revert to original status
        const { error: revertError } = await supabase
          .from('leads')
          .update({ status: lead.status })
          .eq('id', lead.id)
        
        if (revertError) {
          console.error(`   ⚠️ Could not revert status:`, revertError)
        } else {
          console.log(`   ✅ Status reverted to: ${lead.status}`)
        }
      }
    }
    
    // Step 3: Test with service role key (should work)
    console.log('\n🔑 Testing with service role key...')
    
    const serviceSupabase = createClient(supabaseUrl, serviceRoleKey)
    
    for (const lead of leads) {
      console.log(`   🔄 Testing service role update for: ${lead.marca_model}`)
      
      const { data: updatedLead, error: updateError } = await serviceSupabase
        .from('leads')
        .update({ status: 'quoted' })
        .eq('id', lead.id)
        .select()
        .single()
      
      if (updateError) {
        console.error(`   ❌ Service role update failed:`, updateError)
      } else {
        console.log(`   ✅ Service role update successful! New status: ${updatedLead.status}`)
        
        // Revert to original status
        await serviceSupabase
          .from('leads')
          .update({ status: lead.status })
          .eq('id', lead.id)
      }
    }
    
    console.log('\n🎉 Status update test completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testLeadsStatusUpdate()
