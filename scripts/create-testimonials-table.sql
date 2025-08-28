-- Create testimonials table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
CREATE POLICY "public can read active testimonials" ON public.testimonials
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "admin can manage testimonials" ON public.testimonials;
CREATE POLICY "admin can manage testimonials" ON public.testimonials
  FOR ALL USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
  WITH CHECK ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

-- Insert default testimonials
INSERT INTO public.testimonials (name, role, company, rating, content, badge, active) VALUES
  ('Ion Popescu', 'Dealer Auto', 'AutoMax București', 5, 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.', 'Dealer verificat', true),
  ('Maria Ionescu', 'Manager Flotă', 'Transport Express', 5, 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.', 'Client fidel', true),
  ('Alexandru Dumitrescu', 'Proprietar', 'Firma Individuală', 5, 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.', 'Prima achiziție', true),
  ('Elena Vasilescu', 'Director Comercial', 'Auto Solutions', 5, 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.', 'Partener de afaceri', true);
