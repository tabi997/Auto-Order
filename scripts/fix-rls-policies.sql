-- Fix RLS Policies Script
-- This script corrects all RLS policies to use proper JSONB syntax for admin role check

-- ====== SETTINGS TABLE ======
-- Drop and recreate settings policies
DROP POLICY IF EXISTS "admin can manage settings" ON public.settings;
CREATE POLICY "admin can manage settings" ON public.settings
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== VEHICLES TABLE ======
-- Drop and recreate vehicles policies
DROP POLICY IF EXISTS "admin can modify vehicles" ON public.vehicles;
CREATE POLICY "admin can modify vehicles" ON public.vehicles
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== LEADS TABLE ======
-- Drop and recreate leads policies
DROP POLICY IF EXISTS "admin can read leads" ON public.leads;
DROP POLICY IF EXISTS "admin can update leads" ON public.leads;
DROP POLICY IF EXISTS "admin can delete leads" ON public.leads;

CREATE POLICY "admin can read leads" ON public.leads
FOR SELECT USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

CREATE POLICY "admin can update leads" ON public.leads
FOR UPDATE USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

CREATE POLICY "admin can delete leads" ON public.leads
FOR DELETE USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== TESTIMONIALS TABLE ======
-- Drop and recreate testimonials policies
DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
CREATE POLICY "admin can manage testimonials" ON public.testimonials
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== ADMIN_USERS TABLE (if exists) ======
-- Drop and recreate admin_users policies
DROP POLICY IF EXISTS "admin can manage admin_users" ON public.admin_users;
CREATE POLICY "admin can manage admin_users" ON public.admin_users
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== USERS TABLE (if exists) ======
-- Drop and recreate users policies
DROP POLICY IF EXISTS "admin can manage users" ON public.users;
CREATE POLICY "admin can manage users" ON public.users
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== LISTINGS TABLE (if exists) ======
-- Drop and recreate listings policies
DROP POLICY IF EXISTS "admin can manage listings" ON public.listings;
CREATE POLICY "admin can manage listings" ON public.listings
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== IMAGES TABLE (if exists) ======
-- Drop and recreate images policies
DROP POLICY IF EXISTS "admin can manage images" ON public.images;
CREATE POLICY "admin can manage images" ON public.images
FOR ALL USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- ====== AUDIT_LOG TABLE (if exists) ======
-- Drop and recreate audit_log policies
DROP POLICY IF EXISTS "admin can read audit logs" ON public.audit_log;
DROP POLICY IF EXISTS "admin can insert audit logs" ON public.audit_log;

CREATE POLICY "admin can read audit logs" ON public.audit_log
FOR SELECT USING ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

CREATE POLICY "admin can insert audit logs" ON public.audit_log
FOR INSERT WITH CHECK ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Verify all policies are correctly set
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND qual LIKE '%admin%'
ORDER BY tablename, policyname;
