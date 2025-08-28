const { createClient } = require('@supabase/supabase-js');

// Încarcă variabilele de mediu din .env.local
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      envVars.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    }
  } catch (error) {
    console.log('Could not load .env.local, using system environment variables');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey);
  console.log('\nMake sure you have a .env.local file with these variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSettingsTable() {
  try {
    console.log('🔄 Creating settings table...');

    // Create settings table
    const { error: createError } = await supabase
      .from('settings')
      .select('count')
      .limit(1);

    if (createError && createError.code === '42P01') {
      // Table doesn't exist, create it using raw SQL
      console.log('📋 Table does not exist, creating it...');
      
      // Try to create table using RPC if available
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.settings (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            key text UNIQUE NOT NULL,
            value jsonb NOT NULL,
            description text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
          );
        `
      });

      if (rpcError) {
        console.log('⚠️  Could not create table via RPC, you may need to create it manually');
        console.log('SQL to run manually:');
        console.log(`
          CREATE TABLE IF NOT EXISTS public.settings (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            key text UNIQUE NOT NULL,
            value jsonb NOT NULL,
            description text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
          );
        `);
        return;
      }
    }

    console.log('✅ Settings table exists or was created');

    // Insert default settings
    const defaultSettings = [
      {
        key: 'contact_info',
        value: {
          company: {
            name: 'AutoOrder',
            description: 'Soluția ta pentru sourcing auto profesional și transparent',
            website: 'https://autoorder.ro'
          },
          contact: {
            email: 'contact@autoorder.ro',
            phone: '+40 123 456 789',
            address: 'Strada Exemplu, Nr. 123',
            city: 'București',
            postalCode: '010000',
            country: 'România'
          },
          schedule: {
            monday: '09:00 - 18:00',
            tuesday: '09:00 - 18:00',
            wednesday: '09:00 - 18:00',
            thursday: '09:00 - 18:00',
            friday: '09:00 - 18:00',
            saturday: '10:00 - 16:00',
            sunday: 'Închis'
          },
          social: {
            facebook: 'https://facebook.com/autoorder',
            instagram: 'https://instagram.com/autoorder',
            linkedin: 'https://linkedin.com/company/autoorder',
            youtube: 'https://youtube.com/@autoorder'
          }
        },
        description: 'Contact information and company details'
      }
    ];

    for (const setting of defaultSettings) {
      const { error: insertError } = await supabase
        .from('settings')
        .upsert(setting, { onConflict: 'key' });

      if (insertError) {
        console.error(`❌ Error inserting ${setting.key}:`, insertError);
      } else {
        console.log(`✅ Inserted/Updated ${setting.key}`);
      }
    }

    console.log('\n🎉 Settings table setup completed!');
    
    // Verify
    const { data: settings, error: selectError } = await supabase
      .from('settings')
      .select('*');
    
    if (selectError) {
      console.error('❌ Error verifying:', selectError);
    } else {
      console.log(`✅ Table verified with ${settings.length} records`);
      settings.forEach(setting => {
        console.log(`   - ${setting.key}: ${setting.description}`);
      });
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

createSettingsTable();
