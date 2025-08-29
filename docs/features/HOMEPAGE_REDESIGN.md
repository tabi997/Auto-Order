# Homepage Redesign - AutoOrder

## Overview
Redesign complet al homepage-ului AutoOrder, orientat pe conversii și optimizat pentru utilizatori. Focus pe claritate, CTA-uri eficiente și social proof.

## Componente Noi

### 1. Hero.tsx
- **Headline**: "Mașina ta, adusă la comandă din licitații B2B (Openlane)"
- **Subheadline**: Cost total final, verificare istoric, livrare rapidă
- **CTA primar**: "Cere ofertă în 60s" → ancoră către LeadQuickForm
- **CTA secundar**: "Vezi stocul disponibil" → /stock
- **Trust row**: 4 sigilii (Acces B2B, Preț garantat, Verificare, Livrare)

### 2. LeadQuickForm.tsx
- **3 câmpuri principale**: Marca/Model, Buget, Contact (tel/email)
- **Progressive disclosure**: câmpuri opționale (km, combustibil, cutie)
- **Submit**: POST /api/leads
- **Toast**: "Mulțumim! Te contactăm în 15–30 min."
- **ID**: "lead-quick" pentru ancorare

### 3. ProcessTimeline.tsx
- **4 pași**: Selectezi modelul → Găsim în Openlane → Verificăm & cost total → Livrare + acte
- **Design**: Timeline vizual cu iconuri și numere
- **CTA**: Link către formular

### 4. SocialProof.tsx
- **Testimoniale**: 3 feedback-uri reale cu rating
- **Statistici**: 350+ comenzi, 96% livrări sub buget, 4.9/5 rating
- **Parteneri**: Openlane, ADESA, Transport (placeholder)

### 5. Benefits.tsx (refactorizat)
- **4 carduri mari**: Preț final, Acces B2B, Verificare istoric, Livrare 14-21 zile
- **Iconuri shadcn**: Euro, Shield, Search, Truck
- **CTA section**: Brief + consultant

### 6. CostMiniCalculator.tsx
- **Input**: Preț licitație + Țara
- **Output**: Breakdown costuri (transport, comision, taxe)
- **CTA**: "Cere ofertă cu acești parametri" → LeadQuickForm

### 7. FeaturedStock.tsx
- **3-6 carduri**: Mașini din /api/vehicles
- **Informații**: Poză, Marca Model An, km, preț all-in
- **Badge**: "Fără accidente"
- **CTA**: "Rezervă consultanță"

### 8. FAQ.tsx (refactorizat)
- **6 întrebări**: Garanție, livrare, taxe, avans, verificări, acte
- **Design**: Accordion simplu
- **CTA**: Ofertă + contact

### 9. FinalCTA.tsx
- **Band full-width**: "Ai un model în minte?"
- **CTA mare**: "Primește cotație în 60s" → #lead-quick
- **Benefits**: Răspuns rapid, fără obligații, oferte personalizate

## Structura Paginii

```tsx
<main>
  <Hero />
  <LeadQuickForm />
  <Benefits />
  <ProcessTimeline />
  <SocialProof />
  <CostMiniCalculator />
  <FeaturedStock />
  <FAQ />
  <FinalCTA />
</main>
```

## Optimizări Implementate

### UI/UX
- **max-w-[1200px]**: Container consistent
- **spacing aerisit**: py-20 pentru secțiuni
- **Tipografie**: text-5xl font-bold pentru headline-uri
- **Imagery**: Next/Image pentru optimizare
- **Grid responsive**: 1/2/3/4 coloane pe breakpoints

### SEO
- **Metadata**: Title și description optimizate
- **OG tags**: Pentru social sharing
- **Alt text**: Pentru toate imaginile
- **H1 unic**: În Hero component

### Analytics (preparat)
- **Evenimente**: hero_cta, lead_submit, calc_submit, stock_card_click
- **Tracking**: Pentru toate CTA-urile importante

### i18n
- **Fallback RO**: Toate stringurile în română
- **Structură**: Pregătită pentru extensie

## CTA-uri și Conversii

### Primary CTAs
1. **Hero**: "Cere ofertă în 60s" → #lead-quick
2. **LeadForm**: "Primește ofertă" → POST /api/leads
3. **Calculator**: "Cere ofertă cu parametri" → #lead-quick
4. **Stock**: "Rezervă consultanță" → /stock/[id]
5. **Final**: "Primește cotație în 60s" → #lead-quick

### Secondary CTAs
- "Vezi stocul disponibil" → /stock
- "Vorbește cu consultant" → /contact
- "Contactează-ne" → /contact

## Branch-uri

- **backup-initial**: Starea originală a proiectului
- **homepage-redesign**: Toate modificările de redesign
- **main**: Branch-ul principal (neatins)

## Următorii Pași

1. **Testare**: Verificare funcționalitate și UX
2. **Analytics**: Implementare tracking evenimente
3. **A/B Testing**: Testare variante CTA-uri
4. **Performance**: Optimizare loading și Core Web Vitals
5. **Mobile**: Testare și optimizare mobile-first

## Commit-uri

- `7a4a57d`: Complete homepage redesign with new components
  - 10 files changed, 1173 insertions(+), 190 deletions(-)
  - 7 componente noi create
  - 3 componente refactorizate
  - Fix ESLint errors și optimizare imagini
