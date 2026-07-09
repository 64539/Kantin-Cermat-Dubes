# UI/UX PRD

# Kantin Cermat Dubes

## Sistem Administrasi Kantin Digital Sekolah

### Versi

1.0

### Platform

Web Application

### Framework UI

* React
* Tailwind CSS
* Shadcn UI
* Lucide React Icons

---

# 1. Tujuan Desain

Dashboard Kantin Cermat Dubes dirancang untuk:

* Mudah digunakan oleh semua kalangan.
* Dapat digunakan tanpa pelatihan yang rumit.
* Memiliki alur yang sederhana dan intuitif.
* Mengurangi jumlah klik dalam menyelesaikan pekerjaan.
* Menampilkan informasi penting secara cepat.
* Memberikan pengalaman penggunaan yang nyaman dan modern.
* Mempermudah admin dan kasir dalam mengelola operasional kantin.

---

# 2. Target Audiens

Sistem harus dapat digunakan oleh:

### Admin Kantin

Memiliki kemampuan teknologi yang beragam.

### Kasir

Fokus pada kecepatan transaksi.

### Guru

Dapat memahami sistem tanpa pelatihan teknis.

### Staf Sekolah

Dapat mengoperasikan fitur dasar dengan mudah.

### Pengguna Baru

Mampu memahami cara penggunaan sistem dalam waktu kurang dari 5 menit.

---

# 3. Design Principles

## User Friendly

Sistem harus mudah dipahami bahkan oleh pengguna yang belum terbiasa menggunakan aplikasi digital.

## Easy To Use

Setiap fitur dapat diakses dengan langkah sesingkat mungkin.

## Minimal Learning Curve

Pengguna baru dapat langsung memahami fungsi utama tanpa membaca panduan panjang.

## Consistency

Seluruh halaman menggunakan pola desain yang sama.

## Efficiency

Pekerjaan dapat diselesaikan dengan jumlah klik yang minimal.

## Accessibility

Teks, warna, dan komponen mudah dibaca oleh semua usia.

## Clarity

Informasi penting harus langsung terlihat tanpa harus mencari terlalu dalam.

---

# 4. UX Principles

### Maksimal 3 Klik

Pengguna dapat mencapai fitur utama dalam maksimal 3 klik.

### No Complex Flow

Tidak ada proses yang terlalu panjang atau membingungkan.

### Fast Navigation

Navigasi selalu terlihat dan mudah diakses.

### Important First

Informasi penting selalu ditampilkan di bagian atas halaman.

### Mobile Friendly

Tetap nyaman digunakan melalui tablet maupun perangkat mobile.

---

# 5. Branding

Nama Sistem:

Kantin Cermat Dubes

Tagline:

"Cerdas Mengelola, Cepat Melayani"

Karakter Brand:

* Modern
* Profesional
* Sederhana
* Ramah Pengguna
* Cepat
* Efisien

---

# 6. Design Style

Tema:

Modern Educational Dashboard

Inspirasi:

* Stripe Dashboard
* Linear
* Vercel
* Notion
* Shadcn Dashboard

Konsep:

Clean, Minimal, Professional

Tidak menggunakan dekorasi berlebihan.

Fokus pada keterbacaan dan efisiensi.

---

# 7. Color System

## Primary

Blue

HEX:
#2563EB

Digunakan untuk:

* Tombol utama
* Link
* Highlight

---

## Success

Green

HEX:
#22C55E

Digunakan untuk:

* Pembayaran berhasil
* Pesanan selesai
* Operasi sukses

---

## Warning

Orange

HEX:
#F59E0B

Digunakan untuk:

* Stok menipis
* Peringatan

---

## Danger

Red

HEX:
#EF4444

Digunakan untuk:

* Error
* Hapus data
* Pesanan dibatalkan

---

## Background

HEX:
#F8FAFC

---

## Surface

HEX:
#FFFFFF

---

## Text Primary

HEX:
#0F172A

---

## Text Secondary

HEX:
#64748B

---

# 8. Typography

Font Utama:

Inter

Fallback:

sans-serif

---

Heading

32px

Weight 700

---

Sub Heading

24px

Weight 600

---

Body

14px

Weight 400

---

Table Text

13px

Weight 400

---

# 9. Layout Structure

## Desktop

Sidebar
+
Header
+
Main Content

Layout harus sederhana dan familiar.

Pengguna tidak perlu belajar ulang cara menggunakan sistem.

---

# 10. Sidebar

Posisi:

Kiri

Lebar:

280px

Konten:

📊 Dashboard

🍔 Menu

📁 Kategori

📦 Stok

🛒 POS

📋 Pesanan

👤 Pengguna

📈 Laporan

⚙️ Pengaturan

🚪 Logout

---

Prinsip Sidebar:

* Selalu terlihat
* Mudah dikenali
* Menggunakan ikon dan teks
* Tidak menggunakan submenu yang berlapis-lapis

---

# 11. Header

Komponen:

* Judul Halaman
* Search Bar
* Notifikasi
* Profil Pengguna

Tinggi:

72px

Sticky Header:

Ya

---

# 12. Login Page

Tujuan:

Mempermudah pengguna masuk ke sistem tanpa kebingungan.

Layout:

Split Screen

Kiri:

* Logo Kantin Cermat Dubes
* Ilustrasi Kantin Digital

Kanan:

Form Login

---

Komponen:

* Email
* Password
* Tombol Login

Versi 1.0:

Tidak menggunakan registrasi publik.

Tidak menggunakan form yang kompleks.

---

# 13. Dashboard

Tujuan:

Menampilkan seluruh informasi penting dalam satu layar.

---

KPI Cards

* Total Penjualan Hari Ini
* Total Transaksi
* Total Pesanan Aktif
* Stok Menipis

---

Charts

Grafik Penjualan

Jenis:

Line Chart

---

Recent Orders

Menampilkan pesanan terbaru.

---

Top Selling Menu

Menampilkan menu paling laris.

---

# 14. Menu Management

Tujuan:

CRUD menu dengan proses sederhana.

---

Tombol:

Tambah Menu

---

Table:

* Foto
* Nama
* Kategori
* Harga
* Stok
* Status
* Aksi

---

Aksi:

Lihat

Edit

Hapus

---

# 15. Stock Management

Tujuan:

Mengelola stok dengan cepat.

---

Summary Cards:

* Total Produk
* Produk Habis
* Produk Menipis

---

Aksi Utama:

* Tambah Stok

- Kurangi Stok

---

# 16. POS Page

Tujuan:

Memungkinkan kasir melakukan transaksi dalam waktu kurang dari 30 detik.

---

Layout:

Kiri:

Daftar Produk

Kanan:

Keranjang

---

Checkout:

Satu tombol utama:

"Bayar"

---

# 17. Order Management

Table:

* Nomor Pesanan
* Nama Siswa
* Total
* Status
* Tanggal

---

Status Badge:

Pending = Orange

Diproses = Blue

Siap Diambil = Purple

Selesai = Green

Dibatalkan = Red

---

# 18. Reports

Filter:

* Harian
* Mingguan
* Bulanan
* Tahunan

---

Export:

* PDF
* Excel

---

Visualisasi:

* Grafik Penjualan
* Grafik Pendapatan
* Menu Terlaris

---

# 19. Component Library

Menggunakan Shadcn UI.

Komponen:

* Button
* Input
* Select
* Table
* Card
* Badge
* Dialog
* Sheet
* Dropdown Menu
* Pagination
* Toast
* Alert Dialog

---

# 20. Responsive Rules

Desktop

≥ 1280px

Sidebar tampil penuh.

---

Tablet

768px - 1279px

Sidebar dapat collapse.

---

Mobile

≤ 767px

Sidebar berubah menjadi drawer.

---

# 21. UX Goals

Target utama sistem:

* Mudah dipelajari oleh semua kalangan.
* Tidak membutuhkan pelatihan khusus.
* Maksimal 3 klik untuk mencapai fitur utama.
* Mengurangi kesalahan pengguna.
* Transaksi selesai kurang dari 30 detik.
* Pengguna baru memahami sistem dalam kurang dari 5 menit.
* Informasi penting terlihat tanpa scroll panjang.
* Alur sederhana dan tidak membingungkan.
* Fokus pada kecepatan dan kemudahan penggunaan.

# Motto UX

"Sederhana, Cepat, dan Mudah Digunakan oleh Semua Orang."
