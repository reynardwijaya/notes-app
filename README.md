# 📝 Notes App

Aplikasi pencatatan pribadi yang bikin catatanmu tetap rapi, tercari, dan gampang dikelola. Dilengkapi kategori berwarna dan dashboard admin buat yang perlu kontrol lebih atas seluruh data pengguna.

- 🗂️ Kelompokkan catatan pakai kategori berwarna biar sekali lihat langsung kebaca
- 🔍 Cari, filter (rentang tanggal & kategori), dan urutkan catatan dalam sekejap
- 🔐 Autentikasi lengkap — login, register, lupa password, sampai reset password
- 📊 Dashboard admin buat memantau aktivitas dan data seluruh pengguna
- ⚡ Navigasi cepat dengan pagination di setiap panel data

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| UI | React 19, MUI 7, Tailwind CSS |
| Backend & Auth | Supabase (Postgres, Auth, SSR) |
| Validasi | Valibot |
| Hosting | Vercel |

## Environment Variables

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key Supabase |

Ambil kedua value di atas dari Dashboard Supabase > Project Settings > API.

## Cara Instalasi & Menjalankan

Prasyarat: Node.js 20+ dan akun Supabase.

```bash
# 1. Clone repo
git clone <repo-url>
cd notes-app

# 2. Install dependencies
npm install

# 3. Siapkan environment variables
cp .env.example .env.local
# isi .env.local sesuai section Environment Variables di atas

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Script tambahan:

```bash
npm run build   # build production
npm run start   # jalankan hasil build
npm run lint    # cek lint
```
