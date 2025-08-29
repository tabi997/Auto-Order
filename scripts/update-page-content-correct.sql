-- Update existing page_content with CORRECT content that matches the website
-- Run this script in your Supabase SQL editor to fix existing content

-- Update Home page content
update public.page_content 
set content = 'Mașini la comandă din licitații B2B'
where page_id = 'home' and section_key = 'hero' and language = 'ro';

update public.page_content 
set content = 'Transparență totală în proces, costuri clare și livrare rapidă. Tu ne spui ce vrei, noi licităm și aducem mașina potrivită.'
where page_id = 'home' and section_key = 'hero-subtitle' and language = 'ro';

update public.page_content 
set content = 'De ce AutoOrder'
where page_id = 'home' and section_key = 'features-intro' and language = 'ro';

update public.page_content 
set content = 'Completează brief-ul'
where page_id = 'home' and section_key = 'cta-main' and language = 'ro';

-- Update Stock page content
update public.page_content 
set content = 'Explorare oportunități'
where page_id = 'stock' and section_key = 'header' and language = 'ro';

update public.page_content 
set content = 'Găsește mașina perfectă din licitații B2B europene'
where page_id = 'stock' and section_key = 'description' and language = 'ro';

update public.page_content 
set content = 'Filtrează vehiculele după preferințele tale'
where page_id = 'stock' and section_key = 'filters-intro' and language = 'ro';

-- Update Sourcing page content
update public.page_content 
set content = 'Sourcing inteligent'
where page_id = 'sourcing' and section_key = 'header' and language = 'ro';

update public.page_content 
set content = 'Licitații B2B transparente și garantate cu economii de până la 40%'
where page_id = 'sourcing' and section_key = 'description' and language = 'ro';

update public.page_content 
set content = 'Procesul nostru simplu și transparent'
where page_id = 'sourcing' and section_key = 'process-intro' and language = 'ro';

-- Update Contact page content
update public.page_content 
set content = 'Să discutăm despre mașina ta'
where page_id = 'contact' and section_key = 'header' and language = 'ro';

update public.page_content 
set content = 'Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B. Răspundem în maxim 2 ore în timpul programului de lucru.'
where page_id = 'contact' and section_key = 'description' and language = 'ro';

update public.page_content 
set content = 'Completează formularul de mai jos și te vom contacta în cel mai scurt timp'
where page_id = 'contact' and section_key = 'form-intro' and language = 'ro';
