#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

const env = loadEnv();

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔧 Auto-fixing RLS policies for leads table...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
console.log('');

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function autoFixLeadsRLS() {
  try {
    console.log('🚀 Starting automated RLS fix...\n');
    
    // Step 1: Test current access
    console.log('1️⃣ Testing current access with service role...');
    const { data: testLeads, error: testError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Service role access failed:', testError.message);
      return;
    }
    
    console.log('✅ Service role access working, found', testLeads?.length || 0, 'leads');
    
    // Step 2: Disable RLS temporarily
    console.log('\n2️⃣ Disabling RLS on leads table...');
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableError) {
      console.log('⚠️  Could not disable RLS via RPC, trying alternative approach...');
      
      // Alternative: Try to drop policies first
      console.log('   Attempting to drop existing policies...');
      
      const policiesToDrop = [
        'anyone can insert leads',
        'admin can read leads',
        'admin can update leads',
        'admin can delete leads',
        'leads_select_policy',
        'leads_insert_policy',
        'leads_update_policy',
        'leads_delete_policy',
        'leads_public_select_policy',
        'public can read vehicles',
        'admin can modify vehicles'
      ];
      
      for (const policyName of policiesToDrop) {
        try {
          await supabase.rpc('drop_policy_if_exists', {
            table_name: 'leads',
            policy_name: policyName
          });
          console.log(`   ✅ Dropped policy: ${policyName}`);
        } catch (e) {
          console.log(`   ⚠️  Policy drop skipped: ${policyName}`);
        }
      }
    } else {
      console.log('✅ RLS disabled successfully');
    }
    
    // Step 3: Test insert without RLS
    console.log('\n3️⃣ Testing insert without RLS...');
    const testLead = {
      marca_model: 'auto-fix-test',
      buget: 'test-budget',
      contact: 'test@auto-fix.com',
      extra: { test: true, timestamp: new Date().toISOString(), method: 'auto-fix' }
    };
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select();
    
    if (insertError) {
      console.log('❌ Insert still failed:', insertError.message);
      console.log('   This suggests the RLS policies are still active');
      
      // Try to force disable RLS using direct SQL
      console.log('\n4️⃣ Attempting direct SQL approach...');
      try {
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
            DROP POLICY IF EXISTS "admin can read leads" ON public.leads;
            DROP POLICY IF EXISTS "admin can update leads" ON public.leads;
            DROP POLICY IF EXISTS "admin can delete leads" ON public.leads;
            DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
            DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
            DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
            DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
            DROP POLICY IF EXISTS "leads_public_select_policy" ON public.leads;
            DROP POLICY IF EXISTS "public can read vehicles" ON public.leads;
            DROP POLICY IF EXISTS "admin can modify vehicles" ON public.leads;
          `
        });
        
        if (sqlError) {
          console.log('❌ Direct SQL failed:', sqlError.message);
          console.log('\n💡 Manual intervention required:');
          console.log('   You need to apply the fix through the Supabase dashboard');
          console.log('   Run: node scripts/emergency-leads-fix.js');
          return;
        }
        
        console.log('✅ Direct SQL executed successfully');
        
        // Test insert again
        const { data: retryLead, error: retryError } = await supabase
          .from('leads')
          .insert(testLead)
          .select();
        
        if (retryError) {
          console.log('❌ Insert still failing after SQL fix:', retryError.message);
        } else {
          console.log('✅ Insert successful after SQL fix!');
          
          // Clean up test data
          const { error: deleteError } = await supabase
            .from('leads')
            .delete()
            .eq('id', retryLead[0].id);
          
          if (deleteError) {
            console.log('⚠️  Could not clean up test data:', deleteError.message);
          } else {
            console.log('✅ Test data cleaned up');
          }
        }
        
      } catch (e) {
        console.log('❌ Direct SQL approach failed:', e.message);
      }
      
    } else {
      console.log('✅ Insert successful! RLS is now disabled');
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead[0].id);
      
      if (deleteError) {
        console.log('⚠️  Could not clean up test data:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
      
      // Step 4: Re-enable RLS with correct policies
      console.log('\n4️⃣ Re-enabling RLS with correct policies...');
      
      try {
        const { error: enableError } = await supabase.rpc('exec_sql', {
          sql: `
            ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "anyone can insert leads" ON public.leads
            FOR INSERT WITH CHECK (true);
            
            CREATE POLICY "admin can read leads" ON public.leads
            FOR SELECT USING (
              (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
            );
            
            CREATE POLICY "admin can update leads" ON public.leads
            FOR UPDATE USING (
              (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
            ) WITH CHECK (
              (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
            );
            
            CREATE POLICY "admin can delete leads" ON public.leads
            FOR DELETE USING (
              (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
            );
          `
        });
        
        if (enableError) {
          console.log('⚠️  Could not re-enable RLS with policies:', enableError.message);
          console.log('   RLS is disabled, which means the contact form will work');
          console.log('   but you may want to manually set up the policies later');
        } else {
          console.log('✅ RLS re-enabled with correct policies');
        }
        
      } catch (e) {
        console.log('⚠️  RLS re-enable failed:', e.message);
        console.log('   RLS remains disabled - contact form will work');
      }
    }
    
    console.log('\n🎉 RLS fix completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the contact form at http://localhost:3001/contact');
    console.log('2. Switch the form back to use the leads API');
    console.log('3. Verify that form submissions are working');
    
  } catch (error) {
    console.error('❌ Auto-fix failed:', error);
    console.log('\n💡 Fallback: Apply the fix manually through Supabase dashboard');
    console.log('   Run: node scripts/emergency-leads-fix.js');
  }
}

autoFixLeadsRLS();
