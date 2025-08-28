#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gpazhzixylrapqmclygw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYXpoeml4eWxyYXBxbWNseWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTQ1MzEsImV4cCI6MjA3MTk3MDUzMX0.eFZE_MQduTL45DDu-eg6ZRilXL8ybgXVeMvUxy0b2L0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseLeadsRLS() {
  try {
    console.log('🔍 Diagnosing RLS policies for leads table...\n');
    
    // Test 1: Try to read from leads table
    console.log('1️⃣ Testing SELECT access...');
    const { data: leads, error: selectError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ SELECT failed:', selectError.message);
    } else {
      console.log('✅ SELECT successful, found', leads?.length || 0, 'leads');
    }
    
    // Test 2: Try to insert into leads table
    console.log('\n2️⃣ Testing INSERT access...');
    const testLead = {
      marca_model: 'test-diagnosis',
      buget: 'test-budget',
      contact: 'test@diagnosis.com',
      extra: { test: true, timestamp: new Date().toISOString() }
    };
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select();
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message);
      console.log('   Error code:', insertError.code);
      console.log('   Error details:', insertError.details);
      console.log('   Error hint:', insertError.hint);
    } else {
      console.log('✅ INSERT successful, created lead with ID:', newLead[0].id);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead[0].id);
      
      if (deleteError) {
        console.log('⚠️  Warning: Could not clean up test data:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up successfully');
      }
    }
    
    // Test 3: Check if RLS is enabled
    console.log('\n3️⃣ Checking RLS status...');
    try {
      const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT schemaname, tablename, rowsecurity 
          FROM pg_tables 
          WHERE tablename = 'leads' 
          AND schemaname = 'public';
        `
      });
      
      if (rlsError) {
        console.log('⚠️  Could not check RLS status via RPC');
        console.log('   This is normal - the exec_sql function may not exist');
      } else {
        console.log('📊 RLS Status:', rlsStatus);
      }
    } catch (e) {
      console.log('⚠️  RLS status check failed (expected)');
    }
    
    // Test 4: Check table structure
    console.log('\n4️⃣ Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('leads')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('❌ Table structure check failed:', tableError.message);
    } else {
      console.log('✅ Table structure accessible');
    }
    
    console.log('\n📋 Summary:');
    if (insertError && insertError.message.includes('row-level security policy')) {
      console.log('❌ RLS is blocking inserts - you need to fix the database policies');
      console.log('💡 Solution: Apply the RLS fix through the Supabase dashboard');
      console.log('   Run: node scripts/apply-leads-rls-fix.js');
    } else if (insertError) {
      console.log('❌ Insert failed for a different reason:', insertError.message);
    } else {
      console.log('✅ Leads table is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

diagnoseLeadsRLS();
