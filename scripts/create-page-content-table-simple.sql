-- Create page_content table for dynamic content management
-- Run this script in your Supabase SQL editor STEP BY STEP

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

-- Step 2: Insert Romanian content (run this separately)
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'hero', 'Secțiunea Hero', 'Soluția ta pentru sourcing auto profesional și transparent', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'hero-subtitle', 'Subtitlu Hero', 'Găsește mașina perfectă pentru afacerea ta cu ajutorul expertizelor noastre', 'Descriere principală', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'features-intro', 'Introducere Caracteristici', 'De ce să alegi AutoOrder pentru nevoile tale de sourcing auto?', 'Titlu secțiune', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('home', 'cta-main', 'Call-to-Action Principal', 'Începe Sourcing-ul', 'Text buton', 'ro');

-- Step 3: Insert stock page content (run this separately)
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'header', 'Header Pagină', 'Găsește mașina perfectă din licitații B2B europene', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'description', 'Descriere Pagină', 'Explorează selecția noastră de vehicule disponibile pentru achiziție imediată', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('stock', 'filters-intro', 'Introducere Filtre', 'Filtrează vehiculele după preferințele tale', 'Text deasupra filtrelor', 'ro');

-- Step 4: Insert sourcing page content (run this separately)
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'header', 'Header Pagină', 'Servicii de Sourcing Auto', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'description', 'Descriere Pagină', 'Găsește vehiculul perfect pentru afacerea ta cu ajutorul expertizelor noastre', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('sourcing', 'process-intro', 'Introducere Proces', 'Procesul nostru simplu și transparent', 'Text deasupra pașilor', 'ro');

-- Step 5: Insert contact page content (run this separately)
insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'header', 'Header Pagină', 'Contactează-ne', 'Titlu principal', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'description', 'Descriere Pagină', 'Suntem aici să te ajutăm cu orice întrebare ai avea despre serviciile noastre', 'Text explicativ', 'ro');

insert into public.page_content (page_id, section_key, title, content, subtitle, language) values
('contact', 'form-intro', 'Introducere Formular', 'Completează formularul de mai jos și te vom contacta în cel mai scurt timp', 'Text deasupra formularului', 'ro');

-- Step 6: Enable RLS and create policies (run this separately)
alter table public.page_content enable row level security;

drop policy if exists "public can read page_content" on public.page_content;
create policy "public can read page_content" on public.page_content
for select using (true);

drop policy if exists "admin can manage page_content" on public.page_content;
create policy "admin can manage page_content" on public.page_content
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Step 7: Create indexes (run this separately)
create index if not exists idx_page_content_page_id on public.page_content(page_id);
create index if not exists idx_page_content_language on public.page_content(language);
create index if not exists idx_page_content_section_key on public.page_content(section_key);
create index if not exists idx_page_content_updated_at on public.page_content(updated_at desc);

-- Step 8: Create trigger function and trigger (run this separately)
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
