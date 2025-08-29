# 🔧 Complete Setup Guide pentru AutoOrder Admin Panel

## 🎯 Obiectiv Final
✅ Admin Panel Complet Funcțional cu:
- Gestionare vehicule CRUD complet
- Upload imagini Cloudinary
- Featured system pentru homepage
- Gestionare lead-uri cu status tracking
- Interfață modernă și intuitivă
- Securitate Supabase Auth
- Zero erori TypeScript

## 📋 Pași de Configurare

### 1. Configurare Supabase

#### A. Creează Proiect Supabase
1. Mergi la https://supabase.com
2. Creează un proiect nou
3. Notează URL-ul și cheile din Settings > API

#### B. Aplică Migrările
În Supabase Dashboard > SQL Editor, aplică în ordine:

**Migrare 001 - Schema inițială:**
```sql
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

-- RLS policies
create policy "public can read vehicles" on public.vehicles for select using (true);
create policy "admin can modify vehicles" on public.vehicles for all using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%') with check ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');
create policy "anyone can insert leads" on public.leads for insert with check (true);
create policy "admin can read leads" on public.leads for select using ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

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
```

**Migrare 003 - Schema admin simplificată:**
```sql
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
```

#### C. Creează Admin User în Supabase Auth
1. Mergi la **Authentication > Users**
2. Click **"Add user"**
3. Completează:
   - **Email**: `admin@autoorder.ro`
   - **Password**: `admin123`
   - **User metadata**:
   ```json
   {
     "role": "admin",
     "name": "Admin User"
   }
   ```

### 2. Configurare Variabile de Mediu

Creează fișierul `.env.local` în root-ul proiectului:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned

# Email Configuration (optional)
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Configurare Cloudinary

#### A. Creează Cont Cloudinary
1. Mergi la https://cloudinary.com
2. Creează un cont gratuit
3. Notează Cloud Name din Dashboard

#### B. Configurează Upload Preset
1. Mergi la Settings > Upload
2. Scroll la Upload presets
3. Creează un nou preset numit `autoorder_unsigned`
4. Setează **Signing Mode** la **Unsigned**
5. Salvează preset-ul

### 4. Testare și Verificare

#### A. Start Aplicația
```bash
pnpm dev
```

#### B. Testează Funcționalitățile

**1. Homepage (http://localhost:3000)**
- Verifică că se încarcă fără erori
- Testează că featured vehicles se afișează

**2. Admin Panel (http://localhost:3000/admin)**
- Login cu: `admin@autoorder.ro` / `admin123`
- Verifică că poți accesa dashboard-ul

**3. Gestionare Vehicule**
- Testează adăugarea unui vehicul nou
- Testează editarea unui vehicul existent
- Testează ștergerea unui vehicul
- Testează marcarea ca featured

**4. Upload Imagini**
- Testează upload-ul de imagini la un vehicul
- Verifică că imaginile se afișează corect

**5. Gestionare Lead-uri**
- Testează că lead-urile se afișează în admin
- Testează actualizarea status-ului lead-urilor

### 5. Troubleshooting

#### Eroare "Could not find the table 'public.vehicles'"
- Verifică că migrările au fost aplicate în Supabase
- Verifică că nu există conflicte între migrări

#### Eroare "Unauthorized"
- Verifică că admin user există în Supabase Auth
- Verifică că user metadata conține `"role": "admin"`
- Verifică variabilele de mediu Supabase

#### Upload imagini nu funcționează
- Verifică configurația Cloudinary
- Verifică că upload preset este configurat corect
- Verifică CORS settings în Cloudinary

#### Eroare TypeScript
- Rulează `pnpm typecheck` pentru a verifica erorile
- Verifică că toate tipurile sunt definite corect

### 6. Verificare Finală

✅ **Checklist Complet:**
- [ ] Supabase proiect creat și configurat
- [ ] Migrările aplicate cu succes
- [ ] Admin user creat în Supabase Auth
- [ ] Variabile de mediu configurate
- [ ] Cloudinary configurat
- [ ] Aplicația pornește fără erori
- [ ] Admin panel accesibil
- [ ] CRUD vehicule funcțional
- [ ] Upload imagini funcțional
- [ ] Featured system funcțional
- [ ] Gestionare lead-uri funcțională
- [ ] Zero erori TypeScript

## 🎉 Rezultat Final

După completarea tuturor pașilor, vei avea un admin panel complet funcțional cu:
- Gestionare vehicule CRUD complet
- Upload imagini Cloudinary
- Featured system pentru homepage
- Gestionare lead-uri cu status tracking
- Interfață modernă și intuitivă
- Securitate Supabase Auth
- Zero erori TypeScript
