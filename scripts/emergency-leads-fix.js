#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY RLS FIX FOR LEADS TABLE');
console.log('=====================================\n');

console.log('⚠️  This is an emergency fix that will completely reset the RLS policies');
console.log('   on your leads table. Use this if the regular fix didn\'t work.\n');

console.log('📋 Steps to apply the emergency fix:\n');

console.log('1. 📱 Open your Supabase dashboard:');
console.log('   https://supabase.com/dashboard/project/gpazhzixylrapqmclygw\n');

console.log('2. 🗄️  Go to the SQL Editor section');

console.log('3. 📝 Copy and paste the following SQL commands:\n');

// Read the emergency migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/005_emergency_leads_rls_fix.sql');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');

console.log('```sql');
console.log(migrationContent);
console.log('```\n');

console.log('4. ▶️  Click "Run" to execute the commands');

console.log('5. ✅ After running, you should see:');
console.log('   - A table showing the created policies');
console.log('   - A test record being created successfully');

console.log('\n6. 🧪 Test the contact form by going to:');
console.log('   http://localhost:3001/contact');

console.log('\n7. 🔄 Switch the form back to use the leads API:');
console.log('   In ContactForm.tsx, change line 79 from:');
console.log('   const response = await fetch(\'/api/contact\', {');
console.log('   to:');
console.log('   const response = await fetch(\'/api/leads\', {');

console.log('\n8. 🗑️  Clean up the test record (optional):');
console.log('   You can delete the test record created by the migration');

console.log('\n⚠️  Important Notes:');
console.log('   - This fix completely resets RLS on the leads table');
console.log('   - It will drop ALL existing policies and recreate them');
console.log('   - Make sure you have admin access to your Supabase project');
console.log('   - If you get permission errors, you may need to use a service role key');

console.log('\n🎯 If this still doesn\'t work:');
console.log('   - Check if you have the necessary permissions in Supabase');
console.log('   - Try using a service role key instead of the anon key');
console.log('   - Contact Supabase support if you continue to have issues');

console.log('\n📞 Need help? Check:');
console.log('   - Supabase RLS documentation: https://supabase.com/docs/guides/auth/row-level-security');
console.log('   - Supabase support: https://supabase.com/support');
