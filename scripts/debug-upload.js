#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Debug Upload Issues - Detailed Analysis')
console.log('==========================================\n')

// Check environment
console.log('🔍 Step 1: Environment Analysis...')
console.log('Current directory:', process.cwd())
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('Platform:', process.platform)
console.log('Node version:', process.version)

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ Package.json found in current directory')
} else {
  console.log('❌ Package.json not found - wrong directory?')
  process.exit(1)
}

// Check .env.local
console.log('\n🔍 Step 2: Environment Variables...')
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  console.log('📋 Key variables:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing')
  console.log('  CLOUDINARY_API_KEY:', env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('  CLOUDINARY_API_SECRET:', env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing')
  console.log('  CLOUDINARY_UPLOAD_PRESET:', env.CLOUDINARY_UPLOAD_PRESET ? '✅ Set' : '❌ Missing')
} else {
  console.log('❌ .env.local not found')
}

// Check Next.js config
console.log('\n🔍 Step 3: Next.js Configuration...')
const nextConfigPath = path.join(process.cwd(), 'next.config.js')
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js exists')
  
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
  console.log('📋 Config analysis:')
  
  if (nextConfig.includes('domains')) {
    console.log('  ✅ Contains domains configuration')
  } else {
    console.log('  ❌ Missing domains configuration')
  }
  
  if (nextConfig.includes('unoptimized')) {
    console.log('  ✅ Contains unoptimized configuration')
  } else {
    console.log('  ❌ Missing unoptimized configuration')
  }
  
  if (nextConfig.includes('localhost')) {
    console.log('  ✅ Contains localhost domain')
  } else {
    console.log('  ❌ Missing localhost domain')
  }
  
  console.log('\n📄 Full next.config.js:')
  console.log(nextConfig)
} else {
  console.log('❌ next.config.js not found')
}

// Check uploads directory
console.log('\n🔍 Step 4: Uploads Directory Analysis...')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists:', uploadsDir)
  
  try {
    const stats = fs.statSync(uploadsDir)
    console.log('  Directory stats:')
    console.log('    Mode:', stats.mode.toString(8))
    console.log('    UID:', stats.uid)
    console.log('    GID:', stats.gid)
    console.log('    Size:', stats.size)
    console.log('    Created:', stats.birthtime)
    console.log('    Modified:', stats.mtime)
    
    // Check permissions
    const isReadable = fs.accessSync(uploadsDir, fs.constants.R_OK)
    const isWritable = fs.accessSync(uploadsDir, fs.constants.W_OK)
    const isExecutable = fs.accessSync(uploadsDir, fs.constants.X_OK)
    
    console.log('  Permissions:')
    console.log('    Readable:', isReadable ? '✅' : '❌')
    console.log('    Writable:', isWritable ? '✅' : '❌')
    console.log('    Executable:', isExecutable ? '✅' : '❌')
    
  } catch (error) {
    console.log('  ❌ Error checking directory:', error.message)
  }
  
  // List contents
  try {
    const files = fs.readdirSync(uploadsDir)
    console.log(`  Contents: ${files.length} items`)
    
    if (files.length > 0) {
      console.log('  Sample items:')
      files.slice(0, 5).forEach(file => {
        const filePath = path.join(uploadsDir, file)
        try {
          const stats = fs.statSync(filePath)
          if (stats.isFile()) {
            console.log(`    📄 ${file} (${(stats.size / 1024).toFixed(1)} KB)`)
          } else if (stats.isDirectory()) {
            console.log(`    📁 ${file}/`)
          }
        } catch (e) {
          console.log(`    ❓ ${file} (error reading)`)
        }
      })
    }
  } catch (error) {
    console.log('  ❌ Error reading directory contents:', error.message)
  }
} else {
  console.log('❌ Uploads directory not found')
}

// Test file operations
console.log('\n🔍 Step 5: File Operation Tests...')
try {
  // Test 1: Create a test file
  const testFile = path.join(uploadsDir, 'debug-test.txt')
  const testContent = `Debug test at ${new Date().toISOString()}`
  
  fs.writeFileSync(testFile, testContent)
  console.log('✅ Test file created successfully')
  
  // Test 2: Read the test file
  const readContent = fs.readFileSync(testFile, 'utf8')
  console.log('✅ Test file read successfully')
  console.log('  Content:', readContent)
  
  // Test 3: Check file stats
  const fileStats = fs.statSync(testFile)
  console.log('✅ File stats retrieved')
  console.log('  Size:', fileStats.size, 'bytes')
  console.log('  Created:', fileStats.birthtime)
  
  // Test 4: Delete the test file
  fs.unlinkSync(testFile)
  console.log('✅ Test file deleted successfully')
  
} catch (error) {
  console.log('❌ File operation test failed:', error.message)
  console.log('  Error details:', error)
}

// Check if server is running
console.log('\n🔍 Step 6: Server Status Check...')
const port = 3000
const net = require('net')

const testConnection = () => {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    
    socket.setTimeout(2000)
    
    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })
    
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    
    socket.on('error', () => {
      resolve(false)
    })
    
    socket.connect(port, 'localhost')
  })
}

testConnection().then(isRunning => {
  if (isRunning) {
    console.log(`✅ Server is running on port ${port}`)
  } else {
    console.log(`❌ Server is NOT running on port ${port}`)
    console.log('  Start the server with: npm run dev')
  }
})

// Summary
console.log('\n🎉 Debug Analysis Complete!')
console.log('\n📝 Summary:')
console.log('✅ Environment variables check completed')
console.log('✅ Next.js configuration check completed')
console.log('✅ Uploads directory analysis completed')
console.log('✅ File operation tests completed')
console.log('✅ Server status check completed')

console.log('\n📋 Next steps:')
console.log('1. Make sure server is running: npm run dev')
console.log('2. Check browser console for JavaScript errors')
console.log('3. Check Network tab for failed requests')
console.log('4. Test upload at: http://localhost:3000/test-upload')
console.log('5. Look for specific error messages')

console.log('\n🔧 Common solutions:')
console.log('- Restart the development server')
console.log('- Clear browser cache and cookies')
console.log('- Check browser console for CORS errors')
console.log('- Verify file size and type restrictions')
console.log('- Check if antivirus is blocking uploads')
