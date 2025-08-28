-- =====================================================
-- COMPLETE TESTIMONIALS TABLE SETUP FOR AUTOORDER
-- =====================================================
-- Run this script in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  avatar text,
  badge text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Policy 1: Public can read only active testimonials
DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
CREATE POLICY "public can read active testimonials" ON public.testimonials
  FOR SELECT USING (active = true);

-- Policy 2: Admin users can manage all testimonials
DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
CREATE POLICY "admin can manage testimonials" ON public.testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid()::uuid 
      AND users.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid()::uuid 
      AND users.role = 'ADMIN'
    )
  );

-- Step 5: Insert default testimonials
INSERT INTO public.testimonials (name, role, company, rating, content, badge, active) VALUES
  ('Ion Popescu', 'Dealer Auto', 'AutoMax București', 5, 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.', 'Dealer verificat', true),
  ('Maria Ionescu', 'Manager Flotă', 'Transport Express', 5, 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.', 'Client fidel', true),
  ('Alexandru Dumitrescu', 'Proprietar', 'Firma Individuală', 5, 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.', 'Prima achiziție', true),
  ('Elena Vasilescu', 'Director Comercial', 'Auto Solutions', 5, 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.', 'Partener de afaceri', true)
ON CONFLICT (name, role) DO NOTHING;

-- Step 6: Verify the setup
SELECT 
  'Testimonials table created successfully!' as status,
  COUNT(*) as total_testimonials,
  COUNT(CASE WHEN active = true THEN 1 END) as active_testimonials
FROM public.testimonials;

-- Step 7: Show sample data
SELECT 
  name, 
  role, 
  company, 
  rating, 
  badge, 
  active,
  created_at
FROM public.testimonials 
ORDER BY created_at DESC;

-- =====================================================
-- SETUP COMPLETE! 
-- =====================================================
-- Your testimonials table is now ready to use.
-- The API endpoints will work automatically.
-- Test the admin panel at /admin/settings/testimonials
-- =====================================================
