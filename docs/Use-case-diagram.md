# USE CASE DIAGRAM

# Kantin Cermat Dubes

## Aktor Sistem

### Admin

* Login
* Kelola Menu
* Kelola Kategori
* Kelola Stok
* Kelola Pengguna
* Melihat Dashboard
* Melihat Laporan
* Mengelola Pengaturan Sistem
* Logout

### Kasir

* Login
* Melihat Dashboard
* Mengelola Pesanan
* Melakukan Transaksi POS
* Mengubah Status Pesanan
* Logout

### Siswa

* Login
* Melihat Menu
* Mencari Menu
* Menambahkan Menu ke Keranjang
* Membuat Pesanan
* Melihat Status Pesanan
* Melihat Riwayat Pesanan
* Mengelola Profil
* Logout

---

## Diagram Use Case

```
                +------------------+
                |     Admin        |
                +------------------+
                       |
  ------------------------------------------------
  |      |      |      |      |      |      |     |
```

Login  Menu  Kategori Stok User Dashboard Laporan Setting
|
Logout

```
                +------------------+
                |      Kasir       |
                +------------------+
                       |
    ----------------------------------------
    |          |            |            |
  Login    Dashboard      POS      Kelola Pesanan
                                          |
                                   Update Status
                                          |
                                        Logout


                +------------------+
                |      Siswa       |
                +------------------+
                       |
  ------------------------------------------------
  |      |      |      |      |      |      |    |
Login  Menu Cari Keranjang Pesan Status Riwayat Profil
                                         |
                                       Logout
```

---

## Relasi Use Case

Siswa
→ Membuat Pesanan
→ Melihat Status Pesanan

Kasir
→ Mengelola Pesanan
→ Mengubah Status Pesanan

Admin
→ Mengelola Menu
→ Mengelola Stok
→ Melihat Laporan
