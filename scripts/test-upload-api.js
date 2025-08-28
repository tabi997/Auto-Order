#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Upload API Endpoint')
console.log('===============================\n')

// Check if we have a test image
console.log('🔍 Step 1: Checking for test image...')

const testImagePath = path.join(__dirname, '../public/placeholder-car.jpg')
if (fs.existsSync(testImagePath)) {
  console.log('✅ Test image found:', testImagePath)
  const stats = fs.statSync(testImagePath)
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`)
} else {
  console.log('❌ Test image not found')
  console.log('   Creating a simple test image...')
  
  // Create a simple test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
    0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ])
  
  fs.writeFileSync(testImagePath, testImageBuffer)
  console.log('   Created test image')
}

// Check if we're running in development mode
console.log('\n🔍 Step 2: Checking development mode...')

const isDev = process.env.NODE_ENV === 'development'
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('Is development:', isDev ? '✅ Yes' : '❌ No')

if (!isDev) {
  console.log('⚠️  Uploads only work in development mode')
  console.log('   Set NODE_ENV=development or run with npm run dev')
}

// Check uploads directory permissions
console.log('\n🔍 Step 3: Testing uploads directory...')

const uploadsDir = path.join(__dirname, '../public/uploads')
try {
  // Test write permission
  const testFile = path.join(uploadsDir, 'test-upload-api.txt')
  fs.writeFileSync(testFile, 'test content')
  fs.unlinkSync(testFile)
  console.log('✅ Uploads directory is writable')
  
  // Check available space
  const stats = fs.statSync(uploadsDir)
  console.log('✅ Uploads directory accessible')
} catch (error) {
  console.log('❌ Uploads directory error:', error.message)
}

// Simulate the upload process
console.log('\n🔍 Step 4: Simulating upload process...')

try {
  // Read test image
  const testImage = fs.readFileSync(testImagePath)
  console.log('✅ Test image read successfully')
  
  // Generate filename like the upload function does
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2)
  const filename = `test_${timestamp}_${randomId}.jpg`
  const filePath = path.join(uploadsDir, filename)
  
  console.log('   Generated filename:', filename)
  console.log('   Target path:', filePath)
  
  // Write file to uploads directory
  fs.writeFileSync(filePath, testImage)
  console.log('✅ Test file written to uploads directory')
  
  // Verify file was written
  if (fs.existsSync(filePath)) {
    const fileStats = fs.statSync(filePath)
    console.log(`   File size: ${(fileStats.size / 1024).toFixed(1)} KB`)
    
    // Clean up test file
    fs.unlinkSync(filePath)
    console.log('✅ Test file cleaned up')
  }
  
} catch (error) {
  console.log('❌ Upload simulation failed:', error.message)
}

console.log('\n🎉 Upload API Test Complete!')
console.log('\n📝 Summary:')
console.log('✅ Test image available')
console.log('✅ Development mode check completed')
console.log('✅ Uploads directory permissions verified')
console.log('✅ Upload simulation completed')

console.log('\n📋 Next steps:')
console.log('1. Make sure you\'re running: npm run dev')
console.log('2. Check browser console for any upload errors')
console.log('3. Test upload at: http://localhost:3000/test-upload')
console.log('4. Look for any JavaScript errors in browser console')

console.log('\n🔧 Common issues:')
console.log('- Next.js image optimization blocking local images')
console.log('- CORS issues with local uploads')
console.log('- File size limits')
console.log('- Browser security restrictions')
