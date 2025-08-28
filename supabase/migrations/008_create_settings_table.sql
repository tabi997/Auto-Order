-- Create settings table for site configuration
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default contact settings
insert into public.settings (key, value, description) values
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
}', 'Footer configuration and newsletter settings');

-- Enable RLS on settings table
alter table public.settings enable row level security;

-- RLS policies for settings table
drop policy if exists "public can read settings" on public.settings;
create policy "public can read settings" on public.settings
for select using (true);

drop policy if exists "admin can manage settings" on public.settings;
create policy "admin can manage settings" on public.settings
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Create indexes
create index if not exists idx_settings_key on public.settings(key);
create index if not exists idx_settings_updated_at on public.settings(updated_at desc);

-- Create trigger for updated_at
create trigger update_settings_updated_at
  before update on public.settings
  for each row
  execute function update_updated_at_column();
