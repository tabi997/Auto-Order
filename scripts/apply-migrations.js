#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local')
  if (!fs.existsSync(envPath)) {
    return {}
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  return env
}

const env = loadEnv()

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 AutoOrder Database Migration Script')
console.log('=====================================\n')

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigrations() {
  try {
    console.log('\n🔧 Applying migrations...\n')
    
    // Migration 1: Initial Schema
    console.log('📋 Applying Migration 1: Initial Schema...')
    
    const migration1 = `
      -- Create vehicles table
      create table if not exists public.vehicles (
        id uuid primary key default gen_random_uuid(),
        make text not null,
        model text not null,
        year int not null check (year >= 1990 and year <= extract(year from now())+1),
        km int not null check (km>=0),
        fuel text not null,
        transmission text not null,
        price_est numeric not null check (price_est>=0),
        badges text[] default '{}',
        images text[] default '{}',
        source text default '',
        featured boolean default false,
        featured_position int default 0,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );

      -- Create leads table
      create table if not exists public.leads (
        id uuid primary key default gen_random_uuid(),
        marca_model text not null,
        buget text not null,
        contact text not null,
        extra jsonb default '{}',
        status text default 'new',
        created_at timestamptz default now()
      );

      -- Create indexes
      create index if not exists idx_vehicles_created on public.vehicles(created_at desc);
      create index if not exists idx_vehicles_featured on public.vehicles(featured, featured_position desc);
      create index if not exists idx_leads_created on public.leads(created_at desc);
      create index if not exists idx_leads_status on public.leads(status);

      -- Enable RLS
      alter table public.vehicles enable row level security;
      alter table public.leads enable row level security;

      -- Policies
      create policy "public can read vehicles" on public.vehicles for select using (true);
      create policy "admin can modify vehicles" on public.vehicles for all using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%') with check ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');
      create policy "anyone can insert leads" on public.leads for insert with check (true);
      create policy "admin can read leads" on public.leads for select using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

      -- Function and trigger
      create or replace function update_updated_at_column() returns trigger as $$ 
      begin 
        new.updated_at = now(); 
        return new; 
      end; 
      $$ language plpgsql;
      
      create trigger update_vehicles_updated_at before update on public.vehicles for each row execute function update_updated_at_column();
    `

    const { error: error1 } = await supabase.rpc('exec_sql', { sql: migration1 })
    if (error1) {
      console.log('⚠️  Migration 1 warning (tables might already exist):', error1.message)
    } else {
      console.log('✅ Migration 1 applied successfully')
    }

    // Migration 2: Admin Users Schema
    console.log('\n📋 Applying Migration 2: Admin Users Schema...')
    
    const migration2 = `
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
      create policy "admin can read own profile" on public.admin_users for select using (auth.uid()::text = id::text);
      create policy "admin can manage admin_users" on public.admin_users for all using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%') with check ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

      -- Create trigger for updated_at
      create trigger update_admin_users_updated_at before update on public.admin_users for each row execute function update_updated_at_column();

      -- Insert default admin user
      insert into public.admin_users (email, name, role) values ('admin@autoorder.ro', 'Admin User', 'admin') on conflict (email) do nothing;
    `

    const { error: error2 } = await supabase.rpc('exec_sql', { sql: migration2 })
    if (error2) {
      console.log('⚠️  Migration 2 warning (tables might already exist):', error2.message)
    } else {
      console.log('✅ Migration 2 applied successfully')
    }

    // Test the tables
    console.log('\n🧪 Testing tables after migration...')
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1)
    
    if (vehiclesError) {
      console.log('❌ Vehicles table error:', vehiclesError.message)
    } else {
      console.log('✅ Vehicles table accessible, count:', vehicles?.length || 0)
    }
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.log('❌ Leads table error:', leadsError.message)
    } else {
      console.log('✅ Leads table accessible, count:', leads?.length || 0)
    }
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
    
    if (adminError) {
      console.log('❌ Admin users table error:', adminError.message)
    } else {
      console.log('✅ Admin users table accessible, count:', adminUsers?.length || 0)
    }

    console.log('\n🎉 Migrations completed!')
    console.log('Next steps:')
    console.log('1. Create admin user in Supabase Auth')
    console.log('2. Test admin panel: http://localhost:3000/admin')
    
  } catch (error) {
    console.log('❌ Migration error:', error.message)
    
    // Fallback: try direct SQL execution
    console.log('\n🔄 Trying fallback method...')
    try {
      const { error: fallbackError } = await supabase.rpc('exec_sql', { 
        sql: 'SELECT version();' 
      })
      
      if (fallbackError) {
        console.log('❌ Fallback failed:', fallbackError.message)
        console.log('\n💡 Manual migration required:')
        console.log('Go to Supabase Dashboard > SQL Editor and run the migrations manually')
      }
    } catch (fallbackError) {
      console.log('❌ Fallback also failed:', fallbackError.message)
    }
  }
}

applyMigrations()
