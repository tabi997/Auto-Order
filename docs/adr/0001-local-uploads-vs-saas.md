# ADR 0001: Local Uploads vs SaaS (UploadThing)

## Status
Accepted

## Context
Proiectul folosea UploadThing pentru gestionarea imaginilor, dar au apărut probleme:
- Dependențe externe care pot cauza instabilitate
- Necesitate de chei API și configurare
- Costuri potențiale pentru producție
- Complexitate în debugging și development

## Decision
Implementăm un sistem de upload local care salvează imaginile în `public/uploads/` cu următoarele caracteristici:
- Multipart form data handling
- Validare tip fișier (image/*)
- Limite de dimensiune (5MB/fișier, 8 fișiere max)
- Organizare pe foldere per listing
- Optimizare imagini cu Sharp (opțional)
- Persistență în Prisma

## Consequences

### Positive
- **Control complet**: Nu depindem de servicii externe
- **Cost zero**: Fără costuri de hosting pentru fișiere
- **Debugging simplu**: Fișierele sunt vizibile direct în filesystem
- **Deployment simplu**: Nu necesită configurare API keys
- **Performance**: Fără latence de rețea pentru upload

### Negative
- **Storage local**: Imaginile ocupă spațiu pe server
- **Backup**: Necesită strategie de backup pentru fișiere
- **Scalabilitate**: Pentru proiecte mari, poate fi nevoie de CDN
- **Maintenance**: Curățenie manuală a fișierelor orfane

### Mitigations
- Implementăm cleanup automat pentru fișierele orfane
- Folosim Sharp pentru optimizare și reducerea dimensiunii
- Organizăm pe foldere pentru management mai bun
- Implementăm validare strictă pentru a preveni upload-uri malicioase

## Alternatives Considered
1. **UploadThing**: Soluția actuală, dar cu problemele menționate
2. **AWS S3**: Costuri și complexitate
3. **Cloudinary**: Dependență externă și costuri
4. **Multer + local storage**: Soluția aleasă - simplă și eficientă

## Implementation Notes
- Route handler în `app/api/uploads/route.ts`
- Validare cu Zod pentru schema
- Folosim `fs/promises` pentru operații asincrone
- Implementăm cleanup automat în cron job sau la delete listing
