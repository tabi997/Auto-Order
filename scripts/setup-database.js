#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 AutoOrder Database Setup Script');
console.log('=====================================\n');

// Read migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');

function readMigrationFile(filename) {
  const filePath = path.join(migrationsDir, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return null;
}

console.log('📋 Migration Files Found:');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

migrationFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`);
});

console.log('\n📝 Instructions pentru aplicarea migrărilor:');
console.log('=============================================');

console.log('\n1. Mergi la Supabase Dashboard > SQL Editor');
console.log('2. Aplică migrările în următoarea ordine:\n');

migrationFiles.forEach((file, index) => {
  const content = readMigrationFile(file);
  if (content) {
    console.log(`\n--- ${file} ---`);
    console.log(content);
    console.log('\n--- End of migration ---\n');
  }
});

console.log('🔐 Configurare Admin User:');
console.log('==========================');
console.log('1. Mergi la Authentication > Users');
console.log('2. Click "Add user"');
console.log('3. Completează:');
console.log('   - Email: admin@autoorder.ro');
console.log('   - Password: admin123');
console.log('   - User metadata:');
console.log('   {');
console.log('     "role": "admin",');
console.log('     "name": "Admin User"');
console.log('   }');

console.log('\n🌐 Configurare Variabile de Mediu:');
console.log('==================================');
console.log('Creează fișierul .env.local cu:');
console.log(`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned

# Email Configuration (optional)
RESEND_API_KEY=your_resend_api_key_here
`);

console.log('\n✅ După completarea pașilor:');
console.log('1. Rulează: pnpm dev');
console.log('2. Testează: http://localhost:3000/admin');
console.log('3. Login cu: admin@autoorder.ro / admin123');

console.log('\n🎯 Rezultat Final:');
console.log('- Admin Panel complet funcțional');
console.log('- CRUD vehicule');
console.log('- Upload imagini Cloudinary');
console.log('- Featured system');
console.log('- Gestionare lead-uri');
console.log('- Zero erori TypeScript');
