-- Fix RLS policies for leads table
-- This migration fixes the row-level security policies that are blocking inserts

-- First, drop any existing conflicting policies
DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "admin can read leads" ON public.leads;
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_public_select_policy" ON public.leads;

-- Create the correct policies for leads table
-- Policy 1: Anyone can insert leads (for contact form submissions)
CREATE POLICY "anyone can insert leads" ON public.leads
FOR INSERT WITH CHECK (true);

-- Policy 2: Admin users can read all leads
CREATE POLICY "admin can read leads" ON public.leads
FOR SELECT USING (
  (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
);

-- Policy 3: Admin users can update leads
CREATE POLICY "admin can update leads" ON public.leads
FOR UPDATE USING (
  (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
) WITH CHECK (
  (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
);

-- Policy 4: Admin users can delete leads
CREATE POLICY "admin can delete leads" ON public.leads
FOR DELETE USING (
  (auth.jwt()->>'user_metadata') like '%"role":"admin"%'
);

-- Verify the policies were created
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
WHERE tablename = 'leads' 
AND schemaname = 'public';
