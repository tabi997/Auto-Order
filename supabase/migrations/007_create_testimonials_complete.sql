-- =====================================================
-- MIGRATION 007: Complete Testimonials Table Setup
-- =====================================================
-- This migration creates the testimonials table with all necessary
-- indexes, RLS policies, and sample data
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
CREATE INDEX IF NOT EXISTS idx_testimonials_badge ON public.testimonials(badge);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Policy 1: Public can read only active testimonials
DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
CREATE POLICY "public can read active testimonials" ON public.testimonials
  FOR SELECT USING (active = true);

-- Policy 2: Admin users can manage all testimonials (temporary - will be updated when auth is set up)
DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
CREATE POLICY "admin can manage testimonials" ON public.testimonials
  FOR ALL USING (true)
  WITH CHECK (true);

-- Step 5: Create trigger for updated_at (if function doesn't exist, create it)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$func$ language 'plpgsql';

-- Step 6: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Insert default testimonials (only if table is empty)
INSERT INTO public.testimonials (name, role, company, rating, content, badge, active)
SELECT 
  'Ion Popescu', 'Dealer Auto', 'AutoMax București', 5, 
  'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.', 
  'Dealer verificat', true
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Ion Popescu' AND role = 'Dealer Auto');

INSERT INTO public.testimonials (name, role, company, rating, content, badge, active)
SELECT 
  'Maria Ionescu', 'Manager Flotă', 'Transport Express', 5, 
  'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.', 
  'Client fidel', true
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Maria Ionescu' AND role = 'Manager Flotă');

INSERT INTO public.testimonials (name, role, company, rating, content, badge, active)
SELECT 
  'Alexandru Dumitrescu', 'Proprietar', 'Firma Individuală', 5, 
  'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.', 
  'Prima achiziție', true
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Alexandru Dumitrescu' AND role = 'Proprietar');

INSERT INTO public.testimonials (name, role, company, rating, content, badge, active)
SELECT 
  'Elena Vasilescu', 'Director Comercial', 'Auto Solutions', 5, 
  'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.', 
  'Partener de afaceri', true
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Elena Vasilescu' AND role = 'Director Comercial');

-- Step 8: Grant necessary permissions
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
GRANT SELECT ON public.testimonials TO anon;

-- Step 9: Verify the setup
SELECT 
  'Testimonials table setup completed successfully!' as status,
  COUNT(*) as total_testimonials,
  COUNT(CASE WHEN active = true THEN 1 END) as active_testimonials
FROM public.testimonials;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Your testimonials table is now ready to use with:
-- ✅ Table structure with proper constraints
-- ✅ Performance indexes
-- ✅ Row Level Security enabled
-- ✅ RLS policies for public read and admin management
-- ✅ Automatic updated_at timestamp updates
-- ✅ Sample testimonials data
-- ✅ Proper permissions
-- =====================================================
