#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌐 AutoOrder Environment Setup');
console.log('==============================\n');

const envPath = path.join(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('Please update it manually with the following variables:\n');
} else {
  console.log('📝 Creating .env.local file...\n');
}

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned

# Email Configuration (optional)
RESEND_API_KEY=your_resend_api_key_here
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
} else {
  console.log('📋 Required environment variables:');
}

console.log('\n' + envContent);

console.log('\n🔧 Setup Instructions:');
console.log('=====================');
console.log('1. Replace the placeholder values with your actual credentials');
console.log('2. Get Supabase credentials from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
console.log('3. Get Cloudinary credentials from: https://cloudinary.com/console');
console.log('4. Create Cloudinary upload preset: Settings > Upload > Upload presets > Create new preset');
console.log('   - Name: autoorder_unsigned');
console.log('   - Signing Mode: Unsigned');
console.log('5. Get Resend API key from: https://resend.com/api-keys (optional)');

console.log('\n🎯 Next Steps:');
console.log('1. Run: pnpm setup:db (to see database setup instructions)');
console.log('2. Apply migrations in Supabase Dashboard');
console.log('3. Create admin user in Supabase Auth');
console.log('4. Run: pnpm dev');
console.log('5. Test: http://localhost:3000/admin');
