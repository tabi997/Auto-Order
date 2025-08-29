# Rezolvarea Problemei cu Salvarea Setărilor Admin

## Problema Identificată

Eroarea la salvarea informațiilor din panoul de admin (secțiunea setări) este cauzată de o inconsistență în RLS (Row Level Security) policies din Supabase. Unele policy-uri folosesc sintaxa veche `like '%"role":"admin"%'` în loc de sintaxa corectă `::jsonb->>'role' = 'admin'`.

## Soluții Implementate

### 1. Corecții RLS Policies în Migrații

Am corectat toate RLS policies din următoarele fișiere:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_admin_schema.sql`
- `supabase/migrations/003_simplified_schema.sql`
- `supabase/migrations/004_fix_leads_rls.sql`
- `supabase/migrations/005_emergency_leads_rls_fix.sql`
- `supabase/migrations/006_add_testimonials_table.sql`
- `supabase/migrations/008_create_settings_table.sql`

### 2. Script SQL pentru Corecții Directe

Creat `scripts/fix-rls-policies.sql` pentru a aplica corecțiile direct în baza de date.

### 3. Script de Aplicare Automatizată

Creat `scripts/apply-rls-fix.js` pentru a aplica corecțiile RLS automat.

### 4. Îmbunătățiri API Settings

Am îmbunătățit `src/app/api/admin/settings/route.ts` cu:
- Logging detaliat pentru debugging
- Fallback la service role pentru operații critice
- Tratarea erorilor RLS

### 5. Îmbunătățiri Autentificare

Am îmbunătățit `src/lib/auth.ts` cu logging detaliat pentru debugging.

## Pașii pentru Rezolvare

### Pas 1: Verificare Variabile de Mediu

Asigură-te că ai următoarele variabile setate în `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Pas 2: Aplicare Corecții RLS (Opțiune A - Recomandat)

Rulează script-ul de aplicare corecții:

```bash
cd /Users/tabacui/vibecoding/autoorder
node scripts/apply-rls-fix.js
```

### Pas 3: Aplicare Corecții RLS (Opțiune B - Manual)

Dacă script-ul nu funcționează, aplică manual în Supabase Dashboard SQL Editor:

```sql
-- Copiază conținutul din scripts/fix-rls-policies.sql și execută în Supabase
```

### Pas 4: Verificare Script Debug

Pentru a testa funcționalitatea după corecții:

```bash
node scripts/debug-settings-api.js
```

### Pas 5: Restart Aplicație

După aplicarea corecțiilor, restart aplicația:

```bash
npm run dev
```

## Verificare Soluție

1. **Verificare Console Browser**: Deschide Developer Tools și verifică console-ul pentru mesaje de debugging
2. **Verificare Logs Server**: Verifică terminalul pentru logs din API
3. **Test Salvare**: Încearcă să salvezi setările din admin panel

## Mesaje de Success Așteptate

În console vei vedea:
```
🔐 requireAdmin - Start authentication check
✅ Admin check passed successfully
🔧 Settings API PUT - Start
✅ Admin check passed
💾 Attempting to upsert setting with normal client...
✅ Setting updated successfully
```

## Dacă Problema Persistă

### Debugging Aditional

1. **Verifică utilizatorul admin**:
   ```javascript
   // În browser console
   const { data: user } = await supabase.auth.getUser()
   console.log('User metadata:', user?.user_metadata)
   ```

2. **Verifică RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'settings';
   ```

3. **Test direct în Supabase**:
   - Du-te în Supabase Dashboard > Table Editor > settings
   - Încearcă să modifici manual o înregistrare

### Soluții Alternative

1. **Resetare completă RLS**:
   ```sql
   ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
   -- Teste funcționalitatea
   ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
   ```

2. **Verificare user metadata**:
   - Asigură-te că utilizatorul admin are `role: "admin"` în user_metadata
   - Poți seta manual în Supabase Dashboard > Authentication > Users

## Fișiere Modificate

- ✅ `supabase/migrations/` - toate fișierele cu RLS policies
- ✅ `src/app/api/admin/settings/route.ts` - API îmbunătățit
- ✅ `src/lib/auth.ts` - debugging îmbunătățit
- ✅ `scripts/fix-rls-policies.sql` - script corecții
- ✅ `scripts/apply-rls-fix.js` - aplicare automată
- ✅ `scripts/debug-settings-api.js` - debugging

## Contact pentru Suport

Dacă problema persistă după aplicarea tuturor soluțiilor, verifică:
1. Logs-urile complete din console și terminal
2. Statusul migrărilor Supabase
3. Configurația proiectului Supabase
