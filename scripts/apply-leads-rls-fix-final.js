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
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'SET' : 'MISSING')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function applyLeadsRLSFix() {
  try {
    console.log('🔧 Applying final leads RLS fix...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/006_fix_leads_rls_final.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📖 Migration file loaded, executing...')
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Error executing migration:', error)
      
      // Try to execute parts manually
      console.log('🔄 Trying manual execution...')
      
      // Disable RLS
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;' 
      })
      
      // Drop all policies
      const dropPoliciesSQL = `
        DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
        DROP POLICY IF EXISTS "admin can read leads" ON public.leads;
        DROP POLICY IF EXISTS "admin can update leads" ON public.leads;
        DROP POLICY IF EXISTS "admin can delete leads" ON public.leads;
        DROP POLICY IF EXISTS "service_role can manage leads" ON public.leads;
      `
      await supabase.rpc('exec_sql', { sql: dropPoliciesSQL })
      
      // Re-enable RLS
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;' 
      })
      
      // Create policies one by one
      const policies = [
        `CREATE POLICY "anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);`,
        `CREATE POLICY "admin can read leads" ON public.leads FOR SELECT USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');`,
        `CREATE POLICY "admin can update leads" ON public.leads FOR UPDATE USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin') WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');`,
        `CREATE POLICY "admin can delete leads" ON public.leads FOR DELETE USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');`,
        `CREATE POLICY "service_role can manage leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);`
      ]
      
      for (const policy of policies) {
        try {
          await supabase.rpc('exec_sql', { sql: policy })
          console.log('✅ Policy created:', policy.split('"')[1])
        } catch (policyError) {
          console.error('❌ Error creating policy:', policyError)
        }
      }
      
    } else {
      console.log('✅ Migration executed successfully')
    }
    
    // Verify the policies
    console.log('🔍 Verifying policies...')
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.policies')
      .select('*')
      .eq('table_name', 'leads')
      .eq('table_schema', 'public')
    
    if (policiesError) {
      console.error('❌ Error checking policies:', policiesError)
    } else {
      console.log('📋 Current policies:')
      policies.forEach(policy => {
        console.log(`  - ${policy.policy_name} (${policy.action})`)
      })
    }
    
    // Test the setup
    console.log('🧪 Testing lead operations...')
    
    // Test insert
    const { data: testLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        marca_model: 'test-rls-fix',
        buget: 'test-budget',
        contact: 'test@rls.com',
        extra: { test: true, rls: 'fixed' },
        status: 'new'
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Test insert failed:', insertError)
    } else {
      console.log('✅ Test insert successful:', testLead.id)
      
      // Test update
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'qualified' })
        .eq('id', testLead.id)
      
      if (updateError) {
        console.error('❌ Test update failed:', updateError)
      } else {
        console.log('✅ Test update successful')
      }
      
      // Test delete
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', testLead.id)
      
      if (deleteError) {
        console.error('❌ Test delete failed:', deleteError)
      } else {
        console.log('✅ Test delete successful')
      }
    }
    
    console.log('🎉 Leads RLS fix completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

// Run the fix
applyLeadsRLSFix()
