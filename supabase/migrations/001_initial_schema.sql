-- Create vehicles table
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null check (year >= 1990 and year <= extract(year from now())+1),
  km int not null check (km>=0),
  fuel text not null,              -- 'benzina'|'diesel'|'hibrid'|'electric'
  transmission text not null,      -- 'manuala'|'automata'
  price_est numeric not null check (price_est>=0),
  badges text[] default '{}',
  images text[] default '{}',      -- URL-uri Cloudinary
  source text default '',           -- link Openlane (opțional)
  featured boolean default false,
  featured_position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for vehicles
create index if not exists idx_vehicles_created on public.vehicles(created_at desc);
create index if not exists idx_vehicles_featured on public.vehicles(featured, featured_position desc);

-- Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  marca_model text not null,
  buget text not null,             -- interval sau suma
  contact text not null,           -- telefon sau email
  extra jsonb default '{}',        -- km/fuel/transmission după progressive
  status text default 'new',       -- new|qualified|quoted|approved|ordered|delivered
  created_at timestamptz default now()
);

-- Create index for leads
create index if not exists idx_leads_created on public.leads(created_at desc);
create index if not exists idx_leads_status on public.leads(status);

-- Enable RLS
alter table public.vehicles enable row level security;
alter table public.leads enable row level security;

-- SELECT public pentru afișare stoc & homepage
create policy "public can read vehicles" on public.vehicles
for select using (true);

-- doar admin poate modifica vehicles
create policy "admin can modify vehicles" on public.vehicles
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- leads: oricine poate insera; doar admin poate citi
create policy "anyone can insert leads" on public.leads
for insert with check (true);

create policy "admin can read leads" on public.leads
for select using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for vehicles table
create trigger update_vehicles_updated_at
  before update on public.vehicles
  for each row
  execute function update_updated_at_column();
