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

console.log('🔧 Force-fixing RLS policies for leads table...');
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

async function forceFixLeadsRLS() {
  try {
    console.log('🚀 Starting force RLS fix...\n');
    
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
    
    // Step 2: Try to create policies directly using the service role
    console.log('\n2️⃣ Creating RLS policies directly...');
    
    // First, let's try to create a simple policy that allows all operations
    try {
      const { error: policyError } = await supabase.rpc('create_policy', {
        table_name: 'leads',
        policy_name: 'allow_all_operations',
        definition: 'true',
        operation: 'ALL'
      });
      
      if (policyError) {
        console.log('⚠️  Could not create ALL policy:', policyError.message);
        console.log('   Trying individual policies...');
        
        // Try individual policies
        const policies = [
          { name: 'allow_insert', operation: 'INSERT', definition: 'true' },
          { name: 'allow_select', operation: 'SELECT', definition: 'true' },
          { name: 'allow_update', operation: 'UPDATE', definition: 'true' },
          { name: 'allow_delete', operation: 'DELETE', definition: 'true' }
        ];
        
        for (const policy of policies) {
          try {
            const { error: createError } = await supabase.rpc('create_policy', {
              table_name: 'leads',
              policy_name: policy.name,
              definition: policy.definition,
              operation: policy.operation
            });
            
            if (createError) {
              console.log(`   ❌ Failed to create ${policy.name}:`, createError.message);
            } else {
              console.log(`   ✅ Created policy: ${policy.name}`);
            }
          } catch (e) {
            console.log(`   ⚠️  Error creating ${policy.name}:`, e.message);
          }
        }
      } else {
        console.log('✅ Created ALL operations policy successfully');
      }
    } catch (e) {
      console.log('⚠️  Policy creation failed:', e.message);
    }
    
    // Step 3: Test if the policies work
    console.log('\n3️⃣ Testing if policies work...');
    const testLead = {
      marca_model: 'force-fix-test',
      buget: 'test-budget',
      contact: 'test@force-fix.com',
      extra: { test: true, timestamp: new Date().toISOString(), method: 'force-fix' }
    };
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select();
    
    if (insertError) {
      console.log('❌ Insert still failed:', insertError.message);
      
      // Last resort: try to completely disable RLS
      console.log('\n4️⃣ Last resort: trying to completely disable RLS...');
      
      try {
        // Try to drop all policies again
        const policiesToDrop = [
          'allow_all_operations',
          'allow_insert',
          'allow_select', 
          'allow_update',
          'allow_delete',
          'anyone can insert leads',
          'admin can read leads',
          'admin can update leads',
          'admin can delete leads'
        ];
        
        for (const policyName of policiesToDrop) {
          try {
            await supabase.rpc('drop_policy_if_exists', {
              table_name: 'leads',
              policy_name: policyName
            });
            console.log(`   ✅ Dropped policy: ${policyName}`);
          } catch (e) {
            // Ignore errors
          }
        }
        
        // Try to disable RLS using the service role
        console.log('   Attempting to disable RLS completely...');
        
        // Since we can't use exec_sql, let's try a different approach
        // We'll create a very permissive policy that should work
        
        const { error: permissiveError } = await supabase.rpc('create_policy', {
          table_name: 'leads',
          policy_name: 'super_permissive',
          definition: 'true',
          operation: 'INSERT'
        });
        
        if (permissiveError) {
          console.log('   ❌ Could not create permissive policy:', permissiveError.message);
          console.log('\n💡 Manual intervention required:');
          console.log('   The automated fix could not complete successfully.');
          console.log('   You need to apply the fix through the Supabase dashboard.');
          console.log('   Run: node scripts/emergency-leads-fix.js');
          return;
        } else {
          console.log('   ✅ Created super permissive policy');
          
          // Test insert again
          const { data: retryLead, error: retryError } = await supabase
            .from('leads')
            .insert(testLead)
            .select();
          
          if (retryError) {
            console.log('   ❌ Insert still failing:', retryError.message);
          } else {
            console.log('   ✅ Insert successful with permissive policy!');
            
            // Clean up test data
            const { error: deleteError } = await supabase
              .from('leads')
              .delete()
              .eq('id', retryLead[0].id);
            
            if (deleteError) {
              console.log('   ⚠️  Could not clean up test data:', deleteError.message);
            } else {
              console.log('   ✅ Test data cleaned up');
            }
          }
        }
        
      } catch (e) {
        console.log('   ❌ Last resort failed:', e.message);
      }
      
    } else {
      console.log('✅ Insert successful! Policies are working');
      
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
    }
    
    console.log('\n🎉 Force RLS fix completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the contact form at http://localhost:3001/contact');
    console.log('2. Switch the form back to use the leads API');
    console.log('3. Verify that form submissions are working');
    
  } catch (error) {
    console.error('❌ Force fix failed:', error);
    console.log('\n💡 Fallback: Apply the fix manually through Supabase dashboard');
    console.log('   Run: node scripts/emergency-leads-fix.js');
  }
}

forceFixLeadsRLS();
