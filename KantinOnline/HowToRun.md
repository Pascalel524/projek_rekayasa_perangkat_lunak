# 📖 Panduan Menjalankan Proyek: KantinOnline

Dokumen ini berisi panduan lengkap langkah demi langkah untuk menjalankan, mengonfigurasi, dan mendeploy aplikasi **KantinOnline** (Frontend React + Vite + TypeScript dengan Database Supabase).

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Konfigurasi Database Supabase](#2-konfigurasi-database-supabase)
3. [Menjalankan di Komputer Lokal (Local Development)](#3-menjalankan-di-komputer-lokal-local-development)
4. [Panduan Deploy ke Cloud (Vercel & Render)](#4-panduan-deploy-ke-cloud)
5. [Fitur Utama Aplikasi](#5-fitur-utama-aplikasi)
6. [Troubleshooting Umum](#6-troubleshooting-umum)

---

## 1. Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang:
* **Node.js**: Versi `18.x` atau lebih baru (`20.x` / `22.x` disarankan). Cek dengan perintah:
  ```bash
  node -v
  ```
* **Package Manager**: `npm` (bawaan Node.js) atau `pnpm` / `yarn`.
* **Git**: Untuk clone dan push ke repository.
* **Akun Supabase**: Akun gratis di [supabase.com](https://supabase.com).

---

## 2. Konfigurasi Database Supabase

Aplikasi ini menggunakan database PostgreSQL dan Authentication yang disediakan oleh **Supabase**.

### Langkah 1: Buat Project Baru di Supabase
1. Buka [supabase.com/dashboard](https://supabase.com/dashboard) dan login.
2. Klik tombol **New Project**, beri nama project (misal: `kantin-online`), buat password database, dan pilih region terdekat (misal: *Singapore*).

### Langkah 2: Buat Skema Tabel Database
1. Di panel menu kiri dashboard Supabase, buka menu **SQL Editor** (ikon terminal `>_`).
2. Klik tombol **`+ New Query`**.
3. Buka file `supabase/schema.sql` yang ada di proyek ini, lalu salin (**Copy**) seluruh isinya.
4. Tempel (**Paste**) ke kolom SQL Editor Supabase, lalu klik tombol **`Run`** (atau tekan `Ctrl + Enter`).
5. Periksa menu **Table Editor** di sidebar kiri. Tabel-tabel berikut harus sudah terbentuk:
   * `users` (profil pengguna)
   * `products` (daftar menu makanan/minuman)
   * `transactions` (riwayat transaksi pembayaran)
   * `transaction_items` (rincian item pesanan per transaksi)

### Langkah 3: Pengaturan Verifikasi Email (Opsional tapi Disarankan)
Secara bawaan Supabase mewajibkan user baru mengonfirmasi email sebelum bisa login. Agar registrasi bisa **langsung login tanpa konfirmasi email** (cocok untuk demo/tugas):
1. Buka menu **Authentication** ➡️ **Providers**.
2. Klik pada baris **Email**.
3. Matikan / Uncheck opsi **Confirm email**.
4. Klik **Save**.

### Langkah 4: Ambil Kredensial API Supabase
1. Masuk ke **Project Settings** (ikon gear di bawah) ➡️ pilih **API**.
2. Salin nilai berikut:
   * **Project URL** (contoh: `https://abcdefghijklmn.supabase.co`)
   * **anon / public key** (kode token panjang yang diawali `eyJhbGci...`)

---

## 3. Menjalankan di Komputer Lokal (Local Development)

### Langkah 1: Masuk ke Direktori Proyek
Buka terminal dan arahkan ke folder aplikasi `KantinOnline`:
```bash
cd projek_rekayasa_perangkat_lunak/KantinOnline
```

### Langkah 2: Buat File Konfigurasi Environment (`.env`)
Buat file baru bernama `.env` (atau `.env.local`) di dalam folder `KantinOnline/`, lalu isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Langkah 3: Install Dependensi
Jalankan perintah berikut untuk mengunduh seluruh library yang dibutuhkan:
```bash
npm install
```

### Langkah 4: Jalankan Server Development
```bash
npm run dev
```
Setelah server aktif, buka browser Anda di:
👉 **`http://localhost:5173`**

### Perintah Bermanfaat Lainnya:
* `npm run build` : Membangun berkas produksi ke folder `dist/`.
* `npm run preview` : Menjalankan preview lokal dari hasil build `dist/`.
* `npm run typecheck` : Memeriksa validasi tipe data TypeScript (`tsc --noEmit`).

---

## 4. Panduan Deploy ke Cloud

### A. Deploy ke Vercel (Paling Direkomendasikan ⭐)
1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun **GitHub**.
2. Klik tombol **Add New...** ➡️ **Project**.
3. Pilih repository proyek Anda (`projek_rekayasa_perangkat_lunak`) ➡️ klik **Import**.
4. Pada form konfigurasi:
   * **Framework Preset**: Pilih `Vite`.
   * **Root Directory**: Klik *Edit*, pilih folder **`KantinOnline`**.
   * **Build Command**: `vite build` (default).
   * **Output Directory**: `dist` (default).
5. Pada bagian **Environment Variables**, tambahkan 2 variabel:
   * `VITE_SUPABASE_URL` = *(URL project Supabase Anda)*
   * `VITE_SUPABASE_ANON_KEY` = *(Anon key Supabase Anda)*
6. Klik **Deploy**. Website Anda akan aktif dalam ~1 menit dan otomatis update setiap ada `git push`.

---

### B. Deploy ke Render (Static Site)
1. Buka [dashboard.render.com](https://dashboard.render.com).
2. Klik tombol **`+ New`** (kanan atas) ➡️ pilih **`Static Site`** (100% Gratis, jangan pilih *Web Service*).
3. Hubungkan repository GitHub Anda.
4. Isi konfigurasi:
   * **Name**: `kantinonline`
   * **Branch**: `main`
   * **Root Directory**: `KantinOnline`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
5. Tambahkan **Environment Variables**:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
6. Klik **Create Static Site**.

---

## 5. Fitur Utama Aplikasi

1. **Autentikasi Terintegrasi Supabase:**
   * Registrasi akun baru (Nama Lengkap, Email, Password).
   * Data akun tersimpan aman di Supabase Auth & tabel `public.users`.
   * Sesi login tersinkronisasi secara otomatis.

2. **Multi-Vendor Kantin Kampus:**
   * Pengguna dapat memilih stand kantin, mencari menu makanan/minuman favorit, dan memasukkan berbagai menu ke dalam satu keranjang belanja.

3. **Checkout & Pembayaran QRIS Terpadu:**
   * **Pemesanan Multi-Stand Sekaligus**: Menu dari beberapa stand yang berbeda dapat dibayar dalam **1 kali transaksi**.
   * **QRIS Standar Indonesia**: Menampilkan QR Code dinamis dengan nominal pas dan instruksi bayar untuk seluruh aplikasi bank (BCA, Mandiri, BRI, dll.) dan e-wallet (GoPay, OVO, Dana, ShopeePay).
   * Makanan otomatis diproses ke masing-masing stand setelah pembayaran lunas.

4. **Pencatatan Riwayat Pembayaran:**
   * Rincian transaksi dan status pesanan langsung dicatat ke tabel `transactions` di database Supabase dan dapat dilihat kapan saja melalui menu **Riwayat**.

---

## 6. Troubleshooting Umum

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| **Pesan error: *Konfigurasi Supabase belum tersedia*** | File `.env` belum dibuat atau variabel di Vercel/Render belum diisi. | Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` telah diatur dengan benar dan aplikasi di-restart. |
| **Setelah register tidak bisa langsung login** | Konfirmasi email masih aktif di Supabase. | Masuk ke Supabase Dashboard ➡️ Authentication ➡️ Providers ➡️ Email ➡️ Uncheck *Confirm email* ➡️ Save. |
| **Halaman blank / 404 saat deploy** | Root directory salah pilih saat deploy. | Pastikan Root Directory diset ke `KantinOnline` (bukan folder induk repo). |
| **Error saat `npm install`** | Konflik dependensi cache lokal. | Hapus folder `node_modules` dan `package-lock.json`, lalu jalankan kembali `npm install`. |

---
*Dibuat untuk kelancaran pengembangan dan penilaian tugas Rekayasa Perangkat Lunak.*
