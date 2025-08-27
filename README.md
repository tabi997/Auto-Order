# AutoOrder – Mașini la comandă din licitații B2B

Un proiect modern pentru gestionarea comenzilor de mașini din licitații B2B, construit cu Next.js 14, TypeScript, TailwindCSS și shadcn/ui.

## 🚀 Tehnologii

- **Next.js 14** - App Router
- **TypeScript** - Tipizare statică
- **TailwindCSS** - Stilizare utilitară
- **shadcn/ui** - Componente UI moderne
- **Lucide React** - Iconuri
- **React Hook Form** - Gestionare formulare
- **Zod** - Validare scheme
- **next-themes** - Suport dark mode

## 📦 Instalare

```bash
# Instalează dependențele
pnpm install

# Rulează în modul development
pnpm dev
```

## 🌐 Acces

Aplicația va fi disponibilă la [http://localhost:3000](http://localhost:3000)

## 🏗️ Structura Proiectului

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── contact/           # Pagina de contact
│   ├── sourcing/          # Pagina de sourcing
│   ├── stock/             # Pagina de stoc
│   ├── globals.css        # Stiluri globale
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Pagina principală
├── components/            # Componente reutilizabile
│   ├── ui/               # Componente shadcn/ui
│   ├── home/             # Componente specifice home page
│   └── ...               # Alte componente
├── i18n/                 # Internaționalizare
├── lib/                  # Utilități și hooks
└── data/                 # Date mock
```

## 🎯 Funcționalități

### Pagina Principală (/)
- Hero section cu CTA-uri
- Secțiunea "Cum lucrăm" (4 pași)
- "De ce AutoOrder" (6 beneficii)
- Calculator estimativ
- FAQ cu accordion
- Testimoniale
- CTA final

### Stoc (/stock)
- Filtre avansate pentru vehicule
- Listare cu paginare
- Carduri de vehicule
- Căutare și filtrare

### Detalii Vehicul (/stock/[id])
- Galerie de imagini
- Specificații tehnice
- Calculator mini
- Formular de solicitare ofertă

### Sourcing (/sourcing)
- Informații despre proces
- Timeline vizual
- FAQ specific
- Formular de brief rapid

### Contact (/contact)
- Formular de contact complet
- Validare cu Zod
- Pre-selectare tip solicitare
- Informații de contact

## 🔧 API Routes

- `POST /api/leads` - Trimitere lead-uri
- `GET /api/vehicles` - Listare vehicule cu filtrare
- `GET /api/vehicles/[id]` - Detalii vehicul

## 🎨 Design System

- **Culori**: Configurabile în `tailwind.config.ts`
- **Componente**: shadcn/ui cu tema personalizată
- **Responsive**: 100% responsive, fără scroll orizontal
- **Dark Mode**: Suport complet cu toggle

## 📱 Responsive

- Mobile-first design
- Breakpoint-uri: sm, md, lg, xl
- Fără scroll orizontal pe niciun breakpoint
- Layout adaptiv pentru toate dispozitivele

## 🚀 Deployment

```bash
# Build pentru producție
pnpm build

# Start producție
pnpm start
```

## 📝 Scripts Disponibile

```bash
pnpm dev          # Development server
pnpm build        # Build producție
pnpm start        # Start producție
pnpm lint         # Linting
pnpm type-check   # Verificare tipuri TypeScript
```

## 🔍 SEO

- Metadata completă per pagină
- Open Graph tags
- Twitter Cards
- Sitemap.xml
- Robots.txt
- Structură semantică HTML

## 🌍 Internaționalizare

- Suport pentru română și engleză
- Hook `useTranslation`
- Chei de traducere organizate
- Structură extensibilă

## 📊 Analytics

- Hook `useAnalytics` pregătit
- Tracking pentru evenimente
- Page view tracking
- Conversion tracking

## 🤝 Contribuție

1. Fork repository-ul
2. Creează un branch pentru feature
3. Commit modificările
4. Push la branch
5. Creează un Pull Request

## 📄 Licență

Acest proiect este licențiat sub [MIT License](LICENSE).

## 📞 Suport

Pentru întrebări și suport:
- Email: contact@autoorder.ro
- Telefon: +40 123 456 789
- Adresă: București, România
