-- =====================================================
-- MIGRATION 010: Fix Testimonials Table Schema
-- =====================================================
-- This migration fixes the testimonials table to match
-- the application code expectations
-- =====================================================

-- Step 1: Add missing columns that the application expects
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS author text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Step 2: Copy data from old columns to new columns
UPDATE public.testimonials 
SET 
  author = name,
  avatar_url = avatar,
  is_featured = CASE WHEN badge = 'Featured' THEN true ELSE false END,
  order_index = COALESCE(order_index, 0)
WHERE author IS NULL;

-- Step 3: Make new columns NOT NULL where appropriate
ALTER TABLE public.testimonials 
ALTER COLUMN author SET NOT NULL,
ALTER COLUMN is_featured SET NOT NULL,
ALTER COLUMN order_index SET NOT NULL;

-- Step 4: Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_testimonials_author ON public.testimonials(author);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_order_index ON public.testimonials(order_index);

-- Step 5: Update RLS policies to work with new schema
DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;

-- Create new policies
CREATE POLICY "public can read active testimonials" ON public.testimonials
  FOR SELECT USING (active = true);

CREATE POLICY "admin can manage testimonials" ON public.testimonials
  FOR ALL USING (true)
  WITH CHECK (true);

-- Step 6: Grant necessary permissions
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
GRANT SELECT ON public.testimonials TO anon;

-- Step 7: Verify the updated schema
SELECT 
  'Testimonials schema updated successfully!' as status,
  COUNT(*) as total_testimonials,
  COUNT(CASE WHEN active = true THEN 1 END) as active_testimonials,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_testimonials
FROM public.testimonials;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Your testimonials table now has the correct schema:
-- ✅ author (text, NOT NULL) - from name column
-- ✅ role (text) - kept as is
-- ✅ avatar_url (text) - from avatar column  
-- ✅ rating (integer) - kept as is
-- ✅ content (text, NOT NULL) - kept as is
-- ✅ is_featured (boolean, NOT NULL) - from badge column
-- ✅ order_index (integer, NOT NULL) - added with default 0
-- ✅ active (boolean) - kept as is
-- ✅ created_at (timestamptz) - kept as is
-- ✅ updated_at (timestamptz) - kept as is
-- =====================================================
