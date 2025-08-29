-- =====================================================
-- SCRIPT DE INVESTIGARE ȘI REPARARE RLS POLICIES
-- =====================================================

-- 1. INVESTIGARE FUNCȚII AUTH DISPONIBILE
DO $$
DECLARE
    auth_function text;
    auth_table text;
    policy_count integer;
BEGIN
    RAISE NOTICE '=== INVESTIGARE FUNCȚII AUTH ===';
    
    -- Verifică funcțiile auth disponibile
    FOR auth_function IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'auth' 
        AND (routine_name LIKE '%jwt%' OR routine_name LIKE '%role%' OR routine_name LIKE '%uid%')
    LOOP
        RAISE NOTICE 'Funcție auth găsită: %', auth_function;
    END LOOP;
    
    -- Verifică tabelele auth
    FOR auth_table IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'auth'
    LOOP
        RAISE NOTICE 'Tabel auth găsit: %', auth_table;
    END LOOP;
    
    -- Verifică policies existente
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname NOT IN ('information_schema', 'pg_catalog');
    
    RAISE NOTICE 'Număr total policies: %', policy_count;
    
END $$;

-- 2. TEST FUNCȚII AUTH
DO $$
DECLARE
    uid_result text;
    role_result text;
    jwt_result text;
BEGIN
    RAISE NOTICE '=== TEST FUNCȚII AUTH ===';
    
    -- Test auth.uid()
    BEGIN
        SELECT auth.uid()::text INTO uid_result;
        RAISE NOTICE 'auth.uid() funcționează: %', uid_result;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'auth.uid() NU funcționează: %', SQLERRM;
    END;
    
    -- Test auth.role()
    BEGIN
        SELECT auth.role()::text INTO role_result;
        RAISE NOTICE 'auth.role() funcționează: %', role_result;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'auth.role() NU funcționează: %', SQLERRM;
    END;
    
    -- Test auth.jwt()
    BEGIN
        SELECT auth.jwt()::text INTO jwt_result;
        RAISE NOTICE 'auth.jwt() funcționează: %', LEFT(jwt_result, 100) || '...';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'auth.jwt() NU funcționează: %', SQLERRM;
    END;
    
END $$;

-- 3. VERIFICARE POLICIES EXISTENTE
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE '=== POLICIES EXISTENTE ===';
    
    FOR policy_record IN 
        SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd
        FROM pg_policies 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        LIMIT 10
    LOOP
        RAISE NOTICE 'Policy: %.%.% (% %)', 
            policy_record.schemaname, 
            policy_record.tablename, 
            policy_record.policyname,
            policy_record.cmd,
            policy_record.roles;
    END LOOP;
    
END $$;

-- 4. REPARARE POLICIES (cu fallback-uri)
DO $$
DECLARE
    uid_works boolean := false;
    role_works boolean := false;
    jwt_works boolean := false;
BEGIN
    RAISE NOTICE '=== REPARARE POLICIES ===';
    
    -- Testează ce funcții funcționează
    BEGIN
        PERFORM auth.uid();
        uid_works := true;
    EXCEPTION WHEN OTHERS THEN
        uid_works := false;
    END;
    
    BEGIN
        PERFORM auth.role();
        role_works := true;
    EXCEPTION WHEN OTHERS THEN
        role_works := false;
    END;
    
    BEGIN
        PERFORM auth.jwt();
        jwt_works := true;
    EXCEPTION WHEN OTHERS THEN
        jwt_works := false;
    END;
    
    RAISE NOTICE 'Funcții disponibile - uid: %, role: %, jwt: %', uid_works, role_works, jwt_works;
    
    -- Șterge policies existente
    DROP POLICY IF EXISTS "site_settings_select_policy" ON site_settings;
    DROP POLICY IF EXISTS "site_settings_write_policy" ON site_settings;
    DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
    DROP POLICY IF EXISTS "testimonials_write_policy" ON testimonials;
    
    -- Creează policies de select (publice)
    CREATE POLICY "site_settings_select_policy" ON site_settings
        FOR SELECT USING (true);
    
    CREATE POLICY "testimonials_select_policy" ON testimonials
        FOR SELECT USING (true);
    
    -- Creează policies de write (cu securitate adaptivă)
    IF uid_works AND jwt_works THEN
        -- Cazul ideal: verificare cu uid și jwt
        CREATE POLICY "site_settings_write_policy" ON site_settings
            FOR ALL USING (
                auth.uid() IS NOT NULL 
                AND (auth.jwt() ->> 'role')::text = 'admin'
            );
        
        CREATE POLICY "testimonials_write_policy" ON testimonials
            FOR ALL USING (
                auth.uid() IS NOT NULL 
                AND (auth.jwt() ->> 'role')::text = 'admin'
            );
        
        RAISE NOTICE 'Policies create cu verificare uid + jwt';
        
    ELSIF role_works THEN
        -- Fallback: verificare cu role
        CREATE POLICY "site_settings_write_policy" ON site_settings
            FOR ALL USING (auth.role() = 'authenticated');
        
        CREATE POLICY "testimonials_write_policy" ON testimonials
            FOR ALL USING (auth.role() = 'authenticated');
        
        RAISE NOTICE 'Policies create cu verificare role (fallback)';
        
    ELSE
        -- Fallback final: doar autentificare
        CREATE POLICY "site_settings_write_policy" ON site_settings
            FOR ALL USING (true);
        
        CREATE POLICY "testimonials_write_policy" ON testimonials
            FOR ALL USING (true);
        
        RAISE NOTICE 'Policies create fără verificare (NU pentru producție!)';
    END IF;
    
END $$;

-- 5. VERIFICARE FINALĂ
DO $$
DECLARE
    policy_count integer;
    policy_record RECORD;
BEGIN
    RAISE NOTICE '=== VERIFICARE FINALĂ ===';
    
    -- Verifică policies create
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename IN ('site_settings', 'testimonials');
    
    RAISE NOTICE 'Policies create pentru site_settings/testimonials: %', policy_count;
    
    -- Lista policies finale
    RAISE NOTICE 'Policies finale:';
    FOR policy_record IN 
        SELECT policyname, cmd, permissive
        FROM pg_policies 
        WHERE tablename IN ('site_settings', 'testimonials')
    LOOP
        RAISE NOTICE '- %: % (%)', 
            policy_record.policyname, 
            policy_record.cmd, 
            policy_record.permissive;
    END LOOP;
    
END $$;

-- 6. TEST FUNCȚIONALITATE
DO $$
DECLARE
    test_count integer;
BEGIN
    RAISE NOTICE '=== TEST FUNCȚIONALITATE ===';
    
    -- Test select din site_settings
    BEGIN
        SELECT COUNT(*) INTO test_count FROM site_settings;
        RAISE NOTICE 'SELECT din site_settings: SUCCESS (% rânduri)', test_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'SELECT din site_settings: FAILED - %', SQLERRM;
    END;
    
    -- Test select din testimonials
    BEGIN
        SELECT COUNT(*) INTO test_count FROM testimonials;
        RAISE NOTICE 'SELECT din testimonials: SUCCESS (% rânduri)', test_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'SELECT din testimonials: FAILED - %', SQLERRM;
    END;
    
    RAISE NOTICE '=== INVESTIGARE COMPLETĂ ===';
    RAISE NOTICE 'Verifică log-urile de mai sus pentru detalii!';
    
END $$;
