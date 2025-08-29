#!/usr/bin/env node

/**
 * Script to fix the testimonials table schema
 * This script applies the migration to fix the column mismatch
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔧 Fixing Testimonials Table Schema...');
console.log('   - Supabase URL:', supabaseUrl);

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTestimonialsSchema() {
  try {
    console.log('\n📋 Step 1: Checking current table structure...');
    
    // Check current table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'testimonials')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error checking table structure:', columnsError);
      return false;
    }

    console.log('Current columns:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
    });

    console.log('\n📋 Step 2: Adding missing columns...');
    
    // Add missing columns
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.testimonials 
        ADD COLUMN IF NOT EXISTS author text,
        ADD COLUMN IF NOT EXISTS avatar_url text,
        ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
      `
    });

    if (alterError) {
      console.error('❌ Error adding columns:', alterError);
      return false;
    }

    console.log('✅ Added missing columns');

    console.log('\n📋 Step 3: Copying data from old columns to new columns...');
    
    // Copy data from old columns to new columns
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.testimonials 
        SET 
          author = name,
          avatar_url = avatar,
          is_featured = CASE WHEN badge = 'Featured' THEN true ELSE false END,
          order_index = COALESCE(order_index, 0)
        WHERE author IS NULL;
      `
    });

    if (updateError) {
      console.error('❌ Error updating data:', updateError);
      return false;
    }

    console.log('✅ Copied data to new columns');

    console.log('\n📋 Step 4: Making new columns NOT NULL where appropriate...');
    
    // Make new columns NOT NULL
    const { error: notNullError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.testimonials 
        ALTER COLUMN author SET NOT NULL,
        ALTER COLUMN is_featured SET NOT NULL,
        ALTER COLUMN order_index SET NOT NULL;
      `
    });

    if (notNullError) {
      console.error('❌ Error setting NOT NULL constraints:', notNullError);
      return false;
    }

    console.log('✅ Set NOT NULL constraints');

    console.log('\n📋 Step 5: Creating indexes for new columns...');
    
    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_testimonials_author ON public.testimonials(author);
        CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
        CREATE INDEX IF NOT EXISTS idx_testimonials_order_index ON public.testimonials(order_index);
      `
    });

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
      return false;
    }

    console.log('✅ Created indexes');

    console.log('\n📋 Step 6: Updating RLS policies...');
    
    // Update RLS policies
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
        DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;

        CREATE POLICY "public can read active testimonials" ON public.testimonials
          FOR SELECT USING (active = true);

        CREATE POLICY "admin can manage testimonials" ON public.testimonials
          FOR ALL USING (true)
          WITH CHECK (true);
      `
    });

    if (policyError) {
      console.error('❌ Error updating policies:', policyError);
      return false;
    }

    console.log('✅ Updated RLS policies');

    console.log('\n📋 Step 7: Verifying the updated schema...');
    
    // Check final table structure
    const { data: finalColumns, error: finalError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'testimonials')
      .order('ordinal_position');

    if (finalError) {
      console.error('❌ Error checking final structure:', finalError);
      return false;
    }

    console.log('Final columns:');
    finalColumns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
    });

    // Test data access
    const { data: testData, error: testError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Error testing data access:', testError);
      return false;
    }

    console.log('\n✅ Schema update completed successfully!');
    console.log(`   - Total testimonials: ${testData?.length || 0}`);
    
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting testimonials schema fix...\n');
  
  const success = await fixTestimonialsSchema();
  
  if (success) {
    console.log('\n🎉 Testimonials table schema has been fixed!');
    console.log('   The application should now work without the "author column" error.');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh the admin testimonials page');
    console.log('   2. Try to create/edit a testimonial');
    console.log('   3. Verify no more schema errors');
  } else {
    console.log('\n❌ Failed to fix testimonials schema');
    console.log('   Check the error messages above for details');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fixTestimonialsSchema };
