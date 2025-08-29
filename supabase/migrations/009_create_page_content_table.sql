-- Create page_content table for dynamic content management
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
('home', 'hero', 'Secțiunea Hero', 'Mașina visurilor tale, direct din licitațiile B2B', 'Titlu principal', 'ro'),
('home', 'hero-subtitle', 'Subtitlu Hero', 'Preț final garantat • Istoric verificat • Livrare în România în 14-21 zile', 'Descriere principală', 'ro'),
('home', 'features-intro', 'Introducere Caracteristici', 'De ce să alegi AutoOrder', 'Titlu secțiune', 'ro'),
('home', 'cta-main', 'Call-to-Action Principal', 'Cere ofertă personalizată', 'Text buton', 'ro'),
('home', 'benefits-title', 'Titlu Secțiune Avantaje', 'Avantaje concrete, nu promisiuni', 'Titlu principal', 'ro'),
('home', 'benefits-subtitle', 'Subtitlu Secțiune Avantaje', 'Proces transparent și eficient, de la selecție până la livrare', 'Descriere', 'ro'),
('home', 'process-title', 'Titlu Secțiune Proces', 'Proces simplu în 4 pași', 'Titlu principal', 'ro'),
('home', 'process-subtitle', 'Subtitlu Secțiune Proces', 'De la cererea ta până la livrarea mașinii, totul este transparent și eficient', 'Descriere', 'ro'),
('home', 'calculator-title', 'Titlu Calculator', 'Calculează costul total', 'Titlu principal', 'ro'),
('home', 'calculator-subtitle', 'Subtitlu Calculator', 'Estimează costurile pentru mașina dorită', 'Descriere', 'ro'),
('home', 'stock-title', 'Titlu Stoc Recomandat', 'Stoc recomandat', 'Titlu principal', 'ro'),
('home', 'faq-title', 'Titlu FAQ', 'Răspunsuri la întrebările tale', 'Titlu principal', 'ro'),
('home', 'faq-subtitle', 'Subtitlu FAQ', 'Tot ce trebuie să știi despre procesul AutoOrder', 'Descriere', 'ro'),
('home', 'final-cta-title', 'Titlu CTA Final', 'Gata să începi să economisești?', 'Titlu principal', 'ro'),
('home', 'final-cta-subtitle', 'Subtitlu CTA Final', 'Completează formularul și primești oferte personalizate în 15-30 minute. Fără obligații, doar informații utile pentru decizia ta.', 'Descriere', 'ro'),

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
('home', 'hero', 'Hero Section', 'Your dream car, directly from B2B auctions', 'Main title', 'en'),
('home', 'hero-subtitle', 'Hero Subtitle', 'Final guaranteed price • Verified history • Delivery in Romania in 14-21 days', 'Main description', 'en'),
('home', 'features-intro', 'Features Introduction', 'Why choose AutoOrder', 'Section title', 'en'),
('home', 'cta-main', 'Main Call-to-Action', 'Request personalized offer', 'Button text', 'en'),
('home', 'benefits-title', 'Benefits Section Title', 'Concrete advantages, not promises', 'Main title', 'en'),
('home', 'benefits-subtitle', 'Benefits Section Subtitle', 'Transparent and efficient process, from selection to delivery', 'Description', 'en'),
('home', 'process-title', 'Process Section Title', 'Simple process in 4 steps', 'Main title', 'en'),
('home', 'process-subtitle', 'Process Section Subtitle', 'From your request to car delivery, everything is transparent and efficient', 'Description', 'en'),
('home', 'calculator-title', 'Calculator Title', 'Calculate total cost', 'Main title', 'en'),
('home', 'calculator-subtitle', 'Calculator Subtitle', 'Estimate costs for your desired car', 'Description', 'en'),
('home', 'stock-title', 'Stock Title', 'Recommended stock', 'Main title', 'en'),
('home', 'faq-title', 'FAQ Title', 'Answers to your questions', 'Main title', 'en'),
('home', 'faq-subtitle', 'FAQ Subtitle', 'Everything you need to know about the AutoOrder process', 'Description', 'en'),
('home', 'final-cta-title', 'Final CTA Title', 'Ready to start saving?', 'Main title', 'en'),
('home', 'final-cta-subtitle', 'Final CTA Subtitle', 'Fill out the form and receive personalized offers in 15-30 minutes. No obligations, just useful information for your decision.', 'Description', 'en'),

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

-- Create trigger for updated_at
create trigger update_page_content_updated_at
  before update on public.page_content
  for each row
  execute function update_updated_at_column();
