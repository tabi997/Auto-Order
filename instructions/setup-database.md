# Setup Database pentru AutoOrder MVP

## 1. Aplică Migrările în Supabase

Conectează-te la Supabase Dashboard și aplică migrările în ordine:

### Migrare 001: Schema inițială
```sql
-- Aplică conținutul din supabase/migrations/001_initial_schema.sql
```

### Migrare 002: Schema admin (opțional - va fi înlocuită)
```sql
-- Aplică conținutul din supabase/migrations/002_admin_schema.sql
```

### Migrare 003: Schema simplificată (IMPORTANTĂ)
```sql
-- Aplică conținutul din supabase/migrations/003_simplified_schema.sql
```

## 2. Configurează Supabase Auth

### Creează Admin User
1. Mergi la **Authentication > Users** în Supabase Dashboard
2. Click **"Add user"**
3. Completează:
   - **Email**: `admin@autoorder.ro`
   - **Password**: `admin123` (schimbă după prima logare)
   - **User metadata**: 
   ```json
   {
     "role": "admin",
     "name": "Admin User"
   }
   ```

### Configurează RLS Policies
Asigură-te că RLS este activat și că admin-ul poate accesa toate datele:

```sql
-- Pentru tabela vehicles
CREATE POLICY "admin can manage vehicles" ON public.vehicles
FOR ALL USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
WITH CHECK ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');

-- Pentru tabela leads
CREATE POLICY "admin can manage leads" ON public.leads
FOR ALL USING ((auth.jwt()->>'user_metadata') like '%"role":"admin"%')
WITH CHECK ((auth.jwt()->>'user_metadata') like '%"role":"admin"%');
```

## 3. Variabile de Mediu

Creează fișierul `.env.local` cu:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=autoorder

# Resend
RESEND_API_KEY=your_resend_api_key
```

## 4. Testare

1. **Start aplicația**: `pnpm dev`
2. **Testează homepage**: http://localhost:3002
3. **Testează admin**: http://localhost:3002/admin
   - Login: `admin@autoorder.ro`
   - Password: `admin123`

## 5. Funcționalități Admin

### Gestionare Vehicule
- **Adaugă vehicul nou**: Click "Adaugă Vehicul"
- **Editează vehicul**: Click iconița edit
- **Șterge vehicul**: Click iconița delete
- **Featured vehicule**: Click steaua pentru a marca ca featured

### Gestionare Lead-uri
- **Vezi toate lead-urile**: /admin/leads
- **Actualizează status**: Select dropdown pentru fiecare lead
- **Statusuri disponibile**: Nou, Calificat, Cotat, Aprobat, Comandat, Livrat

## 6. Troubleshooting

### Eroare "Database error"
- Verifică că migrările au fost aplicate
- Verifică că RLS policies sunt configurate corect
- Verifică variabilele de mediu Supabase

### Eroare "Unauthorized"
- Verifică că admin user există în Supabase Auth
- Verifică că user metadata conține `"role": "admin"`
- Verifică că middleware funcționează corect

### Upload imagini nu funcționează
- Verifică configurația Cloudinary
- Verifică că upload preset este configurat corect
- Verifică CORS settings în Cloudinary
