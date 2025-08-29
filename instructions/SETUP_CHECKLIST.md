# ✅ AutoOrder Admin Panel - Setup Checklist

## 🎯 Obiectiv Final
Admin Panel Complet Funcțional cu:
- ✅ Gestionare vehicule CRUD complet
- ✅ Upload imagini Cloudinary
- ✅ Featured system pentru homepage
- ✅ Gestionare lead-uri cu status tracking
- ✅ Interfață modernă și intuitivă
- ✅ Securitate Supabase Auth
- ✅ Zero erori TypeScript

## 📋 Checklist Complet

### 🔧 1. Configurare Supabase
- [ ] **Creează proiect Supabase**
  - [ ] Mergi la https://supabase.com
  - [ ] Creează proiect nou
  - [ ] Notează URL și cheile din Settings > API

- [ ] **Aplică migrările în ordine**
  - [ ] Mergi la SQL Editor în Supabase Dashboard
  - [ ] Aplică `001_initial_schema.sql` (vehicles, leads, RLS policies)
  - [ ] Aplică `003_simplified_schema.sql` (admin_users table)

- [ ] **Creează admin user în Supabase Auth**
  - [ ] Mergi la Authentication > Users
  - [ ] Click "Add user"
  - [ ] Email: `admin@autoorder.ro`
  - [ ] Password: `admin123`
  - [ ] User metadata:
    ```json
    {
      "role": "admin",
      "name": "Admin User"
    }
    ```

### 🌐 2. Configurare Variabile de Mediu
- [ ] **Creează .env.local**
  - [ ] Rulează: `pnpm setup:env`
  - [ ] Completează credențialele Supabase
  - [ ] Completează credențialele Cloudinary
  - [ ] Completează Resend API key (opțional)

### ☁️ 3. Configurare Cloudinary
- [ ] **Creează cont Cloudinary**
  - [ ] Mergi la https://cloudinary.com
  - [ ] Creează cont gratuit
  - [ ] Notează Cloud Name din Dashboard

- [ ] **Configurează Upload Preset**
  - [ ] Mergi la Settings > Upload
  - [ ] Scroll la Upload presets
  - [ ] Creează preset nou: `autoorder_unsigned`
  - [ ] Setează Signing Mode la Unsigned
  - [ ] Salvează preset-ul

### 🚀 4. Testare și Verificare
- [ ] **Start aplicația**
  - [ ] Rulează: `pnpm dev`
  - [ ] Verifică că nu sunt erori în terminal

- [ ] **Testează Homepage**
  - [ ] Accesează: http://localhost:3000
  - [ ] Verifică că se încarcă fără erori
  - [ ] Verifică că featured vehicles se afișează

- [ ] **Testează Admin Panel**
  - [ ] Accesează: http://localhost:3000/admin
  - [ ] Login cu: `admin@autoorder.ro` / `admin123`
  - [ ] Verifică că poți accesa dashboard-ul

- [ ] **Testează CRUD Vehicule**
  - [ ] Adaugă un vehicul nou
  - [ ] Editează un vehicul existent
  - [ ] Șterge un vehicul
  - [ ] Marchează un vehicul ca featured

- [ ] **Testează Upload Imagini**
  - [ ] Upload o imagine la un vehicul
  - [ ] Verifică că imaginea se afișează corect
  - [ ] Verifică că URL-ul este de la Cloudinary

- [ ] **Testează Gestionare Lead-uri**
  - [ ] Accesează: http://localhost:3000/admin/leads
  - [ ] Verifică că lead-urile se afișează
  - [ ] Testează actualizarea status-ului

### 🔍 5. Troubleshooting
- [ ] **Eroare "Could not find the table 'public.vehicles'"**
  - [ ] Verifică că migrările au fost aplicate în Supabase
  - [ ] Verifică că nu există conflicte între migrări

- [ ] **Eroare "Unauthorized"**
  - [ ] Verifică că admin user există în Supabase Auth
  - [ ] Verifică că user metadata conține `"role": "admin"`
  - [ ] Verifică variabilele de mediu Supabase

- [ ] **Upload imagini nu funcționează**
  - [ ] Verifică configurația Cloudinary
  - [ ] Verifică că upload preset este configurat corect
  - [ ] Verifică CORS settings în Cloudinary

- [ ] **Eroare TypeScript**
  - [ ] Rulează: `pnpm typecheck`
  - [ ] Verifică că toate tipurile sunt definite corect

## 🎉 Rezultat Final

După completarea tuturor pașilor, vei avea:

### ✅ Funcționalități Admin
- **Dashboard complet** cu statistici
- **Gestionare vehicule** CRUD complet
- **Upload imagini** Cloudinary
- **Featured system** pentru homepage
- **Gestionare lead-uri** cu status tracking
- **Interfață modernă** și intuitivă

### ✅ Securitate
- **Supabase Auth** pentru autentificare
- **RLS policies** pentru protecția datelor
- **Admin-only access** pentru funcționalități sensibile

### ✅ Performanță
- **Zero erori TypeScript**
- **Optimizări pentru imagini** Cloudinary
- **Indexare baza de date** pentru performanță

## 🚀 Comenzi Utile

```bash
# Setup environment
pnpm setup:env

# View database setup instructions
pnpm setup:db

# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Build for production
pnpm build
```

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică checklist-ul de mai sus
2. Verifică console-ul browser-ului pentru erori
3. Verifică terminal-ul pentru erori
4. Verifică Supabase Dashboard pentru erori de baza de date

---

**🎯 Obiectiv atins: Admin Panel Complet Funcțional!**
