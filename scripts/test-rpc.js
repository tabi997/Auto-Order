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

async function testRPC() {
  try {
    console.log('Testing RPC exec_sql...');
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT version();' 
    });
    
    if (error) {
      console.log('❌ RPC error:', error.message);
      console.log('You may need to create the exec_sql function manually');
    } else {
      console.log('✅ RPC works:', data);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testRPC();
