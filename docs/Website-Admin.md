# PRD WEBSITE ADMIN

# Kantin Cermat Dubes

## Sistem Administrasi Kantin Digital Sekolah

### Versi

1.0

### Platform

Web Application

### Teknologi

Frontend:

* React
* Vite
* Tailwind CSS
* TanStack Query
* Axios

Backend:

* NestJS
* Prisma ORM
* JWT Authentication

Database:

* MySQL 8

---

# 1. Tujuan Produk

Kantin Cermat Dubes adalah aplikasi web internal yang digunakan untuk mengelola seluruh operasional kantin sekolah secara digital.

Sistem ini dirancang untuk membantu admin dan kasir dalam mengelola menu, stok makanan, transaksi penjualan, pesanan siswa, serta laporan operasional kantin.

Sistem tidak memiliki landing page publik.

Pengguna yang mengakses website akan langsung diarahkan ke halaman Login.

Setelah berhasil login, pengguna akan masuk ke Dashboard sesuai role yang dimiliki.

---

# 2. Target Pengguna

## Admin Kantin

Bertanggung jawab terhadap pengelolaan seluruh sistem.

## Kasir Kantin

Bertanggung jawab terhadap transaksi dan pengelolaan pesanan.

---

# 3. Alur Sistem

Website
↓
Login
↓
Dashboard
↓
Menu Sistem

Alur Pengguna:

1. Pengguna membuka website Kantin Cermat Dubes.
2. Sistem menampilkan halaman Login.
3. Pengguna memasukkan email dan password.
4. Sistem melakukan autentikasi.
5. Jika berhasil, pengguna masuk ke Dashboard.
6. Pengguna mengakses fitur sesuai hak aksesnya.

---

# 4. Struktur Halaman

## Public Pages

### Login

Route:

/login

Fitur:

* Input Email
* Input Password
* Tombol Login
* Validasi Form
* Pesan Error Login

---

## Protected Pages

### Dashboard

/dashboard

### Menu

/dashboard/menu

### Kategori

/dashboard/categories

### Stok

/dashboard/stocks



### Pesanan

/dashboard/orders

### Pengguna

/dashboard/users

### Laporan

/dashboard/reports

### Pengaturan

/dashboard/settings

---

# Branding Sistem

Nama Sistem:

Kantin Cermat Dubes

Tagline:

"Cerdas Mengelola, Cepat Melayani"

Logo:

Logo Kantin Cermat Dubes akan ditampilkan pada:

* Halaman Login
* Sidebar Dashboard
* Header Sistem
* Laporan PDF

---

# Identitas Visual

Warna Utama:

Primary:
#2563EB

Secondary:
#0F172A

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Font:

Inter

---

# KPI Keberhasilan

Sistem dianggap berhasil apabila:

* Login berjalan dengan baik.
* Dashboard menampilkan data secara akurat.
* CRUD menu berjalan tanpa error.
* Stok otomatis berkurang setelah transaksi.
* Pesanan siswa dapat diproses.
* Laporan dapat dihasilkan dan diekspor.
* Sistem responsif pada desktop dan tablet.

---

# Visi Produk

Menjadi sistem kantin digital sekolah yang membantu pengelolaan operasional kantin secara efisien, transparan, dan modern.

# Misi Produk

* Mempermudah pengelolaan menu dan stok.
* Mengurangi antrean saat jam istirahat.
* Menyediakan data penjualan yang akurat.
* Mendukung digitalisasi lingkungan sekolah.
* Meningkatkan kualitas pelayanan kantin bagi siswa dan guru.
