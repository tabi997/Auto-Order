# AI Changelog

## 2024-12-28 15:30 - Stabilizare Tailwind + Implementare Upload Local

### Fișiere modificate:
- `tailwind.config.js` - Șters (duplicat cu tailwind.config.ts)
- `tailwind.config.ts` - Actualizat content paths pentru a include toate fișierele din src/
- `docs/AI_CHANGELOG.md` - Creat (acest fișier)
- `docs/adr/0001-local-uploads-vs-saas.md` - Creat

### Scopul modificărilor:
1. **Stabilizare Tailwind/CSS**: Eliminat configurația duplicată, corectat content paths
2. **Pregătire pentru upload local**: Eliminat dependențele UploadThing, pregătit structura

### Decizii arhitecturale:
- Păstrat doar `tailwind.config.ts` (TypeScript) pentru consistență
- Configurat content paths să includă toate fișierele din src/ pentru a evita problemele cu CSS
- Eliminat UploadThingProvider din layout (va fi înlocuit cu soluția locală)

### Status:
- ✅ Tailwind config curățat
- 🔄 În curs: Implementare upload local
- ⏳ Următor: API route pentru uploads, AdminImagesUploader actualizat

## 2025-08-27 20:04:25 - Implementare completă: API upload local funcțional, AdminImagesUploader actualizat, Tailwind stabilizat, build și typecheck OK


## 2025-08-27 20:15:19 - FIX COMPLET: Tailwind CSS 4.x funcțional cu @tailwindcss/postcss, CSS se compilează corect în dev și build, site-ul se afișează cu stilizare completă

