-- Minimal page_content table creation
-- Run this first to test if table creation works

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
