#!/usr/bin/env node

async function testTestimonialsAPI() {
  console.log('🧪 Testing Testimonials API...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test GET /api/testimonials
    console.log('1️⃣ Testing GET /api/testimonials...');
    const getResponse = await fetch(`${baseUrl}/api/testimonials`);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET successful');
      console.log(`   Found ${data.testimonials?.length || 0} testimonials`);
      if (data.testimonials && data.testimonials.length > 0) {
        console.log(`   First testimonial: ${data.testimonials[0].name}`);
      }
    } else {
      console.log('❌ GET failed:', getResponse.status, getResponse.statusText);
    }

    console.log('\n2️⃣ Testing POST /api/testimonials (should fail without auth)...');
    const postResponse = await fetch(`${baseUrl}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        role: 'Tester',
        company: 'Test Company',
        rating: 5,
        content: 'This is a test testimonial',
        badge: 'Test Badge',
        active: true
      }),
    });

    if (postResponse.status === 401) {
      console.log('✅ POST correctly blocked (unauthorized)');
    } else {
      console.log('⚠️  POST response unexpected:', postResponse.status, postResponse.statusText);
    }

    console.log('\n3️⃣ Testing API structure...');
    if (getResponse.ok) {
      const data = await getResponse.json();
      const testimonial = data.testimonials?.[0];
      
      if (testimonial) {
        const requiredFields = ['id', 'name', 'role', 'rating', 'content', 'badge', 'active', 'created_at'];
        const missingFields = requiredFields.filter(field => !(field in testimonial));
        
        if (missingFields.length === 0) {
          console.log('✅ All required fields present');
        } else {
          console.log('❌ Missing fields:', missingFields);
        }
        
        console.log('   Sample testimonial structure:', {
          id: testimonial.id?.substring(0, 8) + '...',
          name: testimonial.name,
          role: testimonial.role,
          rating: testimonial.rating,
          active: testimonial.active
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🎯 Test completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run the SQL script in Supabase dashboard');
  console.log('   2. Restart your Next.js development server');
  console.log('   3. Test the admin panel at /admin/settings/testimonials');
  console.log('   4. Verify testimonials appear on homepage');
}

// Run the test
testTestimonialsAPI().catch(console.error);
