# AutoOrder - Mașini la comandă din licitații B2B

Platformă pentru aducerea mașinilor la comandă din licitații B2B (Openlane/ADESA) pentru persoane fizice în România.

## 🚀 MVP Core Features

- **Homepage optimizat conversii**: Hero clar, form rapid, proces 4 pași, social proof, calculator simplu, featured stock
- **Stoc real în DB**: Supabase cu toggle featured din Admin → alimentează secțiunea „Mașini disponibile"
- **Admin panel funcțional**: Vehicles CRUD (+upload imagini Cloudinary), Leads list, protejat cu Supabase Auth
- **Lead flow**: POST /api/leads → salvează în DB + email Resend + Telegram alert
- **Securitate & UX**: RLS, rate-limit pe lead form, i18n strings, imagini fallback, mobile-first

## 🛠️ Setup

### 1. Instalare dependințe

```bash
pnpm install
```

### 2. Configurare variabile de mediu

Creează fișierul `.env.local` bazat pe `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned

# Email & Notifications
RESEND_API_KEY=your_resend_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 3. Configurare Supabase

1. Creează un proiect Supabase
2. Rulează migrația din `supabase/migrations/001_initial_schema.sql`
3. Configurează RLS (Row Level Security) pentru tabelele `vehicles` și `leads`

### 4. Configurare Cloudinary

1. Creează un cont Cloudinary
2. Creează un upload preset unsigned numit `autoorder_unsigned`
3. Configurează folderul `autoorder/vehicles` pentru imagini

### 5. Configurare Resend

1. Creează un cont Resend
2. Configurează domeniul pentru email-uri
3. Adaugă API key-ul în variabilele de mediu

### 6. Configurare Telegram Bot

1. Creează un bot Telegram prin @BotFather
2. Obține token-ul bot-ului
3. Obține chat ID-ul pentru notificări
4. Adaugă în variabilele de mediu

### 7. Setare rol admin

În Supabase Dashboard:
1. Mergi la Authentication → Users
2. Găsește utilizatorul admin
3. Editează user_metadata: `{ "role": "admin" }`

### 8. Rulare aplicație

```bash
# Development
pnpm dev

# Build pentru producție
pnpm build

# Start producție
pnpm start
```

## 📁 Structura proiectului

```
src/
├── app/
│   ├── admin/                 # Panou admin protejat
│   │   ├── vehicles/         # Gestionare vehicule
│   │   ├── leads/            # Vizualizare lead-uri
│   │   └── login/            # Autentificare admin
│   ├── api/                  # API Routes
│   │   ├── vehicles/         # GET vehicule (public)
│   │   ├── admin/vehicles/   # CRUD vehicule (admin)
│   │   ├── leads/            # POST lead-uri (public)
│   │   ├── admin/leads/      # GET lead-uri (admin)
│   │   └── upload/           # Upload imagini Cloudinary
│   └── page.tsx              # Homepage
├── components/
│   ├── home/                 # Componente homepage
│   │   ├── FeaturedStock.tsx # Secțiunea mașini disponibile
│   │   └── LeadQuickForm.tsx # Formular lead rapid
│   └── ui/                   # Componente UI (shadcn/ui)
├── lib/
│   ├── supabase/             # Client Supabase
│   ├── auth.ts               # Utilitare autentificare
│   └── cloudinary.ts         # Utilitare Cloudinary
└── schemas/
    └── vehicle.ts            # Schema Zod pentru validare
```

## 🔧 API Endpoints

### Public
- `GET /api/vehicles` - Lista vehicule (cu suport featured)
- `POST /api/leads` - Creare lead (cu rate limiting)

### Admin (protejat)
- `POST /api/admin/vehicles` - Creare vehicul
- `PUT /api/admin/vehicles/[id]` - Actualizare vehicul
- `DELETE /api/admin/vehicles/[id]` - Ștergere vehicul
- `GET /api/admin/leads` - Lista lead-uri
- `PUT /api/admin/leads/[id]` - Actualizare status lead

## 🎯 Funcționalități principale

### Homepage
- Hero cu copy optimizat conversii
- Formular lead rapid (3 câmpuri)
- Proces 4 pași vizual
- Social proof și testimoniale
- Calculator cost simplu
- Secțiune mașini disponibile (din DB)

### Admin Panel
- Autentificare Supabase Auth (magic link)
- Gestionare vehicule CRUD
- Upload imagini Cloudinary
- Toggle featured pentru homepage
- Vizualizare lead-uri cu status tracking

### Lead Flow
- Formular homepage → POST /api/leads
- Salvare în DB Supabase
- Email automat prin Resend
- Notificare Telegram
- Rate limiting (10/min/IP)

## 🔒 Securitate

- RLS (Row Level Security) pe toate tabelele
- Rate limiting pe API-uri publice
- Validare Zod pentru toate input-urile
- Autentificare admin cu verificare rol
- Sanitizare imagini upload

## 📱 Responsive & UX

- Mobile-first design
- Fără scroll orizontal
- Imagini cu fallback
- Loading states
- Toast notifications
- ARIA labels pentru accesibilitate

## 🚀 Deploy

### Vercel
1. Conectează repository-ul
2. Adaugă toate variabilele de mediu
3. Deploy automat

### Variabile obligatorii pentru Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`
- `RESEND_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## 📊 Analytics

Toate CTA-urile au `data-analytics-id` pentru tracking:
- `hero_cta` - CTA din hero
- `lead_submit` - Submit formular lead
- `calc_submit` - Submit calculator
- `stock_card_click` - Click pe card mașină

## 🤝 Contribuții

1. Fork repository-ul
2. Creează branch pentru feature: `git checkout -b feature/nume-feature`
3. Commit schimbările: `git commit -am 'Adaugă feature'`
4. Push la branch: `git push origin feature/nume-feature`
5. Creează Pull Request

## 📄 Licență

Acest proiect este proprietar și confidențial.
