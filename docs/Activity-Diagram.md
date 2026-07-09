# ACTIVITY DIAGRAM

# Kantin Cermat Dubes

## Activity Diagram Login

Start
↓
Masukkan Email & Password
↓
Klik Login
↓
Validasi Akun
↓
Apakah Data Benar?

├── Tidak
│
↓
Tampilkan Error
↓
Kembali ke Login

└── Ya
↓
Masuk Dashboard
↓
End

---

## Activity Diagram Pemesanan Makanan Siswa

Start
↓
Login
↓
Melihat Daftar Menu
↓
Pilih Menu
↓
Tambah ke Keranjang
↓
Checkout
↓
Sistem Membuat Pesanan
↓
Status = Pending
↓
Pesanan Masuk ke Kasir
↓
End

---

## Activity Diagram Proses Pesanan Kasir

Start
↓
Login
↓
Buka Halaman Pesanan
↓
Lihat Pesanan Baru
↓
Ubah Status Menjadi Diproses
↓
Siapkan Pesanan
↓
Pesanan Siap Diambil
↓
Ubah Status Menjadi Siap Diambil
↓
Siswa Mengambil Pesanan
↓
Ubah Status Menjadi Selesai
↓
End

---

## Activity Diagram POS Kasir

Start
↓
Login
↓
Buka Halaman POS
↓
Pilih Produk
↓
Tambah ke Keranjang
↓
Hitung Total
↓
Pilih Metode Pembayaran
↓
Konfirmasi Pembayaran
↓
Transaksi Berhasil
↓
Kurangi Stok Otomatis
↓
Simpan Transaksi
↓
End

---

## Activity Diagram Kelola Menu Admin

Start
↓
Login
↓
Masuk Halaman Menu
↓
Klik Tambah Menu
↓
Isi Data Menu
↓
Simpan
↓
Validasi Data

Apakah Valid?

├── Tidak
│
↓
Tampilkan Error
│
└── Ya
↓
Simpan ke Database
↓
Tampilkan Notifikasi Berhasil
↓
End

---

## Activity Diagram Kelola Stok

Start
↓
Login
↓
Masuk Halaman Stok
↓
Pilih Menu
↓
Tambah/Kurangi Stok
↓
Simpan
↓
Update Stock History
↓
Update Jumlah Stok
↓
Tampilkan Berhasil
↓
End

---

## Activity Diagram Generate Laporan

Start
↓
Login
↓
Masuk Halaman Laporan
↓
Pilih Periode
↓
Sistem Mengambil Data
↓
Generate Laporan
↓
Tampilkan Grafik dan Ringkasan
↓
Export PDF / Excel
↓
End
