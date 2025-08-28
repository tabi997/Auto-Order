const fs = require('fs');
const path = require('path');

function testSQLSyntax() {
  try {
    console.log('🔍 Testing SQL syntax...\n');
    
    // Read the correct SQL file
    const sqlPath = path.join(__dirname, 'settings-table-sql-correct.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('✅ SQL file loaded successfully');
    console.log(`📄 File size: ${sqlContent.length} characters`);
    
    // Check for common syntax issues
    const checks = [
      {
        name: 'CREATE TABLE',
        pattern: /CREATE TABLE IF NOT EXISTS public\.settings/,
        required: true
      },
      {
        name: 'INSERT statements',
        pattern: /INSERT INTO public\.settings/,
        required: true
      },
      {
        name: 'RLS enable',
        pattern: /ALTER TABLE public\.settings ENABLE ROW LEVEL SECURITY/,
        required: true
      },
      {
        name: 'DROP POLICY statements',
        pattern: /DROP POLICY IF EXISTS/,
        required: true
      },
      {
        name: 'CREATE POLICY statements',
        pattern: /CREATE POLICY/,
        required: true
      },
      {
        name: 'CREATE INDEX statements',
        pattern: /CREATE INDEX IF NOT EXISTS/,
        required: true
      },
      {
        name: 'Trigger creation',
        pattern: /CREATE TRIGGER/,
        required: false
      }
    ];
    
    console.log('\n📋 Running syntax checks...\n');
    
    checks.forEach(check => {
      const found = check.pattern.test(sqlContent);
      const status = found ? '✅' : (check.required ? '❌' : '⚠️');
      const message = check.required ? 'REQUIRED' : 'OPTIONAL';
      
      console.log(`${status} ${check.name}: ${found ? 'Found' : 'Not found'} (${message})`);
    });
    
    // Check for problematic patterns
    const problematicPatterns = [
      {
        name: 'IF NOT EXISTS with CREATE POLICY',
        pattern: /CREATE POLICY IF NOT EXISTS/,
        description: 'This syntax is not supported in PostgreSQL'
      },
      {
        name: 'Missing semicolons',
        pattern: /[^;]\s*$/m,
        description: 'Check for statements without semicolons (this may include valid multi-line statements)'
      }
    ];
    
    console.log('\n🚨 Checking for problematic patterns...\n');
    
    problematicPatterns.forEach(check => {
      const found = check.pattern.test(sqlContent);
      const status = found ? '❌' : '✅';
      
      console.log(`${status} ${check.name}: ${found ? 'Found - ' + check.description : 'Not found'}`);
    });
    
    // Count statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n📊 SQL Statistics:`);
    console.log(`   Total statements: ${statements.length}`);
    console.log(`   Lines of code: ${sqlContent.split('\n').length}`);
    
    if (statements.length >= 6) {
      console.log('✅ SQL appears to be complete');
    } else {
      console.log('⚠️  SQL might be incomplete');
    }
    
    console.log('\n🎉 SQL syntax check completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy the SQL from scripts/settings-table-sql-correct.sql');
    console.log('2. Paste it in Supabase Dashboard → SQL Editor');
    console.log('3. Run the SQL');
    console.log('4. Test with: node scripts/verify-settings-table.js');
    
  } catch (error) {
    console.error('❌ Error testing SQL:', error.message);
  }
}

testSQLSyntax();
