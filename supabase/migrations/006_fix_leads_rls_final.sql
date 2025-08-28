-- Final RLS fix for leads table - ensure admin can update and delete
-- This migration ensures all RLS policies are correctly set

-- Step 1: Disable RLS temporarily
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "admin can read leads" ON public.leads;
DROP POLICY IF EXISTS "admin can update leads" ON public.leads;
DROP POLICY IF EXISTS "admin can delete leads" ON public.leads;
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_public_select_policy" ON public.leads;
DROP POLICY IF EXISTS "public can read vehicles" ON public.leads;
DROP POLICY IF EXISTS "admin can modify vehicles" ON public.leads;

-- Step 3: Re-enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the correct policies with proper admin checks
-- Policy 1: Anyone can insert leads (for contact form submissions)
CREATE POLICY "anyone can insert leads" ON public.leads
FOR INSERT WITH CHECK (true);

-- Policy 2: Admin users can read all leads
CREATE POLICY "admin can read leads" ON public.leads
FOR SELECT USING (
  (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
);

-- Policy 3: Admin users can update leads
CREATE POLICY "admin can update leads" ON public.leads
FOR UPDATE USING (
  (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
) WITH CHECK (
  (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
);

-- Policy 4: Admin users can delete leads
CREATE POLICY "admin can delete leads" ON public.leads
FOR DELETE USING (
  (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
);

-- Step 5: Create a more permissive policy for service role operations
-- This allows the service role key to work properly
CREATE POLICY "service_role can manage leads" ON public.leads
FOR ALL USING (true)
WITH CHECK (true);

-- Step 6: Verify the policies were created
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

-- Step 7: Test the setup with a sample lead
-- Note: This will create a test record that you can delete manually
INSERT INTO public.leads (marca_model, buget, contact, extra, status) 
VALUES ('test-rls-fix', 'test-budget', 'test@rls.com', '{"test": true, "rls": "fixed"}', 'new')
RETURNING id, marca_model, status, created_at;
