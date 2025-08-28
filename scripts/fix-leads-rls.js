#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gpazhzixylrapqmclygw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYXpoeml4eWxyYXBxbWNseWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTQ1MzEsImV4cCI6MjA3MTk3MDUzMX0.eFZE_MQduTL45DDu-eg6ZRilXL8ybgXVeMvUxy0b2L0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLeadsRLS() {
  try {
    console.log('Fixing RLS policies for leads table...');
    
    // Try to drop existing policies first
    console.log('Attempting to drop existing policies...');
    
    try {
      await supabase.rpc('drop_policy_if_exists', {
        table_name: 'leads',
        policy_name: 'anyone can insert leads'
      });
      console.log('Dropped insert policy');
    } catch (e) {
      console.log('Insert policy drop failed (might not exist):', e.message);
    }
    
    try {
      await supabase.rpc('drop_policy_if_exists', {
        table_name: 'leads',
        policy_name: 'admin can read leads'
      });
      console.log('Dropped read policy');
    } catch (e) {
      console.log('Read policy drop failed (might not exist):', e.message);
    }
    
    // Create new policies using SQL
    console.log('Creating new policies...');
    
    // Policy for anyone to insert leads
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "anyone can insert leads" ON public.leads
        FOR INSERT WITH CHECK (true);
      `
    });
    
    if (insertPolicyError) {
      console.log('Insert policy creation failed, trying alternative method...');
      
      // Try alternative method
      const { error: altInsertError } = await supabase.rpc('create_policy', {
        table_name: 'leads',
        policy_name: 'anyone can insert leads',
        definition: 'true',
        operation: 'INSERT'
      });
      
      if (altInsertError) {
        console.error('Alternative insert policy creation failed:', altInsertError);
        return;
      }
    }
    
    console.log('Insert policy created');
    
    // Policy for admin to read leads
    const { error: readPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "admin can read leads" ON public.leads
        FOR SELECT USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');
      `
    });
    
    if (readPolicyError) {
      console.log('Read policy creation failed, trying alternative method...');
      
      // Try alternative method
      const { error: altReadError } = await supabase.rpc('create_policy', {
        table_name: 'leads',
        policy_name: 'admin can read leads',
        definition: '(auth.jwt()->>\'user_metadata\') like \'%"role":"admin"%\'',
        operation: 'SELECT'
      });
      
      if (altReadError) {
        console.error('Alternative read policy creation failed:', altReadError);
        return;
      }
    }
    
    console.log('Read policy created');
    console.log('RLS policies fixed successfully!');
    
    // Test the insert
    console.log('Testing insert...');
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .insert({
        marca_model: 'test',
        buget: 'test',
        contact: 'test',
        extra: {}
      })
      .select();
    
    if (testError) {
      console.error('Test insert failed:', testError);
    } else {
      console.log('Test insert successful:', testData);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', testData[0].id);
      
      if (deleteError) {
        console.error('Error cleaning up test data:', deleteError);
      } else {
        console.log('Test data cleaned up');
      }
    }
    
  } catch (error) {
    console.error('Error fixing RLS:', error);
  }
}

fixLeadsRLS();
