# Scripts Documentation

Acest folder conține scripturile de utilitate pentru AutoOrder.

## 🎯 Scripturi Esențiale (Păstrate)

### `setup-database.js`
- **Scop**: Afișează instrucțiuni pentru setup-ul bazei de date
- **Comandă**: `pnpm setup:db`
- **Funcționalitate**: 
  - Citește fișierele de migrare
  - Afișează instrucțiuni pentru aplicarea migrărilor
  - Ghid pentru configurarea admin user
  - Configurarea variabilelor de mediu

### `create-env.js`
- **Scop**: Creează fișierul `.env.local` cu variabilele necesare
- **Comandă**: `pnpm setup:env`
- **Funcționalitate**:
  - Creează template-ul pentru variabilele de mediu
  - Include configurări pentru Supabase, Cloudinary și Resend
  - Instrucțiuni pentru obținerea credențialelor

### `log-ai.js`
- **Scop**: Logging pentru activitatea AI
- **Comandă**: `pnpm log:ai`
- **Funcționalitate**: Logging și debugging pentru AI

## 🗑️ Scripturi Eliminate

Următoarele scripturi au fost eliminate ca fiind neutilizate:

### Scripturi de Test și Debugging
- Scripturi pentru testarea admin panel-ului
- Scripturi pentru testarea lead-urilor
- Scripturi pentru testarea testimoniale
- Scripturi pentru debugging RLS
- Scripturi pentru testarea upload-ului

### Scripturi de Migrare
- Scripturi pentru crearea tabelelor
- Scripturi pentru aplicarea migrărilor
- Scripturi pentru fix-uri RLS

### Scripturi de Verificare
- Scripturi pentru verificarea sintaxei SQL
- Scripturi pentru verificarea tabelelor
- Scripturi pentru testarea sistemului

## 🔧 Cum să Folosești Scripturile

1. **Setup inițial**:
   ```bash
   pnpm setup:env      # Creează .env.local
   pnpm setup:db       # Afișează instrucțiuni DB
   ```

2. **Logging AI**:
   ```bash
   pnpm log:ai         # Logging pentru AI
   ```

## 📝 Notă Importantă

Scripturile eliminate erau folosite în timpul dezvoltării pentru debugging și testare. Acum că aplicația este stabilă, acestea nu mai sunt necesare.

Dacă ai nevoie să testezi ceva specific, poți recrea scripturile necesare sau folosi console-ul browser-ului pentru debugging.
