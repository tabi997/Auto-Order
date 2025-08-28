#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Database RLS Fix for Leads Table');
console.log('====================================\n');

console.log('📋 To fix the database RLS policies, follow these steps:\n');

console.log('1. 📱 Open your Supabase dashboard:');
console.log('   https://supabase.com/dashboard/project/gpazhzixylrapqmclygw\n');

console.log('2. 🗄️  Go to the SQL Editor section');

console.log('3. 📝 Copy and paste the following SQL commands:\n');

// Read the migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/004_fix_leads_rls.sql');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');

console.log('```sql');
console.log(migrationContent);
console.log('```\n');

console.log('4. ▶️  Click "Run" to execute the commands');

console.log('5. ✅ Verify the policies were created by checking the output');

console.log('\n📊 After running, you should see a table showing the created policies:');
console.log('   - anyone can insert leads (INSERT)');
console.log('   - admin can read leads (SELECT)');
console.log('   - admin can update leads (UPDATE)');
console.log('   - admin can delete leads (DELETE)\n');

console.log('6. 🧪 Test the contact form by going to:');
console.log('   http://localhost:3001/contact\n');

console.log('7. 🔄 Once the database is fixed, you can switch the form back to use the leads API');
console.log('   by changing the fetch URL in ContactForm.tsx from "/api/contact" back to "/api/leads"\n');

console.log('⚠️  Note: If you encounter any errors, make sure you have the necessary permissions');
console.log('   to modify RLS policies in your Supabase project.\n');

console.log('🎯 Alternative approach: If the above doesn\'t work, you can also:');
console.log('   - Temporarily disable RLS on the leads table');
console.log('   - Or create a service role key with higher permissions\n');

console.log('📞 Need help? Check the Supabase documentation on RLS policies:');
console.log('   https://supabase.com/docs/guides/auth/row-level-security');
