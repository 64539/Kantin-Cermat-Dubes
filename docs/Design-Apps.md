Berikut adalah dokumen **Product Requirement Document (PRD) untuk UI/UX** aplikasi **Kantin Cermat Dubes (Siswa App)**. Dokumen ini disesuaikan berdasarkan referensi struktur yang Anda berikan, dengan mengubah warna utama menjadi **Biru (`#2563EB`)** dan mendetailkan seluruh alur fitur serta komponen visualnya.

---

# Product Requirement Document (PRD) - UI/UX Specification

**Nama Projek:** Kantin Cermat Dubes (Siswa App)

**Platform:** Android (Jetpack Compose)

**Aktor Utama:** Siswa

**Warna Utama:** Blue Theme

---

## 1. System Branding & Visual Tokens

Seluruh komponen UI wajib mematuhi panduan token warna dan tipografi di bawah ini untuk menjaga konsistensi di seluruh halaman aplikasi.

### 1.1 Panduan Warna (Color Palette)

Aplikasi ini menggunakan tema dasar biru (*Professional & Trustworthy*) yang dikombinasikan dengan warna netral gelap untuk keterbacaan teks yang tinggi.

```kotlin
val PrimaryBlue      = Color(0xFF2563EB) // Warna Utama: CTA, Button Aktif, Highlight, Header
val SecondarySlate   = Color(0xFF0F172A) // Warna Teks Utama, Judul Halaman, Icon Aktif
val SuccessGreen     = Color(0xFF22C55E) // Status: Selesai (Completed), Sudah Dibayar (Paid)
val WarningAmber     = Color(0xFFF59E0B) // Status: Menunggu (Pending), Diproses (Processing)
val DangerRed        = Color(0xFFEF4444) // Status: Dibatalkan (Cancelled), Tombol Error/Hapus
val BackgroundLight  = Color(0xFFF8FAFC) // Background dasar Canvas/Screen
val SurfaceWhite     = Color(0xFFFFFFFF) // Background Card, Input Text, Bottom Sheet
val MutedText Gray   = Color(0xFF64748B) // Teks Sekunder, Sub-judul, Placeholder

```

### 1.2 Tipografi (Typography)

* **Font Family:** Inter / Roboto (Default Android standard font).
* **Heading 1 (`<h1>`):** 24sp, SemiBold, `SecondarySlate` (Digunakan untuk judul utama halaman seperti di Home & Profile).
* **Heading 2 (`<h2>`):** 18sp, Medium, `SecondarySlate` (Digunakan untuk judul section, nama menu di detail).
* **Body Text:** 14sp, Regular, `SecondarySlate` atau `MutedText Gray` (Untuk deskripsi menu dan detail harga).
* **Button Text:** 16sp, Bold, `SurfaceWhite` (Untuk teks di dalam tombol utama).

---

## 2. Struktur Navigasi & Arsitektur Informasi

Aplikasi menggunakan struktur **Bottom Navigation** sebagai navigasi utama setelah pengguna berhasil masuk (Login).

```text
Splash Screen ──> Login Screen ──> Main Container (Bottom Navigation)
                                       ├── Halaman Home
                                       │     └── (Membuka Halaman Detail Menu)
                                       ├── Halaman Keranjang (Cart)
                                       ├── Halaman Riwayat Pesanan (Order History)
                                       └── Halaman Profil (Profile)

```

---

## 3. Spesifikasi Fitur & Panduan Antarmuka (UI/UX)

### 3.1 Fitur Autentikasi (Auth Feature)

#### A. Splash Screen (`Splash`)

* **UX Requirement:** Menampilkan logo "Kantin Cermat" di tengah layar dengan latar belakang `BackgroundLight`. Sistem melakukan cek token JWT di DataStore secara *asynchronous*. Jika token valid, langsung arahkan ke `MainContainer`. Jika kosong/kadaluarsa, arahkan ke `Login`.
* **UI Element:** Animasi *loading* tipis menggunakan `PrimaryBlue` di bagian bawah logo.

#### B. Halaman Login (`Login`)

* **UX Requirement:** Form input minimalis. Input Email sekolah (`siswa@school.sch.id`) dan Password. Tombol login akan berubah menjadi state *Loading* (disabled dengan opacity 60%) ketika API sedang dipanggil.
* **UI Element:**
* Text Field: Menggunakan border `PrimaryBlue` saat berstatus *focused*, dan `MutedText Gray` saat *unfocused*.
* Button: Tombol penuh warna `PrimaryBlue` dengan teks `SurfaceWhite`.
* Error Message: Jika login gagal, muncul *inline alert* berwarna `DangerRed` di bawah text field password.



---

### 3.2 Fitur Penjelajahan Menu (Home & Detail Feature)

#### A. Halaman Beranda (`Home`)

* **UX Requirement:** Memungkinkan siswa mencari makanan dengan cepat sebelum jam istirahat.
* **UI Element:**
* **Header Section:** Menampilkan teks penyapa "Halo, [Nama Siswa]" dan ikon ringkasan saldo/poin (jika ada).
* **Search Bar:** Input pencarian statis di bagian atas. Dilengkapi tombol filter kategori menu (Makanan, Minuman, Cemilan) berbentuk *capsule/chips tab*. Kategori yang dipilih akan berwarna background `PrimaryBlue` dengan teks putih.
* **Menu Grid/List:** Menampilkan kartu-kartu makanan (`SurfaceWhite` card dengan elevasi rendah/shadow halus). Kartu berisi gambar makanan (di-load via Coil), nama menu, harga, dan indikator sisa stok.



#### B. Halaman Detail Menu (`MenuDetail`)

* **UX Requirement:** Diakses ketika siswa menekan salah satu menu di halaman Home. Menampilkan informasi detail dari makanan yang dipilih.
* **UI Element:**
* **Hero Image:** Gambar makanan beresolusi tinggi di 1/3 atas layar.
* **Informasi Menu:** Judul makanan menggunakan teks tebal berukuran `18sp`, deskripsi komposisi makanan, informasi alergen (opsional), serta sisa stok yang tertera jelas.
* **Bottom Action Bar:** Sticky bar di bagian bawah yang berisi *Quantity Counter* (tombol `-` dan `+`) serta tombol besar bertuliskan **"Tambah ke Keranjang"**.
* *Business Rules UI:* Jika `stock == 0` atau status ketersediaan menu bernilai `false`, tombol "Tambah ke Keranjang" secara otomatis berubah warna menjadi abu-abu (*disabled state*) dan teks berubah menjadi "Stok Habis".



---

### 3.3 Fitur Manajemen Pemesanan (Cart & Order History)

#### A. Halaman Keranjang (`Cart`)

* **UX Requirement:** Tempat siswa meninjau barang yang ingin mereka pesan, mengubah jumlah kuantitas, atau membatalkan item sebelum melakukan *checkout* (Pre-order).
* **UI Element:**
* **List Item:** Setiap item ditampilkan dalam bentuk baris horizontal. Terdapat tombol hapus cepat berbentuk ikon tempat sampah berwarna `DangerRed` di ujung kanan.
* **Validation Warning:** Jika siswa menambahkan kuantitas melebihi batas stok terbaru melalui counter di keranjang, batas counter otomatis terkunci di jumlah maksimal stok dan muncul *Toast notification* atau teks peringatan merah kecil: *"Jumlah melebihi stok yang tersedia"*.
* **Summary Summary & Checkout:** Panel di bagian paling bawah yang menampilkan total harga secara *real-time*. Tombol **"Pesan Sekarang (Pre-Order)"** menggunakan warna solid `PrimaryBlue`.



#### B. Halaman Riwayat Pesanan (`OrderHistory`)

* **UX Requirement:** Menampilkan daftar pesanan masa lalu dan pesanan aktif yang sedang diproses oleh pihak kantin. Halaman ini wajib mendukung *Gesture Pull-to-Refresh* untuk memperbarui status makanan.
* **UI Element:**
* **PullRefreshIndicator:** Memakai komponen bawaan Compose dengan lingkaran warna `PrimaryBlue`.
* **Order Card:** Setiap kartu transaksi memuat nomor order (contoh: `ORD-20260710-0045`), waktu pemesanan, total item, dan label status di pojok kanan atas kartu.
* **Desain Badge Status (Warna Mengikuti Aturan Bisnis):**
* Status `PENDING` & `PROCESSING`: Badge dengan latar kuning transparan, teks `WarningAmber`.
* Status `READY` & `COMPLETED`: Badge dengan latar hijau transparan, teks `SuccessGreen`.
* Status `CANCELLED`: Badge dengan latar merah transparan, teks `DangerRed`.





---

### 3.4 Fitur Profil & Manajemen Sesi (Profile Feature)

#### Halaman Profil (`Profile`)

* **UX Requirement:** Menampilkan informasi biodata ringkas siswa (Nama, Email, NIS/ID Siswa, dan Role). Terdapat opsi keluar dari aplikasi (*Logout*).
* **UI Element:**
* **Avatar:** Gambar profil default berupa inisial nama siswa dengan latar belakang lingkaran `PrimaryBlue`.
* **Tombol Logout:** Menggunakan outline button atau solid button berwarna `DangerRed` untuk memberikan impresi tindakan krusial.



---

## 4. Aturan Global Pengalaman Pengguna (UX Global Rules)

1. **Sistem State Menggunakan `UiState`:**
* **Loading State:** Setiap kali melakukan fetch API (`GET /api/menus`, `POST /api/orders`), tampilkan *Shimmer Effect* berbentuk kotak abu-abu pudar yang berkedip secara halus pada struktur kartu menu (bukan *Circular Progress Bar* penuh di tengah layar) agar kerangka layout tetap terjaga (*Layout Stability*).
* **Error State:** Jika koneksi internet terputus atau server error, tampilkan ilustrasi *Error state* bersih dengan tombol **"Coba Lagi"** beraksen `PrimaryBlue`.


2. **Mekanisme Auto Logout (401 Unauthorized Interceptor):**
* Ketika pengguna sedang membuka aplikasi dan server mendeteksi token habis (mengembalikan status `401`), aplikasi akan memunculkan transisi *fade-out* singkat, menghapus JWT dari `DataStore`, lalu mengarahkan navigasi secara aman menggunakan *Type-Safe Navigation* menuju layar `Login`. Seluruh tumpukan halaman (*backstack*) sebelumnya dibersihkan (`popUpTo(0)`) agar siswa tidak bisa menekan tombol *back* kembali ke halaman utama kantin.