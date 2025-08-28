-- Create users table for admin authentication
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  password text not null, -- hashed password
  role text default 'VIEWER' check (role in ('ADMIN', 'EDITOR', 'VIEWER')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create sessions table for admin authentication
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Create listings table (replaces vehicles for admin functionality)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  model text not null,
  year int not null check (year >= 1990 and year <= extract(year from now())+1),
  price_eur int not null check (price_eur >= 0),
  km int not null check (km >= 0),
  fuel text not null check (fuel in ('Benzina', 'Diesel', 'Hybrid', 'Electric')),
  gearbox text not null check (gearbox in ('Automata', 'Manuala')),
  body text not null check (body in ('SUV', 'Sedan', 'Hatchback', 'Break', 'Coupe', 'MPV', 'Pickup', 'Alt')),
  country text not null,
  type text default 'BUY_NOW' check (type in ('BUY_NOW', 'AUCTION')),
  status text default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD')),
  short_desc text,
  cover_url text,
  source_url text,
  source_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(title, brand, model)
);

-- Create images table for listings
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  url text not null,
  alt text,
  created_at timestamptz default now()
);

-- Create audit_log table for admin actions
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  data text, -- JSON string for compatibility
  created_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_sessions_token on public.sessions(token);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_listings_created_at on public.listings(created_at desc);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_type on public.listings(type);
create index if not exists idx_images_listing_id on public.images(listing_id);
create index if not exists idx_audit_log_actor_id on public.audit_log(actor_id);
create index if not exists idx_audit_log_listing_id on public.audit_log(listing_id);
create index if not exists idx_audit_log_created_at on public.audit_log(created_at desc);

-- Enable RLS on new tables
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.listings enable row level security;
alter table public.images enable row level security;
alter table public.audit_log enable row level security;

-- RLS policies for users table
create policy "users can read own profile" on public.users
for select using (auth.uid()::text = id::text);

create policy "admin can manage users" on public.users
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- RLS policies for sessions table
create policy "users can manage own sessions" on public.sessions
for all using (auth.uid()::text = user_id::text);

-- RLS policies for listings table
create policy "public can read published listings" on public.listings
for select using (status = 'PUBLISHED');

create policy "admin can manage listings" on public.listings
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- RLS policies for images table
create policy "public can read images for published listings" on public.images
for select using (
  exists (
    select 1 from public.listings 
    where id = listing_id and status = 'PUBLISHED'
  )
);

create policy "admin can manage images" on public.images
for all using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin')
with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- RLS policies for audit_log table
create policy "admin can read audit logs" on public.audit_log
for select using ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

create policy "admin can insert audit logs" on public.audit_log
for insert with check ((auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin');

-- Create triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function update_updated_at_column();

create trigger update_listings_updated_at
  before update on public.listings
  for each row
  execute function update_updated_at_column();

-- Insert default admin user (password: admin123)
insert into public.users (email, name, password, role) 
values (
  'admin@autoorder.ro', 
  'Admin User', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8s.m', -- bcrypt hash of 'admin123'
  'ADMIN'
) on conflict (email) do nothing;
