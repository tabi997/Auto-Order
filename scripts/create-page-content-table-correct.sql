-- Create page_content table with CORRECT content that matches the website
-- Run this script in your Supabase SQL editor

-- Step 1: Create the table
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

-- Step 2: Insert CORRECT Romanian content that matches the website
-- Home page content
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'hero', 'Secțiunea Hero', 'Mașini la comandă din licitații B2B', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'hero-subtitle', 'Subtitlu Hero', 'Transparență totală în proces, costuri clare și livrare rapidă. Tu ne spui ce vrei, noi licităm și aducem mașina potrivită.', 'Descriere principală', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'features-intro', 'Introducere Caracteristici', 'De ce AutoOrder', 'Titlu secțiune', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'cta-main', 'Call-to-Action Principal', 'Completează brief-ul', 'Text buton', 'ro');

-- Stock page content
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'header', 'Header Pagină', 'Explorare oportunități', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'description', 'Descriere Pagină', 'Găsește mașina perfectă din licitații B2B europene', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'filters-intro', 'Introducere Filtre', 'Filtrează vehiculele după preferințele tale', 'Text deasupra filtrelor', 'ro');

-- Sourcing page content
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'header', 'Header Pagină', 'Sourcing inteligent', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'description', 'Descriere Pagină', 'Licitații B2B transparente și garantate cu economii de până la 40%', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'process-intro', 'Introducere Proces', 'Procesul nostru simplu și transparent', 'Text deasupra pașilor', 'ro');

-- Contact page content
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'header', 'Header Pagină', 'Să discutăm despre mașina ta', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'description', 'Descriere Pagină', 'Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B. Răspundem în maxim 2 ore în timpul programului de lucru.', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'form-intro', 'Introducere Formular', 'Completează formularul de mai jos și te vom contacta în cel mai scurt timp', 'Text deasupra formularului', 'ro');

-- Step 3: Enable RLS and create policies
alter table public.page_content enable row level security;

drop policy if exists "public can read page_content" on public.page_content;
create policy "public can read page_content" on public.page_content
for select using (true);

drop policy if exists "admin can manage page_content" on public.page_content;
create policy "admin can manage page_content" on public.page_content
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Step 4: Create indexes
create index if not exists idx_page_content_page_id on public.page_content(page_id);
create index if not exists idx_page_content_language on public.page_content(language);
create index if not exists idx_page_content_section_key on public.page_content(section_key);
create index if not exists idx_page_content_updated_at on public.page_content(updated_at desc);

-- Step 5: Create trigger function and trigger
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
