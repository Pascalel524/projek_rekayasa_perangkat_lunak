# 🍽️ KantinOnline

Aplikasi Web Pemesanan dan Pembayaran Kantin Kampus Terpadu berbasis **React**, **TypeScript**, **Vite**, dan **Supabase (PostgreSQL & Auth)**.

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Tests-25%20Passed-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🔗 Akses Aplikasi & Paket Demo

* **Video Demo Aplikasi**: [Tonton Video Demo (Google Drive)](https://drive.google.com/file/d/19YmwKQjIiMbJOoItYrynu9cLeExRWyjk/view?usp=sharing)
* **Demo Deployment**: Tersedia melalui Vercel / Render Static Site.

---

## 🚀 Panduan Instalasi Ulang dari FRESH CLONE

Ikuti langkah-langkah di bawah ini untuk mengklon repositori dari awal (*fresh clone*), memasang dependensi, menjalankan pengujian, dan menjalankan aplikasi secara lokal.

### 1. Clone Repositori
```bash
git clone https://github.com/Pascalel524/projek_rekayasa_perangkat_lunak.git
cd projek_rekayasa_perangkat_lunak/KantinOnline
```

### 2. Konfigurasi Environment Variables
Salin berkas contoh environment:
```bash
cp .env.example .env
```
Buka file `.env` dan masukkan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

> **Catatan Keamanan:** Gunakan selalu kunci `anon/public key`. Jangan pernah menggunakan atau memasukkan `service_role key` ke dalam aplikasi frontend.

### 3. Konfigurasi Database Supabase
1. Masuk ke dashboard [Supabase](https://supabase.com/dashboard) pada project Anda.
2. Buka menu **SQL Editor** (ikon terminal `>_`) dan klik **New Query**.
3. Buka berkas `supabase/schema.sql` pada proyek ini, salin seluruh isinya, lalu jalankan (**Run**) di SQL Editor.
4. Skema akan membuat tabel `users`, `products`, `transactions`, `transaction_items`, trigger profil otomatis, fungsi RPC anti-tampering `save_transaction`, dan aturan **Row Level Security (RLS)**.
5. (Opsional untuk testing/demo): Pada menu **Authentication** > **Providers** > **Email**, matikan centang **Confirm email** agar user yang baru mendaftar dapat langsung login tanpa verifikasi inbox.

### 4. Instalasi Dependensi
```bash
npm install
```

### 5. Menjalankan Unit Test (Vitest)
Pastikan semua unit test lolos:
```bash
npm test
```
*Hasil: 5 test suites lolos, 25/25 unit tests passed.*

### 6. Pengecekan Validasi Tipe (TypeScript)
```bash
npm run typecheck
```

### 7. Menjalankan Server Development Lokal
```bash
npm run dev
```
Buka peramban di: **`http://localhost:5173`**

### 8. Membangun Berkas Produksi (Production Build)
```bash
npm run build
```
Hasil build akan berada di direktori `dist/`. Untuk menguji preview hasil build produksi:
```bash
npm run preview
```

---

## 🌐 Panduan Deployment ke Cloud

### A. Deploy ke Vercel (Rekomendasi Utama)
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Pilih **Add New...** > **Project** lalu **Import** repositori `projek_rekayasa_perangkat_lunak`.
3. Atur konfigurasi:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `KantinOnline` *(Wajib diatur ke subdirektori KantinOnline)*
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL` = `[URL Supabase Anda]`
   - `VITE_SUPABASE_ANON_KEY` = `[Anon Key Supabase Anda]`
5. Klik **Deploy**.

### B. Deploy ke Render (Static Site)
1. Buka [Dashboard Render](https://dashboard.render.com) > **+ New** > **Static Site**.
2. Hubungkan repositori GitHub `projek_rekayasa_perangkat_lunak`.
3. Konfigurasi:
   - **Branch**: `main`
   - **Root Directory**: `KantinOnline`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Masukkan environment variable `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
5. Klik **Create Static Site**.

---

## 📁 Struktur Direktori

```text
projek_rekayasa_perangkat_lunak/
├── KantinOnline/                  # Direktori utama kode sumber aplikasi
│   ├── src/
│   │   ├── services/
│   │   │   └── db.ts             # Service Supabase (Auth, Transaksi, Profil)
│   │   ├── App.tsx               # Komponen utama UI, checkout, & QRIS
│   │   ├── main.tsx              # Entry point aplikasi
│   │   ├── auth.ts & auth.test.ts # Logika autentikasi & unit test
│   │   ├── cart.ts & cart.test.ts # Logika keranjang belanja & unit test
│   │   ├── catalog.ts & .test.ts  # Filter & pencarian katalog toko
│   │   ├── order.ts & .test.ts    # Validasi & kalkulasi order
│   │   ├── payment.ts & .test.ts  # Format mata uang & validasi pembayaran
│   │   └── styles.css            # Desain antarmuka & tema aplikasi
│   ├── supabase/
│   │   └── schema.sql            # Skema DDL, RLS, Trigger, & Stored Procedure
│   ├── package.json              # Daftar dependensi & npm scripts
│   ├── tsconfig.json             # Konfigurasi compiler TypeScript
│   └── vite.config.ts            # Konfigurasi bundler Vite
├── HowToRun.md                   # Panduan operasional tambahan
├── link_video                    # Berkas tautan video demo
└── README.md                     # Dokumentasi utama proyek
```

---

## 🧪 Rangkuman Status Pengujian

| Komponen Pengujian | Berkas Test | Status | Jumlah Test |
| :--- | :--- | :---: | :---: |
| **Keranjang Belanja (Cart)** | `src/cart.test.ts` | ✅ Passed | 5 |
| **Pemesanan (Order)** | `src/order.test.ts` | ✅ Passed | 5 |
| **Katalog & Filter Toko** | `src/catalog.test.ts` | ✅ Passed | 5 |
| **Autentikasi Pengguna** | `src/auth.test.ts` | ✅ Passed | 5 |
| **Validasi Pembayaran** | `src/payment.test.ts` | ✅ Passed | 5 |
| **TypeScript Typecheck** | `tsc --noEmit` | ✅ 0 Errors | - |
| **Total Unit Tests** | | **✅ 100% Passed** | **25 / 25** |
