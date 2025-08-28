-- Drop existing complex tables
drop table if exists public.audit_log cascade;
drop table if exists public.images cascade;
drop table if exists public.listings cascade;
drop table if exists public.sessions cascade;
drop table if exists public.users cascade;

-- Simplified vehicles table (keeps existing structure)
-- No changes needed to vehicles table from 001_initial_schema.sql

-- Simplified leads table (keeps existing structure)
-- No changes needed to leads table from 001_initial_schema.sql

-- Create simplified admin_users table for Supabase Auth integration
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text default 'admin' check (role in ('admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_admin_users_email on public.admin_users(email);

-- Enable RLS on admin_users table
alter table public.admin_users enable row level security;

-- RLS policies for admin_users table
create policy "admin can read own profile" on public.admin_users
for select using (auth.uid()::text = id::text);

create policy "admin can manage admin_users" on public.admin_users
for all using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
with check ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

-- Create trigger for updated_at
create trigger update_admin_users_updated_at
  before update on public.admin_users
  for each row
  execute function update_updated_at_column();

-- Insert default admin user
insert into public.admin_users (email, name, role) 
values (
  'admin@autoorder.ro', 
  'Admin User', 
  'admin'
) on conflict (email) do nothing;
