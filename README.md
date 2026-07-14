# 🍱 Kantin Cermat Dubes

Aplikasi sistem kantin digital terpadu untuk **SMKN 12 Jakarta (Dubes)**. Aplikasi ini bertujuan untuk mempermudah siswa dan guru dalam melakukan pemesanan makanan, memantau menu kantin, serta membantu penjual kantin mengelola pesanan dengan lebih efisien dan cermat.

Sistem ini dibangun dengan arsitektur yang memisahkan antara Backend (API), Frontend (Web), dan Mobile (Android).

## ✨ Fitur Utama

*   **Pemesanan Digital:** Siswa dan guru dapat memesan makanan/minuman langsung dari aplikasi tanpa harus antre panjang.
*   **Menu Real-Time:** Menampilkan ketersediaan menu dari berbagai stan/penjual di kantin sekolah secara *real-time*.
*   **Sistem Role-based:**
    *   🧑‍🎓 **Pembeli (Mobile/Web):** Melihat menu, membuat pesanan, dan melihat status pesanan.
    *   🧑‍🍳 **Penjual (Web):** Menerima pesanan, mengupdate status pesanan (diproses/selesai), dan mengelola menu.
*   **Riwayat Transaksi:** Mencatat seluruh transaksi pemesanan untuk memudahkan pemantauan pengeluaran.

## 🚀 Teknologi yang Digunakan

Proyek ini menggunakan stack teknologi berikut:
*   **Backend (API):** [NestJS](https://nestjs.com/) (TypeScript)
*   **Frontend (Web):** [React.js](https://react.dev/) dengan [Vite](https://vitejs.dev/)
*   **Mobile (Android):** [Kotlin](https://kotlinlang.org/) (Native Android)

## 📁 Struktur Direktori

Jika proyek ini berada dalam satu repositori (monorepo), strukturnya kurang lebih sebagai berikut:

```text
├── backend/             # Source code backend API (NestJS)
│   ├── src/
│   └── package.json
├── frontend/            # Source code aplikasi web (React + Vite)
│   ├── src/
│   └── package.json
└── android/             # Source code aplikasi mobile (Kotlin)
    ├── app/
    └── build.gradle
```

## 🛠️ Persyaratan Sistem

*   **Backend & Frontend:** Node.js (LTS version), NPM / Yarn.
*   **Android:** Android Studio (versi terbaru), JDK 17 atau lebih baru, dan Android Emulator / Device fisik.
*   Git

## 📦 Instalasi & Menjalankan Aplikasi

1. **Clone repositori:**
   ```bash
   git clone https://github.com/Hiraetha/Kantin-Cermat-Dubes.git
   cd Kantin-Cermat-Dubes
   ```

### Menjalankan Backend (NestJS)
Buka terminal baru dan masuk ke folder backend:
```bash
cd backend
npm install
# Atur environment variables (database, JWT, dll) di file .env
npm run start:dev
```
*API akan berjalan di `http://localhost:3000` (atau port yang disesuaikan).*

### Menjalankan Frontend Web (React + Vite)
Buka terminal baru dan masuk ke folder frontend:
```bash
cd frontend
npm install
# Atur variabel lingkungan untuk URL API di .env (misal: VITE_API_URL=http://localhost:3000)
npm run dev
```
*Aplikasi web dapat diakses melalui browser pada URL yang disediakan oleh Vite (biasanya `http://localhost:5173`).*

### Menjalankan Mobile App (Android / Kotlin)
1. Buka aplikasi **Android Studio**.
2. Pilih **Open** dan arahkan ke folder `android/` di dalam proyek ini.
3. Tunggu hingga proses **Gradle Sync** selesai.
4. Sesuaikan endpoint API (Base URL) di dalam kode Kotlin (biasanya di file konfigurasi Retrofit/Networking) agar mengarah ke server backend Anda.
5. Klik tombol **Run (Shift + F10)** untuk menjalankan aplikasi di Emulator atau HP fisik yang terhubung.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan internal SMKN 12 Jakarta dan menggunakan lisensi [MIT](LICENSE).
