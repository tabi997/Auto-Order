#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Upload Functionality')
console.log('================================\n')

// Check environment variables
console.log('🔍 Step 1: Checking environment variables...')

const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  console.log('\n📋 Environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing')
  console.log('CLOUDINARY_API_KEY:', env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('CLOUDINARY_API_SECRET:', env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing')
  console.log('CLOUDINARY_UPLOAD_PRESET:', env.CLOUDINARY_UPLOAD_PRESET ? '✅ Set' : '❌ Missing')
} else {
  console.log('❌ .env.local file does not exist')
  console.log('   Create it with the required environment variables')
}

// Check uploads directory
console.log('\n🔍 Step 2: Checking uploads directory...')

const uploadsDir = path.join(__dirname, '../public/uploads')
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists:', uploadsDir)
  
  const files = fs.readdirSync(uploadsDir)
  console.log(`   Found ${files.length} items in uploads directory`)
  
  if (files.length > 0) {
    console.log('   Sample files:')
    files.slice(0, 5).forEach(file => {
      const filePath = path.join(uploadsDir, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        console.log(`     📄 ${file} (${(stats.size / 1024).toFixed(1)} KB)`)
      } else {
        console.log(`     📁 ${file}/`)
      }
    })
  }
} else {
  console.log('❌ Uploads directory does not exist')
}

// Check if we're in development mode
console.log('\n🔍 Step 3: Checking development mode...')

const packageJsonPath = path.join(__dirname, '../package.json')
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  console.log('✅ Package.json found')
  console.log('   Scripts available:')
  console.log('     dev:', packageJson.scripts.dev ? '✅ Available' : '❌ Missing')
  console.log('     build:', packageJson.scripts.build ? '✅ Available' : '❌ Missing')
} else {
  console.log('❌ Package.json not found')
}

// Check Next.js configuration
console.log('\n🔍 Step 4: Checking Next.js configuration...')

const nextConfigPath = path.join(__dirname, '../next.config.js')
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ Next.config.js found')
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
  
  if (nextConfig.includes('experimental')) {
    console.log('   Contains experimental features')
  }
  
  if (nextConfig.includes('images')) {
    console.log('   Contains image configuration')
  }
} else {
  console.log('❌ Next.config.js not found')
}

// Check if uploads directory is writable
console.log('\n🔍 Step 5: Checking uploads directory permissions...')

try {
  const testFile = path.join(uploadsDir, 'test-write.txt')
  fs.writeFileSync(testFile, 'test')
  fs.unlinkSync(testFile)
  console.log('✅ Uploads directory is writable')
} catch (error) {
  console.log('❌ Uploads directory is not writable:', error.message)
}

console.log('\n🎉 Upload Test Complete!')
console.log('\n📝 Summary:')
console.log('✅ Environment variables check completed')
console.log('✅ Uploads directory check completed')
console.log('✅ Development mode check completed')
console.log('✅ Next.js configuration check completed')
console.log('✅ Directory permissions check completed')

console.log('\n📋 Next steps:')
console.log('1. Make sure .env.local exists with required variables')
console.log('2. Ensure you\'re running in development mode (npm run dev)')
console.log('3. Check browser console for any upload errors')
console.log('4. Test upload at: http://localhost:3000/test-upload')
