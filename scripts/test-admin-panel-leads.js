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

async function testAdminPanelLeads() {
  try {
    console.log('🧪 Testing admin panel leads functionality...')
    
    // Step 1: Check current leads
    console.log('📊 Checking current leads...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (leadsError) {
      console.error('❌ Error fetching leads:', leadsError)
      return
    }
    
    console.log(`✅ Found ${leads.length} leads`)
    
    if (leads.length === 0) {
      console.log('⚠️ No leads found, creating test leads...')
      
      const testLeads = [
        {
          marca_model: 'Test Car 1 - Admin Panel',
          buget: '30.000 EUR',
          contact: 'test1@admin.com',
          extra: { test: true, purpose: 'admin_panel_test' },
          status: 'new'
        },
        {
          marca_model: 'Test Car 2 - Admin Panel',
          buget: '45.000 EUR',
          contact: 'test2@admin.com',
          extra: { test: true, purpose: 'admin_panel_test' },
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
          console.log('✅ Test lead created:', newLead.id)
        }
      }
      
      // Fetch leads again
      const { data: newLeads, error: newLeadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (!newLeadsError) {
        leads.length = 0
        leads.push(...newLeads)
      }
    }
    
    // Step 2: Test status transitions
    console.log('\n🔄 Testing status transitions...')
    
    for (const lead of leads.slice(0, 3)) { // Test first 3 leads
      console.log(`\n   Testing lead: ${lead.marca_model} (${lead.id})`)
      console.log(`   Current status: ${lead.status}`)
      
      // Test transition to 'qualified' if not already
      if (lead.status !== 'qualified') {
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update({ status: 'qualified' })
          .eq('id', lead.id)
          .select()
          .single()
        
        if (updateError) {
          console.error(`   ❌ Update to qualified failed:`, updateError)
        } else {
          console.log(`   ✅ Update to qualified successful!`)
          
          // Test transition to 'quoted'
          const { data: quotedLead, error: quotedError } = await supabase
            .from('leads')
            .update({ status: 'quoted' })
            .eq('id', lead.id)
            .select()
            .single()
          
          if (quotedError) {
            console.error(`   ❌ Update to quoted failed:`, quotedError)
          } else {
            console.log(`   ✅ Update to quoted successful!`)
            
            // Revert to original status
            await supabase
              .from('leads')
              .update({ status: lead.status })
              .eq('id', lead.id)
            
            console.log(`   ✅ Status reverted to: ${lead.status}`)
          }
        }
      } else {
        console.log(`   ⏭️ Lead already qualified, skipping test`)
      }
    }
    
    // Step 3: Test delete functionality
    console.log('\n🗑️ Testing delete functionality...')
    
    // Find a test lead to delete
    const testLeadToDelete = leads.find(lead => 
      lead.marca_model.includes('Test Car') && lead.marca_model.includes('Admin Panel')
    )
    
    if (testLeadToDelete) {
      console.log(`   Deleting test lead: ${testLeadToDelete.marca_model}`)
      
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', testLeadToDelete.id)
      
      if (deleteError) {
        console.error(`   ❌ Delete failed:`, deleteError)
      } else {
        console.log(`   ✅ Delete successful!`)
      }
    } else {
      console.log('   ⚠️ No test leads found to delete')
    }
    
    // Step 4: Verify RLS policies
    console.log('\n🔍 Verifying RLS policies...')
    
    try {
      const { data: policies, error: policiesError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            SELECT 
              policyname,
              cmd,
              qual,
              with_check
            FROM pg_policies 
            WHERE tablename = 'leads' 
            AND schemaname = 'public'
            ORDER BY policyname;
          `
        })
      
      if (policiesError) {
        console.log('   ⚠️ Could not check policies via RPC, checking manually...')
        
        // Try to check policies manually
        const { data: manualPolicies, error: manualError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'leads')
          .eq('schemaname', 'public')
        
        if (manualError) {
          console.error('   ❌ Error checking policies manually:', manualError)
        } else {
          console.log('   📋 Current policies:')
          manualPolicies.forEach(policy => {
            console.log(`     - ${policy.policyname} (${policy.cmd})`)
          })
        }
      } else {
        console.log('   📋 Current policies:')
        policies.forEach(policy => {
          console.log(`     - ${policy.policyname} (${policy.cmd})`)
        })
      }
    } catch (error) {
      console.log('   ⚠️ Could not check policies')
    }
    
    console.log('\n🎉 Admin panel leads test completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the test
testAdminPanelLeads()
