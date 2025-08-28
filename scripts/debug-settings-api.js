/**
 * Debug Settings API
 * Script pentru a testa și depana API-ul de setări
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Debug Settings API')
console.log('=====================')

async function debugSettingsAPI() {
  try {
    // Test 1: Verificare conexiune cu service role
    console.log('\n1️⃣ Test conexiune cu service role...')
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: settingsData, error: settingsError } = await serviceClient
      .from('settings')
      .select('*')
    
    if (settingsError) {
      console.error('❌ Eroare la citirea setărilor cu service role:', settingsError)
    } else {
      console.log('✅ Citire setări cu service role reușită')
      console.log(`📊 Numărul de setări: ${settingsData.length}`)
      settingsData.forEach(setting => {
        console.log(`   - ${setting.key}: ${setting.description || 'Fără descriere'}`)
      })
    }

    // Test 2: Verificare conexiune cu anon key
    console.log('\n2️⃣ Test conexiune cu anon key...')
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: anonData, error: anonError } = await anonClient
      .from('settings')
      .select('*')
    
    if (anonError) {
      console.error('❌ Eroare la citirea setărilor cu anon key:', anonError)
    } else {
      console.log('✅ Citire setări cu anon key reușită')
      console.log(`📊 Numărul de setări: ${anonData.length}`)
    }

    // Test 3: Verificare RLS policies
    console.log('\n3️⃣ Test RLS policies...')
    const { data: policies, error: policiesError } = await serviceClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'settings')
      .eq('schemaname', 'public')
    
    if (policiesError) {
      console.error('❌ Eroare la citirea RLS policies:', policiesError)
    } else {
      console.log('✅ RLS policies pentru settings:')
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd}`)
        console.log(`     Condition: ${policy.qual || 'N/A'}`)
        console.log(`     With Check: ${policy.with_check || 'N/A'}`)
      })
    }

    // Test 4: Simulare update cu admin role fake
    console.log('\n4️⃣ Test simulare autentificare admin...')
    
    // Creăm un client cu un admin user fake pentru test
    const testClient = createClient(supabaseUrl, supabaseAnonKey)
    
    // Încercăm să facem un update (va eșua din cauza RLS)
    const { data: updateData, error: updateError } = await testClient
      .from('settings')
      .update({ value: { test: 'debug' } })
      .eq('key', 'contact_info')
    
    if (updateError) {
      console.log('⚠️ Update eșuat cu anon key (normal):', updateError.message)
    } else {
      console.log('⚠️ Update reușit cu anon key (neașteptat!)')
    }

    // Test 5: Test direct cu service role pentru update
    console.log('\n5️⃣ Test update cu service role...')
    const { data: serviceUpdateData, error: serviceUpdateError } = await serviceClient
      .from('settings')
      .update({ 
        value: { 
          ...settingsData.find(s => s.key === 'contact_info')?.value,
          company: {
            ...settingsData.find(s => s.key === 'contact_info')?.value?.company,
            name: 'Test Debug'
          }
        },
        updated_at: new Date().toISOString()
      })
      .eq('key', 'contact_info')
      .select()
    
    if (serviceUpdateError) {
      console.error('❌ Update cu service role eșuat:', serviceUpdateError)
    } else {
      console.log('✅ Update cu service role reușit')
      console.log('📄 Date actualizate:', serviceUpdateData)
    }

    // Test 6: Verificare user metadata în JWT
    console.log('\n6️⃣ Test JWT și user metadata...')
    
    // Încercăm să obținem informații despre utilizatorul current
    const { data: { user }, error: userError } = await anonClient.auth.getUser()
    
    if (userError || !user) {
      console.log('⚠️ Nu există utilizator autentificat (normal pentru test)')
    } else {
      console.log('👤 Utilizator autentificat:')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Rol: ${user.user_metadata?.role || 'Nedefinit'}`)
    }

    console.log('\n✅ Debug complet!')

  } catch (error) {
    console.error('❌ Eroare generală:', error)
  }
}

// Verificăm dacă avem variabilele de mediu necesare
if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('❌ Lipsesc variabilele de mediu necesare:')
  console.log('   - NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('   - SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  process.exit(1)
}

debugSettingsAPI()
