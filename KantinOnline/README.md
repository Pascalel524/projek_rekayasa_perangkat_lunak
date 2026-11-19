# 🍽️ KantinOnline — Panduan Frontend & Instalasi

Panduan instalasi, pengujian, build, dan evaluasi bug pasca deployment aplikasi **KantinOnline**.

---

## 🔗 Akses Aplikasi & Paket Demo

* **Video Demo Aplikasi**: [Tonton Video Demo di Google Drive](https://drive.google.com/file/d/19YmwKQjIiMbJOoItYrynu9cLeExRWyjk/view?usp=sharing)
* **Demo Deployment**: Tersedia melalui Vercel / Render Static Site.
* **Laporan Evaluasi Bug Pasca Deploy**: [Master Issue #16 di GitHub](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/16)

---

## 🐛 Evaluasi & Penanganan Bug Pasca Deploy (GitHub Issues)

Seluruh 10 permasalahan/bugs pasca deployment telah didaftarkan dan diselesaikan langsung di GitHub Issues. Reviewer dapat melihat detail issue dan solusinya pada tabel di bawah atau melalui **[Master Issue #16](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/16)**:

| No. | Issue GitHub | Judul Permasalahan / Bug | Kategori | Status Solusi |
| :---: | :---: | :--- | :---: | :---: |
| 1 | [#6](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/6) | Single-Page App (SPA) 404 Not Found saat refresh halaman pada Vercel/Render | Deployment | ✅ **Solved & Closed** |
| 2 | [#7](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/7) | Timer batas waktu pembayaran QRIS statis dan tidak menghitung mundur | UI/UX / Payment | ✅ **Solved & Closed** |
| 3 | [#8](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/8) | Risiko bentrok Order ID akibat generator ID menggunakan timestamp pendek | Backend / Critical | ✅ **Solved & Closed** |
| 4 | [#9](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/9) | Riwayat pembayaran di localStorage tidak terisolasi per akun pengguna | Security / Privacy | ✅ **Solved & Closed** |
| 5 | [#10](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/10) | Rincian menu pesanan tidak tersimpan ke tabel `transaction_items` Supabase | Database / Schema | ✅ **Solved & Closed** |
| 6 | [#11](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/11) | Tautan WhatsApp gagal terbuka jika nomor telepon toko berawalan "08" | Integration / WA | ✅ **Solved & Closed** |
| 7 | [#12](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/12) | Unhandled exception fatal saat inisialisasi konfigurasi Supabase (.env) belum lengkap | Robustness / Config | ✅ **Solved & Closed** |
| 8 | [#13](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/13) | Modal QRIS dan bukti pembayaran tidak dapat ditutup menggunakan tombol Escape | Accessibility / UX | ✅ **Solved & Closed** |
| 9 | [#14](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/14) | State draft kuantitas (`cartDrafts`) tidak dibersihkan saat item toko dibayar | State Management | ✅ **Solved & Closed** |
| 10 | [#15](https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak/issues/15) | Ketiadaan notifikasi umpan balik visual dan pembersihan status saat logout | Auth / UI | ✅ **Solved & Closed** |

---

## 🚀 Panduan Instalasi Ulang dari FRESH CLONE

### 1. Klon Repositori
```bash
git clone https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak.git
cd projek_rekayasa_perangkat_lunak/KantinOnline
```

### 2. Salin dan Konfigurasikan Environment Variables
```bash
cp .env.example .env
```
Isi variabel dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

### 3. Konfigurasi Database Supabase
1. Jalankan script `supabase/schema.sql` pada menu **SQL Editor** di dashboard Supabase.
2. Script ini secara otomatis mengonfigurasi tabel `users`, `products`, `transactions`, `transaction_items`, trigger sinkronisasi profil, Row Level Security (RLS), dan stored procedure verifikasi transaksi `save_transaction`.
3. (Opsional untuk testing/demo): Nonaktifkan opsi **Confirm email** pada menu **Authentication** > **Providers** > **Email**.

### 4. Instalasi Dependensi
```bash
npm install
```

### 5. Menjalankan Unit Test (Vitest)
```bash
npm test
```
*Status: 6 test suites, 29/29 unit tests passed.*

### 6. Validasi Type Checking
```bash
npm run typecheck
```

### 7. Menjalankan Development Server Lokal
```bash
npm run dev
```
Akses aplikasi melalui peramban: `http://localhost:5173`

### 8. Membangun Paket Produksi (Build)
```bash
npm run build
```
Hasil kompilasi produksi disimpan di folder `dist/`. Untuk melihat preview hasil build:
```bash
npm run preview
```

---

## 🌐 Panduan Deploy ke Cloud

### A. Vercel (Rekomendasi)
* **Framework Preset**: `Vite`
* **Root Directory**: `KantinOnline`
* **Build Command**: `vite build`
* **Output Directory**: `dist`
* **Environment Variables**: Masukkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.

### B. Render (Static Site)
* **Branch**: `main`
* **Root Directory**: `KantinOnline`
* **Build Command**: `npm install && npm run build`
* **Publish Directory**: `dist`
* **Environment Variables**: Masukkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.

---

## 🧪 Status Pengujian Unit Test

| Test Suite | Fokus Pengujian | Status |
| :--- | :--- | :---: |
| `src/cart.test.ts` | Tambah item, gabung qty, pencegahan qty negatif, kalkulasi total | ✅ Passed (5/5) |
| `src/order.test.ts` | Validasi order, status transisi pesanan, ringkasan belanja | ✅ Passed (5/5) |
| `src/catalog.test.ts` | Filter kategori toko, pencarian produk & toko | ✅ Passed (5/5) |
| `src/auth.test.ts` | Validasi domain email `@student.pradita.ac.id`, proteksi password | ✅ Passed (5/5) |
| `src/payment.test.ts` | Validasi uang pas, kembalian, format mata uang Rupiah | ✅ Passed (5/5) |
| `src/integration.test.ts` | Sanitasi nomor WhatsApp toko & Generator Order ID unik | ✅ Passed (4/4) |
| `tsc --noEmit` | Strict type checking seluruh modul TypeScript | ✅ 0 Errors |
