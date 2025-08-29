-- Create page_content table for dynamic content management
-- Run this script in your Supabase SQL editor

-- Create the table
create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  section_key text not null,
  title text not null,
  content text not null,
  subtitle text,
  language text default 'ro',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page_id, section_key, language)
);

-- Insert default content for Romanian
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
-- Home page content
('home', 'hero', 'Secțiunea Hero', 'Soluția ta pentru sourcing auto profesional și transparent', 'Titlu principal', 'ro'),
('home', 'hero-subtitle', 'Subtitlu Hero', 'Găsește mașina perfectă pentru afacerea ta cu ajutorul expertizelor noastre', 'Descriere principală', 'ro'),
('home', 'features-intro', 'Introducere Caracteristici', 'De ce să alegi AutoOrder pentru nevoile tale de sourcing auto?', 'Titlu secțiune', 'ro'),
('home', 'cta-main', 'Call-to-Action Principal', 'Începe Sourcing-ul', 'Text buton', 'ro'),

-- Stock page content
('stock', 'header', 'Header Pagină', 'Găsește mașina perfectă din licitații B2B europene', 'Titlu principal', 'ro'),
('stock', 'description', 'Descriere Pagină', 'Explorează selecția noastră de vehicule disponibile pentru achiziție imediată', 'Text explicativ', 'ro'),
('stock', 'filters-intro', 'Introducere Filtre', 'Filtrează vehiculele după preferințele tale', 'Text deasupra filtrelor', 'ro'),

-- Sourcing page content
('sourcing', 'header', 'Header Pagină', 'Servicii de Sourcing Auto', 'Titlu principal', 'ro'),
('sourcing', 'description', 'Descriere Pagină', 'Găsește vehiculul perfect pentru afacerea ta cu ajutorul expertizelor noastre', 'Text explicativ', 'ro'),
('sourcing', 'process-intro', 'Introducere Proces', 'Procesul nostru simplu și transparent', 'Text deasupra pașilor', 'ro'),

-- Contact page content
('contact', 'header', 'Header Pagină', 'Contactează-ne', 'Titlu principal', 'ro'),
('contact', 'description', 'Descriere Pagină', 'Suntem aici să te ajutăm cu orice întrebare ai avea despre serviciile noastre', 'Text explicativ', 'ro'),
('contact', 'form-intro', 'Introducere Formular', 'Completează formularul de mai jos și te vom contacta în cel mai scurt timp', 'Text deasupra formularului', 'ro');

-- Insert default content for English
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
-- Home page content
('home', 'hero', 'Hero Section', 'Your solution for professional and transparent auto sourcing', 'Main title', 'en'),
('home', 'hero-subtitle', 'Hero Subtitle', 'Find the perfect car for your business with the help of our expertise', 'Main description', 'en'),
('home', 'features-intro', 'Features Introduction', 'Why choose AutoOrder for your auto sourcing needs?', 'Section title', 'en'),
('home', 'cta-main', 'Main Call-to-Action', 'Start Sourcing', 'Button text', 'en'),

-- Stock page content
('stock', 'header', 'Page Header', 'Find the perfect car from European B2B auctions', 'Main title', 'en'),
('stock', 'description', 'Page Description', 'Explore our selection of vehicles available for immediate purchase', 'Explanatory text', 'en'),
('stock', 'filters-intro', 'Filters Introduction', 'Filter vehicles according to your preferences', 'Text above filters', 'en'),

-- Sourcing page content
('sourcing', 'header', 'Page Header', 'Auto Sourcing Services', 'Main title', 'en'),
('sourcing', 'description', 'Page Description', 'Find the perfect vehicle for your business with the help of our expertise', 'Explanatory text', 'en'),
('sourcing', 'process-intro', 'Process Introduction', 'Our simple and transparent process', 'Text above steps', 'en'),

-- Contact page content
('contact', 'header', 'Page Header', 'Contact Us', 'Main title', 'en'),
('contact', 'description', 'Page Description', 'We are here to help you with any questions you may have about our services', 'Explanatory text', 'en'),
('contact', 'form-intro', 'Form Introduction', 'Fill out the form below and we will contact you as soon as possible', 'Text above form', 'en');

-- Enable RLS on page_content table
alter table public.page_content enable row level security;

-- RLS policies for page_content table
drop policy if exists "public can read page_content" on public.page_content;
create policy "public can read page_content" on public.page_content
for select using (true);

drop policy if exists "admin can manage page_content" on public.page_content;
create policy "admin can manage page_content" on public.page_content
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Create indexes
create index if not exists idx_page_content_page_id on public.page_content(page_id);
create index if not exists idx_page_content_language on public.page_content(language);
create index if not exists idx_page_content_section_key on public.page_content(section_key);
create index if not exists idx_page_content_updated_at on public.page_content(updated_at desc);

-- Create trigger for updated_at (if the function doesn't exist, create it first)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_page_content_updated_at
  before update on public.page_content
  for each row
  execute function update_updated_at_column();
