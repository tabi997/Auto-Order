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

async function testSettingsSystem() {
  try {
    console.log('🧪 Testing Settings System...\n');
    
    // Test 1: Check if table exists
    console.log('1️⃣ Testing table existence...');
    const { data: settings, error: tableError } = await supabase
      .from('settings')
      .select('*');
    
    if (tableError) {
      console.log('❌ Table not found:', tableError.message);
      console.log('   Run the SQL from scripts/settings-table-sql.sql first');
      return;
    }
    
    console.log(`✅ Table found with ${settings.length} settings`);
    
    // Test 2: Check if contact_info exists
    console.log('\n2️⃣ Testing contact_info setting...');
    const contactInfo = settings.find(s => s.key === 'contact_info');
    
    if (!contactInfo) {
      console.log('❌ contact_info setting not found');
      return;
    }
    
    console.log('✅ contact_info found');
    console.log(`   Company: ${contactInfo.value.company.name}`);
    console.log(`   Email: ${contactInfo.value.contact.email}`);
    console.log(`   Phone: ${contactInfo.value.contact.phone}`);
    
    // Test 3: Test API endpoint
    console.log('\n3️⃣ Testing API endpoint...');
    
    try {
      const baseUrl = supabaseUrl.replace('.supabase.co', '.supabase.co');
      const response = await fetch(`${baseUrl}/rest/v1/settings`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test'}`
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
    
    // Test 4: Test update functionality (admin only)
    console.log('\n4️⃣ Testing update functionality...');
    
    const testUpdate = {
      key: 'contact_info',
      value: {
        ...contactInfo.value,
        contact: {
          ...contactInfo.value.contact,
          phone: '+40 999 999 999' // Test phone
        }
      }
    };
    
    const { error: updateError } = await supabase
      .from('settings')
      .upsert(testUpdate, { onConflict: 'key' });
    
    if (updateError) {
      console.log('❌ Update failed:', updateError.message);
    } else {
      console.log('✅ Update successful');
      
      // Verify update
      const { data: updatedSetting } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'contact_info')
        .single();
      
      if (updatedSetting && updatedSetting.value.contact.phone === '+40 999 999 999') {
        console.log('✅ Update verified');
        
        // Revert to original
        const { error: revertError } = await supabase
          .from('settings')
          .upsert(contactInfo, { onConflict: 'key' });
        
        if (revertError) {
          console.log('⚠️  Could not revert test update');
        } else {
          console.log('✅ Test update reverted');
        }
      } else {
        console.log('❌ Update not verified');
      }
    }
    
    // Test 5: Check RLS policies
    console.log('\n5️⃣ Testing RLS policies...');
    
    // Test public read
    const publicClient = createClient(
      supabaseUrl, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test'
    );
    
    const { data: publicData, error: publicError } = await publicClient
      .from('settings')
      .select('key, description')
      .limit(1);
    
    if (publicError) {
      console.log('❌ Public read failed:', publicError.message);
    } else {
      console.log('✅ Public read works');
    }
    
    console.log('\n🎉 Settings system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Go to /admin/settings/contact');
    console.log('3. Modify contact information');
    console.log('4. Check that changes appear on homepage and footer');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSettingsSystem();
