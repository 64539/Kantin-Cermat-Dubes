# MASTER PRD

# Kartin Cermat Dubes

## Sistem Manajemen Kantin Sekolah Digital

### Versi

1.0

### Status

Draft

### Pemilik Produk

Tim Pengembang SmartCanteen

---

# 1. Ringkasan Produk

Kantin Cermat Dubes adalah sistem manajemen kantin sekolah berbasis digital yang membantu pengelola kantin dalam mengelola menu makanan, stok barang, transaksi penjualan, laporan keuangan, serta pemesanan makanan oleh siswa.

Sistem terdiri dari:

* Website Admin
* Backend API
* Aplikasi Android Siswa

Semua platform menggunakan database yang sama sehingga data dapat diperbarui secara real-time.

---

# 2. Latar Belakang

Sebagian besar kantin sekolah masih melakukan pencatatan stok dan transaksi secara manual. Hal ini menyebabkan:

* Kesalahan pencatatan transaksi
* Sulit memantau stok makanan
* Antrean panjang saat jam istirahat
* Tidak tersedianya laporan penjualan yang akurat

SmartCanteen dibuat untuk mengatasi masalah tersebut melalui digitalisasi proses operasional kantin.

---

# 3. Tujuan Produk

### Tujuan Bisnis

* Meningkatkan efisiensi operasional kantin.
* Mengurangi pemborosan makanan.
* Memudahkan pembuatan laporan penjualan.

### Tujuan Pengguna

* Memudahkan siswa memesan makanan.
* Mengurangi antrean saat istirahat.
* Memberikan informasi stok makanan secara real-time.

---

# 4. Target Pengguna

## Admin Kantin

Bertanggung jawab mengelola seluruh sistem.

## Kasir

Bertanggung jawab terhadap transaksi dan pesanan.

## Siswa

Menggunakan aplikasi Android untuk melihat menu dan memesan makanan.

---

# 5. Arsitektur Sistem

Frontend Website:

* React
* Vite
* Tailwind CSS

Backend:

* NestJS
* Prisma ORM
* JWT Authentication

Database:

* MySQL 8

Android:

* Kotlin
* Retrofit
* Jetpack Compose

Storage:

* Cloudinary

---

# 6. Modul Sistem

### Authentication

* Login
* Logout
* Role Management

### Menu Management

* Kelola menu
* Kelola kategori
* Kelola harga

### Stock Management

* Tambah stok
* Kurangi stok
* Riwayat stok

### POS System

* Transaksi penjualan
* Pembayaran

### Order Management

* Pre-order siswa
* Status pesanan

### Reporting

* Penjualan harian
* Penjualan bulanan
* Menu terlaris

---

# 7. User Roles

Admin

* Full Access

Kasir

* Transaksi
* Pesanan

Siswa

* Pemesanan
* Riwayat Pesanan

---

# 8. Kriteria Keberhasilan

* Sistem dapat digunakan oleh admin dan kasir.
* Siswa dapat melakukan pre-order.
* Stok berkurang otomatis setelah transaksi.
* Laporan penjualan tersedia.
* Sistem berjalan stabil tanpa error kritis.

---

# 9. Roadmap

Fase 1

* Authentication
* Dashboard
* Manajemen Menu

Fase 2

* Stok
* POS
* Pesanan

Fase 3

* Android App
* Notifikasi

Fase 4

* QRIS
* Analitik Penjualan
