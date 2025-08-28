-- Create settings table for site configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default contact settings
INSERT INTO public.settings (key, value, description) VALUES
('contact_info', '{
  "company": {
    "name": "AutoOrder",
    "description": "Soluția ta pentru sourcing auto profesional și transparent",
    "website": "https://autoorder.ro"
  },
  "contact": {
    "email": "contact@autoorder.ro",
    "phone": "+40 123 456 789",
    "address": "Strada Exemplu, Nr. 123",
    "city": "București",
    "postalCode": "010000",
    "country": "România"
  },
  "schedule": {
    "monday": "09:00 - 18:00",
    "tuesday": "09:00 - 18:00",
    "wednesday": "09:00 - 18:00",
    "thursday": "09:00 - 18:00",
    "friday": "09:00 - 18:00",
    "saturday": "10:00 - 16:00",
    "sunday": "Închis"
  },
  "social": {
    "facebook": "https://facebook.com/autoorder",
    "instagram": "https://instagram.com/autoorder",
    "linkedin": "https://linkedin.com/company/autoorder",
    "youtube": "https://youtube.com/@autoorder"
  }
}', 'Contact information and company details'),

('site_config', '{
  "title": "AutoOrder – Mașini la comandă din licitații B2B",
  "description": "Preț final garantat, istoric verificat, livrare în România în 14-21 zile",
  "keywords": "mașini la comandă, licitații B2B, sourcing auto, transport România",
  "og_image": "/og/autoorder.png"
}', 'Site configuration and SEO settings'),

('footer_config', '{
  "about": "AutoOrder – Mașini la comandă din licitații B2B",
  "description": "Intermediem transparent. Selecție, licitație, transport, acte.",
  "newsletter": {
    "title": "Abonează-te la noutăți",
    "description": "Oferte interesante și maşini rare – maxim 2 emailuri/lună.",
    "cta": "Mă abonez",
    "badge": "Te poți dezabona oricând."
  }
}', 'Footer configuration and newsletter settings')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "public can read settings" ON public.settings;
CREATE POLICY "public can read settings" ON public.settings
FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin can manage settings" ON public.settings;
CREATE POLICY "admin can manage settings" ON public.settings
FOR ALL USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
WITH CHECK ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON public.settings(updated_at desc);

-- Create trigger for updated_at (if function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE TRIGGER update_settings_updated_at
      BEFORE UPDATE ON public.settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
