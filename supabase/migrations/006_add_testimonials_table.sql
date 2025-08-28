-- Create testimonials table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text,
  rating int not null check (rating >= 1 and rating <= 5),
  content text not null,
  avatar text,
  badge text not null,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_testimonials_active on public.testimonials(active);
create index if not exists idx_testimonials_created_at on public.testimonials(created_at desc);

-- Enable RLS
alter table public.testimonials enable row level security;

-- RLS policies for testimonials table
create policy "public can read active testimonials" on public.testimonials
for select using (active = true);

create policy "admin can manage testimonials" on public.testimonials
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Create trigger for updated_at
create trigger update_testimonials_updated_at
  before update on public.testimonials
  for each row
  execute function update_updated_at_column();

-- Insert default testimonials
insert into public.testimonials (name, role, company, rating, content, badge, active) values
  ('Ion Popescu', 'Dealer Auto', 'AutoMax București', 5, 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.', 'Dealer verificat', true),
  ('Maria Ionescu', 'Manager Flotă', 'Transport Express', 5, 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.', 'Client fidel', true),
  ('Alexandru Dumitrescu', 'Proprietar', 'Firma Individuală', 5, 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.', 'Prima achiziție', true),
  ('Elena Vasilescu', 'Director Comercial', 'Auto Solutions', 5, 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.', 'Partener de afaceri', true);
