Berikut adalah dokumen **Product Requirement Document (PRD)** yang komprehensif untuk aplikasi pemesanan makanan berdasarkan referensi UI pada gambar (App *Bite*), dengan mengadaptasi spesifikasi teknis dan aturan bisnis dari sistem **Kantin Cermat Dubes (Siswa App)**.

Warna utama telah diubah sepenuhnya menjadi skema **Biru (`#2563EB`)** sesuai dengan permintaan Anda.

---

# Product Requirement Document (PRD)

## Aplikasi Pemesanan Makanan: Kantin Cermat Dubes (Siswa App)

---

## 1. Ringkasan Produk & Tujuan

Dokumen ini mendefinisikan spesifikasi fungsional, arsitektur data, alur pengalaman pengguna (UX), dan elemen visual untuk aplikasi **Kantin Cermat Dubes**. Fokus utama aplikasi ini adalah mempermudah **Siswa** melakukan pemesanan makanan secara *pre-order* dan *real-time* dengan antarmuka yang modern, bersih, dan intuitif berbasis Jetpack Compose.

---

## 2. Branding & Desain Visual (UI Tokens)

Mengubah skema warna merah/oranye pada referensi gambar asli menjadi identitas baru berbasis **Warna Biru** yang profesional dan ramah pengguna.

### 2.1 Palet Warna

```kotlin
val PrimaryBlue      = Color(0xFF2563EB) // Warna Utama: Tombol CTA aktif, Header, Highlight Kategori
val SecondarySlate   = Color(0xFF0F172A) // Teks Utama, Judul Halaman, Ikon Aktif
val SuccessGreen     = Color(0xFF22C55E) // Status: READY / COMPLETED / PAID
val WarningAmber     = Color(0xFFF59E0B) // Status: PENDING / PROCESSING
val DangerRed        = Color(0xFFEF4444) // Status: CANCELLED, Tombol Hapus/Batal
val BackgroundLight  = Color(0xFFF8FAFC) // Warna Dasar Latar Belakang Aplikasi
val SurfaceWhite     = Color(0xFFFFFFFF) // Latar Belakang Card, Dialog, Form Input
val MutedGray        = Color(0xFF64748B) // Teks Sekunder, Placeholder, Batas Border

```

### 2.2 Elemen UI Global

* **Radius Sudut (Corner Radius):** Menggunakan *rounded corner* sebesar `16.dp` untuk komponen Card dan `12.dp` untuk tombol utama guna memberikan kesan modern dan lembut.
* **Elevasi & Bayangan:** Menggunakan bayangan tipis (*low elevation shadow*) pada elemen Card di atas `BackgroundLight` untuk memberikan efek kedalaman (*depth*).

---

## 3. Fitur Utama & Kebutuhan Antarmuka (UI/UX)

Berdasarkan layout referensi gambar, berikut adalah 9 layar utama yang ditransformasikan ke sistem Kantin Cermat:

### 3.1 Layar Awal & Autentikasi

#### 1. Splash Screen (`Splash`)

* **Fungsi:** Halaman penyambung saat aplikasi pertama kali dibuka.
* **Komponen UI:**
* Latar belakang solid menggunakan warna `PrimaryBlue`.
* Logo minimalis "Kantin Cermat" berwarna `SurfaceWhite` di tengah layar.


* **UX/Aturan Bisnis:** Aplikasi melakukan pengecekan JWT token pada DataStore secara asinkron. Jika token valid langsung masuk ke `MainContainer` (Home), jika tidak valid mengarah ke layar login.

#### 2. Form Registrasi / Pembuatan Akun

* **Fungsi:** Memungkinkan pengguna baru mendaftarkan diri.
* **Komponen UI:** Tampilan pop-up/dialog overlay di atas latar belakang blur. Input form terdiri dari Nama Lengkap, Nomor Telepon/NIS, dan Pilihan Password. Tombol utama **"Daftar"** berwarna `PrimaryBlue`.

#### 3. Layar Login (`Login`)

* **Fungsi:** Pintu masuk siswa ke dalam sistem aplikasi.
* **Komponen UI:**
* Form Input untuk Email Sekolah dan Password dengan border aktif `PrimaryBlue`.
* Tombol **"Masuk"** (`PrimaryBlue`).
* Opsi integrasi Single Sign-On (SSO) Google di bagian bawah.


* **UX/Aturan Bisnis:** Jika API mengembalikan error, teks validasi berwarna `DangerRed` akan muncul di bawah input. Tombol masuk otomatis masuk ke state *Loading* (disabled) saat proses autentikasi berlangsung.

---

### 3.2 Penjelajahan Menu & Pemesanan

#### 4. Beranda / Home (`Home`)

* **Fungsi:** Pusat penjelajahan makanan dan minuman yang tersedia di kantin.
* **Komponen UI:**
* **Banner Promosi:** Komponen geser (carousel) di bagian atas yang menampilkan info diskon harian menggunakan aksen warna biru dan putih.
* **Kategori Tab (Chips):** Filter cepat (Semua, Burger, Pizza, Minuman). Tab yang dipilih akan berwarna latar `PrimaryBlue` dengan teks putih.
* **Menu Grid (2 Kolom):** Card makanan menampilkan gambar (Coil), Nama Menu, Harga, sisa stok, serta ikon keranjang belanja cepat di sudut kanan bawah kartu.



#### 5. Detail Menu (`MenuDetail`)

* **Fungsi:** Menampilkan informasi rinci mengenai satu menu makanan yang dipilih.
* **Komponen UI:**
* Gambar produk berukuran besar di bagian atas dengan tombol *Back* transparan di kiri atas.
* Informasi nama makanan, harga besar, deskripsi komposisi bahan, serta pilihan *Add-ons* (misal: ekstra saus).
* **Sticky Bottom Bar:** Counter jumlah pesanan (`-` / `+`) dan tombol utama **"Tambah ke Keranjang"**.


* **Aturan Bisnis:** Tombol akan otomatis *disabled* (berubah abu-abu) jika `stock == 0` atau `status == false`.

#### 6. Keranjang Belanja (`Cart`)

* **Fungsi:** Tempat peninjauan item sebelum melakukan konfirmasi pembayaran.
* **Komponen UI:**
* Daftar item belanja dengan counter jumlah kuantitas untuk setiap item.
* Tombol hapus cepat (ikon silang/tempat sampah) berwarna `DangerRed`.
* Tombol besar **"Proses Pembayaran"** di bagian bawah yang menampilkan total harga ringkas.


* **Aturan Bisnis:** State kuantitas tidak boleh melebihi batas stok. Data keranjang wajib menetap menggunakan `MutableStateFlow` atau Room DB meskipun pengguna berpindah halaman.

---

### 3.3 Transaksi & Riwayat Pengguna

#### 7. Konfirmasi Pembayaran / Checkout

* **Fungsi:** Halaman finalisasi detail pesanan tempat siswa menentukan waktu ambil dan metode pembayaran.
* **Komponen UI:**
* Pilihan lokasi stan kantin dan metode pembayaran (e-wallet sekolah atau Bayar di Tempat/COD).
* Rincian ringkasan harga (Harga makanan, Pajak/Biaya admin jika ada, Total bayar).
* Tombol utama **"Bayar Sekarang"** menggunakan warna `PrimaryBlue`.



#### 8. Layar Favorit (`Wishlist`)

* **Fungsi:** Menyimpan daftar makanan kesukaan siswa untuk pemesanan cepat di kemudian hari.
* **Komponen UI:** Daftar list vertikal menu-menu yang ditandai ikon hati oleh siswa. Setiap baris memiliki tombol instan untuk langsung memasukkan barang ke keranjang.

#### 9. Halaman Profil & Riwayat Pesanan (`Profile` & `OrderHistory`)

* **Fungsi:** Mengelola akun siswa dan melihat status pesanan yang sedang berjalan.
* **Komponen UI:**
* Informasi nama lengkap (misal: "Ibnu Abi") dan email pengguna.
* Menu navigasi internal: Daftar Pesanan, Kupon & Bonus, Pengaturan Alamat/Kelas, dan Tombol **Logout** (`DangerRed`).
* **Badge Status Transaksi:**
* `PENDING` / `PROCESSING` -> Warna Teks `WarningAmber`.
* `READY` / `COMPLETED` -> Warna Teks `SuccessGreen`.
* `CANCELLED` -> Warna Teks `DangerRed`.




* **Aturan Bisnis:** Halaman riwayat wajib mendukung *Pull-to-Refresh* (`PullRefreshIndicator`) untuk memperbarui status pesanan dari dapur kantin secara real-time.

---

## 4. Spesifikasi Integrasi Sistem & Penanganan Error

### 4.1 Autentikasi Keamanan (JWT Interceptor)

Setiap permintaan data setelah login otomatis melampirkan token akses pada header:

```http
Authorization: Bearer <token>

```

Jika server mengembalikan respon **`401 Unauthorized`**, aplikasi secara otomatis akan:

1. Menghapus token JWT yang tersimpan di DataStore Preferences.
2. Menghapus seluruh riwayat navigasi (*clear backstack*).
3. Mengarahkan paksa pengguna kembali ke layar Login secara aman.

### 4.2 Manajemen State UI (`UiState`)

Setiap pemanggilan data dari API menggunakan *sealed class* `UiState` untuk menangani perubahan tampilan:

* **`Loading`**: Menampilkan efek *shimmering* (kotak samar berkedip) pada kerangka Card agar layout tetap kokoh dan stabil.
* **`Success`**: Menampilkan komponen data visual secara utuh.
* **`Error`**: Menampilkan pesan kesalahan yang komunikatif disertai tombol *Retry* berwarna `PrimaryBlue`.