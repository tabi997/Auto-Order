/**
 * Apply RLS Policy Fixes
 * Script pentru a aplica corecțiile RLS direct în baza de date
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Apply RLS Policy Fixes')
console.log('=========================')

async function applyRLSFixes() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Lipsesc variabilele de mediu necesare:')
      console.log('   - NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
      console.log('   - SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
      return
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Citește script-ul SQL pentru corecții
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'fix-rls-policies.sql'), 
      'utf8'
    )

    console.log('📜 Aplicare script RLS fix...')
    
    // Împarte script-ul în comenzi individuale
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    console.log(`📝 ${commands.length} comenzi de executat`)

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      if (command.startsWith('SELECT')) {
        // Pentru comenzi SELECT, afișăm rezultatele
        console.log(`\n🔍 Execuție comandă ${i + 1}: SELECT...`)
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: command + ';' 
        })
        
        if (error) {
          console.error(`❌ Eroare la comanda ${i + 1}:`, error.message)
        } else {
          console.log('✅ Succes')
          if (data && data.length > 0) {
            console.log('📊 Rezultate:')
            data.slice(0, 5).forEach(row => {
              console.log(`   - ${JSON.stringify(row)}`)
            })
            if (data.length > 5) {
              console.log(`   ... și încă ${data.length - 5} rânduri`)
            }
          }
        }
      } else {
        // Pentru alte comenzi, le executăm direct
        console.log(`\n⚙️ Execuție comandă ${i + 1}: ${command.substring(0, 50)}...`)
        
        try {
          // Folosim rpc pentru a executa comenzi SQL brute
          const { error } = await supabase.rpc('exec_sql', { 
            query: command + ';' 
          })
          
          if (error) {
            console.error(`❌ Eroare la comanda ${i + 1}:`, error.message)
          } else {
            console.log('✅ Succes')
          }
        } catch (err) {
          console.error(`❌ Eroare la execuția comenzii ${i + 1}:`, err.message)
        }
      }
    }

    console.log('\n🎉 Script RLS fix aplicat!')

    // Verificare finală - citim toate policy-urile
    console.log('\n🔍 Verificare finală - toate policy-urile admin:')
    const { data: finalPolicies, error: finalError } = await supabase
      .from('pg_policies')
      .select('schemaname, tablename, policyname, cmd, qual, with_check')
      .eq('schemaname', 'public')
      .like('qual', '%admin%')
      .order('tablename, policyname')

    if (finalError) {
      console.error('❌ Eroare la verificarea finală:', finalError)
    } else {
      console.log(`📊 ${finalPolicies.length} policy-uri găsite:`)
      finalPolicies.forEach(policy => {
        console.log(`   📋 ${policy.tablename}.${policy.policyname} (${policy.cmd})`)
        if (policy.qual) {
          const isCorrect = policy.qual.includes('::jsonb')
          console.log(`      Condition: ${policy.qual} ${isCorrect ? '✅' : '❌'}`)
        }
      })
    }

  } catch (error) {
    console.error('❌ Eroare generală:', error)
  }
}

// Funcție pentru a crea funcția exec_sql dacă nu există
async function ensureExecSqlFunction() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result json;
    BEGIN
      EXECUTE query;
      GET DIAGNOSTICS result = ROW_COUNT;
      RETURN json_build_object('rows_affected', result);
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'SQL execution failed: %', SQLERRM;
    END;
    $$;
  `
  
  try {
    const { error } = await supabase.rpc('exec', { sql: createFunctionSQL })
    if (error) {
      console.log('⚠️ Nu s-a putut crea funcția exec_sql, se va folosi metoda alternativă')
    } else {
      console.log('✅ Funcția exec_sql este disponibilă')
    }
  } catch (err) {
    console.log('⚠️ Se va folosi metoda alternativă pentru execuția SQL')
  }
}

// Rulare script
async function main() {
  await ensureExecSqlFunction()
  await applyRLSFixes()
}

main()
