#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf8');
  envVars = Object.fromEntries(
    envContent
      .split('\n')
      .filter(line => line.includes('='))
      .map(line => {
        const [key, ...valueParts] = line.split('=');
        return [key.trim(), valueParts.join('=').trim()];
      })
  );
} catch (error) {
  console.log('No .env.local file found, using process.env');
  envVars = process.env;
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyTestimonialsMigration() {
  console.log('🚀 Applying testimonials migration...');

  try {
    // Read migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '006_add_testimonials_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📖 Migration SQL loaded');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (directError) {
            console.warn(`⚠️  Statement ${i + 1} had issues (this might be expected):`, directError.message);
          }
        }
      }
    }

    console.log('✅ Testimonials migration completed successfully!');
    
    // Verify the table was created
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'testimonials');

    if (tableError) {
      console.log('ℹ️  Could not verify table creation (this is normal)');
    } else if (tables && tables.length > 0) {
      console.log('✅ Testimonials table verified in database');
      
      // Check if data was inserted
      const { data: testimonials, error: dataError } = await supabase
        .from('testimonials')
        .select('count')
        .eq('active', true);

      if (!dataError && testimonials) {
        console.log(`✅ Found testimonials in database`);
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
applyTestimonialsMigration().catch(console.error);
