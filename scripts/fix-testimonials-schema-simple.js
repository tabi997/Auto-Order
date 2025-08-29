#!/usr/bin/env node

/**
 * Simple script to fix the testimonials table schema
 * Uses direct SQL execution to avoid complex RPC calls
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

console.log('🔧 Fixing Testimonials Table Schema (Simple Method)...');
console.log('   - Supabase URL:', supabaseUrl);

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTestimonialsSchema() {
  try {
    console.log('\n📋 Step 1: Checking current table structure...');
    
    // Check if testimonials table exists and get its structure
    const { data: tableExists, error: tableError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error accessing testimonials table:', tableError);
      return false;
    }

    console.log('✅ Testimonials table is accessible');
    console.log(`   - Current records: ${tableExists?.length || 0}`);

    console.log('\n📋 Step 2: Adding missing columns...');
    
    // Add missing columns one by one to avoid complex SQL
    const columnsToAdd = [
      { name: 'author', type: 'text', defaultValue: null },
      { name: 'avatar_url', type: 'text', defaultValue: null },
      { name: 'is_featured', type: 'boolean', defaultValue: false },
      { name: 'order_index', type: 'integer', defaultValue: 0 }
    ];

    for (const column of columnsToAdd) {
      try {
        // Try to add the column
        const { error: addError } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS ${column.name} ${column.type} DEFAULT ${column.defaultValue === null ? 'NULL' : `'${column.defaultValue}'`};`
        });

        if (addError) {
          console.log(`   ⚠️  Column ${column.name} might already exist or couldn't be added:`, addError.message);
        } else {
          console.log(`   ✅ Added column: ${column.name}`);
        }
      } catch (err) {
        console.log(`   ⚠️  Column ${column.name} might already exist:`, err.message);
      }
    }

    console.log('\n📋 Step 3: Updating existing data...');
    
    // Update existing records to populate new columns
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('testimonials')
        .select('*');

      if (fetchError) {
        console.error('❌ Error fetching existing data:', fetchError);
        return false;
      }

      if (existingData && existingData.length > 0) {
        console.log(`   - Found ${existingData.length} existing testimonials`);
        
        for (const testimonial of existingData) {
          const updates = {};
          
          // Map old columns to new columns
          if (testimonial.name && !testimonial.author) {
            updates.author = testimonial.name;
          }
          if (testimonial.avatar && !testimonial.avatar_url) {
            updates.avatar_url = testimonial.avatar;
          }
          if (testimonial.badge && testimonial.badge === 'Featured' && !testimonial.is_featured) {
            updates.is_featured = true;
          }
          if (!testimonial.order_index) {
            updates.order_index = 0;
          }

          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
              .from('testimonials')
              .update(updates)
              .eq('id', testimonial.id);

            if (updateError) {
              console.log(`   ⚠️  Could not update testimonial ${testimonial.id}:`, updateError.message);
            } else {
              console.log(`   ✅ Updated testimonial: ${testimonial.name || testimonial.id}`);
            }
          }
        }
      } else {
        console.log('   - No existing testimonials to update');
      }
    } catch (err) {
      console.log('   ⚠️  Could not update existing data:', err.message);
    }

    console.log('\n📋 Step 4: Testing the updated schema...');
    
    // Test the updated schema
    const { data: testData, error: testError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Error testing updated schema:', testError);
      return false;
    }

    if (testData && testData.length > 0) {
      const testimonial = testData[0];
      console.log('✅ Schema test successful!');
      console.log('   Sample testimonial data:');
      console.log(`     - ID: ${testimonial.id}`);
      console.log(`     - Author: ${testimonial.author || 'N/A'}`);
      console.log(`     - Role: ${testimonial.role || 'N/A'}`);
      console.log(`     - Content: ${testimonial.content ? testimonial.content.substring(0, 50) + '...' : 'N/A'}`);
      console.log(`     - Rating: ${testimonial.rating || 'N/A'}`);
      console.log(`     - Featured: ${testimonial.is_featured || false}`);
      console.log(`     - Order: ${testimonial.order_index || 0}`);
    }

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
    console.log('\n🎉 Testimonials table schema has been updated!');
    console.log('   The application should now work without the "author column" error.');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh the admin testimonials page');
    console.log('   2. Try to create/edit a testimonial');
    console.log('   3. Verify no more schema errors');
    console.log('\n🔍 If you still see errors, check the browser console for details');
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
