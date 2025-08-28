const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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
    console.log('Could not load .env.local');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySettingsTable() {
  try {
    console.log('🔍 Verifying settings table...');
    
    // Check if table exists
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) {
      console.log('❌ Settings table not found or error:', error.message);
      console.log('\n📋 To create the table, run the SQL from scripts/settings-table-sql.sql');
      console.log('   in your Supabase Dashboard -> SQL Editor');
      return;
    }
    
    console.log(`✅ Settings table found with ${settings.length} records`);
    
    // Display settings
    settings.forEach(setting => {
      console.log(`\n📝 ${setting.key}:`);
      console.log(`   Description: ${setting.description}`);
      console.log(`   Created: ${setting.created_at}`);
      console.log(`   Updated: ${setting.updated_at}`);
      
      if (setting.key === 'contact_info') {
        const contactInfo = setting.value;
        console.log(`   Company: ${contactInfo.company.name}`);
        console.log(`   Email: ${contactInfo.contact.email}`);
        console.log(`   Phone: ${contactInfo.contact.phone}`);
        console.log(`   Address: ${contactInfo.contact.address}, ${contactInfo.contact.city}`);
      }
    });
    
    // Test API endpoint
    console.log('\n🧪 Testing API endpoint...');
    
    try {
      const response = await fetch(`${supabaseUrl.replace('.supabase.co', '.supabase.co')}/rest/v1/settings`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API endpoint works, found ${data.length} settings`);
      } else {
        console.log('❌ API endpoint error:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.log('❌ API test failed:', apiError.message);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

verifySettingsTable();
