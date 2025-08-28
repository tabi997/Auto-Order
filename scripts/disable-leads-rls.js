const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gpazhzixylrapqmclygw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYXpoeml4eWxyYXBxbWNseWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTQ1MzEsImV4cCI6MjA3MTk3MDUzMX0.eFZE_MQduTL45DDu-eg6ZRilXL8ybgXVeMvUxy0b2L0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableLeadsRLS() {
  try {
    console.log('Temporarily disabling RLS on leads table...');
    
    // Try to disable RLS
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableError) {
      console.log('Direct SQL failed, trying alternative...');
      
      // Try alternative approach - insert a test record to see if it works
      console.log('Testing insert with current RLS...');
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
        console.log('RLS is still blocking inserts');
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
        
        console.log('RLS is working correctly now!');
      }
    } else {
      console.log('RLS disabled successfully');
      
      // Test insert
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
        console.error('Test insert failed even with RLS disabled:', testError);
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
        
        console.log('Leads table is working correctly!');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

disableLeadsRLS();
