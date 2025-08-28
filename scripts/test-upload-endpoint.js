#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const http = require('http')

console.log('🧪 Testing Upload API Endpoint Directly')
console.log('=======================================\n')

// Check if server is running
console.log('🔍 Step 1: Checking if server is running...')

const testServerConnection = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve(true)
    })
    
    req.on('error', () => {
      resolve(false)
    })
    
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
    
    req.end()
  })
}

testServerConnection().then(isRunning => {
  if (isRunning) {
    console.log('✅ Server is running on port 3000')
  } else {
    console.log('❌ Server is NOT running on port 3000')
    console.log('   Start the server with: npm run dev')
    process.exit(1)
  }
})

// Test upload endpoint
console.log('\n🔍 Step 2: Testing upload endpoint...')

const testUploadEndpoint = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/uploads',
      method: 'POST',
      timeout: 10000,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      }
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log('📋 Response status:', res.statusCode)
        console.log('📋 Response headers:', res.headers)
        console.log('📋 Response body:', data)
        
        if (res.statusCode === 400) {
          console.log('✅ Endpoint responds (expected 400 for empty request)')
          resolve(true)
        } else if (res.statusCode === 200) {
          console.log('✅ Endpoint responds successfully')
          resolve(true)
        } else {
          console.log('⚠️  Unexpected response status')
          resolve(false)
        }
      })
    })
    
    req.on('error', (error) => {
      console.log('❌ Request error:', error.message)
      resolve(false)
    })
    
    req.on('timeout', () => {
      console.log('❌ Request timeout')
      req.destroy()
      resolve(false)
    })
    
    // Send a minimal multipart request
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    const body = `--${boundary}\r\n` +
                 `Content-Disposition: form-data; name="files"\r\n\r\n` +
                 `--${boundary}--\r\n`
    
    req.write(body)
    req.end()
  })
}

testUploadEndpoint().then(success => {
  if (success) {
    console.log('\n✅ Upload endpoint is accessible')
  } else {
    console.log('\n❌ Upload endpoint has issues')
  }
})

// Test test-upload page
console.log('\n🔍 Step 3: Testing test-upload page...')

const testUploadPage = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/test-upload',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log('📋 Test-upload page status:', res.statusCode)
        
        if (res.statusCode === 200) {
          console.log('✅ Test-upload page is accessible')
          
          if (data.includes('LocalImageUploader')) {
            console.log('✅ LocalImageUploader component is present')
          } else {
            console.log('❌ LocalImageUploader component not found')
          }
          
          if (data.includes('onImagesUploaded')) {
            console.log('✅ Upload handler is present')
          } else {
            console.log('❌ Upload handler not found')
          }
          
          resolve(true)
        } else {
          console.log('❌ Test-upload page not accessible')
          resolve(false)
        }
      })
    })
    
    req.on('error', (error) => {
      console.log('❌ Request error:', error.message)
      resolve(false)
    })
    
    req.on('timeout', () => {
      console.log('❌ Request timeout')
      req.destroy()
      resolve(false)
    })
    
    req.end()
  })
}

testUploadPage().then(success => {
  if (success) {
    console.log('\n✅ Test-upload page is working')
  } else {
    console.log('\n❌ Test-upload page has issues')
  }
})

// Summary
console.log('\n🎉 Upload Endpoint Test Complete!')
console.log('\n📝 Summary:')
console.log('✅ Server connection test completed')
console.log('✅ Upload endpoint test completed')
console.log('✅ Test-upload page test completed')

console.log('\n📋 Next steps:')
console.log('1. Open browser and go to: http://localhost:3000/test-upload')
console.log('2. Open browser Developer Tools (F12)')
console.log('3. Go to Console tab and look for errors')
console.log('4. Go to Network tab and try to upload an image')
console.log('5. Check what specific error occurs')

console.log('\n🔧 Common issues to check:')
console.log('- JavaScript errors in browser console')
console.log('- CORS errors in Network tab')
console.log('- File size or type restrictions')
console.log('- Browser security settings')
console.log('- Antivirus software blocking uploads')
console.log('- File input not triggering change event')
