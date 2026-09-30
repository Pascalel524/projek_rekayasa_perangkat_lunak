# KantinOnline — Panduan Menjalankan Aplikasi (Frontend)

Panduan singkat untuk menjalankan aplikasi KantinOnline yang berada di folder `KantinOnline` dalam repo ini.

Persyaratan
- Node.js v18+ dan npm atau pnpm/yarn
- Koneksi internet untuk mengunduh dependensi

Langkah menjalankan (pengembangan)
1. Buka terminal dan masuk ke folder aplikasi:
   cd /path/to/repo/projek_rekayasa_perangkat_lunak/KantinOnline

2. Pasang dependensi:
   npm install

3. Jalankan development server:
   npm run dev

4. Buka aplikasi di browser:
   http://localhost:5173

Perintah berguna
- npm run dev       -> Jalankan server dev (Vite)
- npm run build     -> Bangun berkas produksi ke folder `dist`
- npm run preview   -> Preview hasil build (Vite preview)
- npm run typecheck -> Jalankan TypeScript type check (npx tsc --noEmit)

Catatan environment
- Frontend ini tidak memerlukan variabel lingkungan khusus untuk versi awal.
- Jika Anda menambahkan integrasi API/backend nanti, buat file `.env` atau atur secret pada platform hosting.

Panduan build & deploy (statis)
1. Bangun aplikasi produksi:
   npm run build

2. Hasil build ada di `dist/`.

3. Deploy pilihan cepat:
   - Vercel: login ke vercel.com → New Project → pilih repo → Deploy (build command: `npm run build`, output directory: `dist`)
   - Netlify: drag & drop folder `dist` pada Netlify Dashboard atau hubungkan repo dan set build command/output seperti di atas.
   - GitHub Pages: gunakan action atau tool yang mengupload isi `dist/` ke gh-pages branch.

Troubleshooting umum
- Error saat npm install: hapus node_modules dan package-lock.json lalu ulangi:
  rm -rf node_modules package-lock.json
  npm install

- TypeScript error saat menjalankan `npm run dev`:
  jalankan `npm run typecheck` untuk melihat daftar error, lalu perbaiki file yang tercantum.

- Broken import path: pastikan file di dalam `KantinOnline/src` menggunakan impor relatif yang benar.

Struktur singkat folder KantinOnline
- KantinOnline/package.json
- KantinOnline/vite.config.ts
- KantinOnline/index.html
- KantinOnline/src/
  - components/
  - App.tsx
  - main.tsx
  - data.ts
  - types.ts
  - styles.css

Cadangan
- Folder `src/` (root repository) masih ada sebagai cadangan. Versi aplikasi yang aktif ada di `KantinOnline/`.

Bantuan lebih lanjut
- Jika Anda menemui error saat menjalankan perintah di atas, salin pesan error dan kirimkan di sini — saya bantu perbaiki langkah demi langkah.
