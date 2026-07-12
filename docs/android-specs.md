# Android Application Specification

# Kantin Cermat Dubes (Siswa App)

## 1. Spesifikasi Teknologi & Library

Aplikasi Android ini dibangun khusus untuk aktor **Siswa** dengan fokus pada kemudahan pemesanan makanan (*pre-order*) secara real-time.

### Technology Stack

| Komponen | Teknologi |
|----------|------------|
| Bahasa Pemrograman | Kotlin |
| UI Framework | Jetpack Compose |
| Arsitektur | MVVM + Clean Architecture (Data, Domain, UI) |
| Asynchronous | Kotlin Coroutines & Flow |
| Networking | Retrofit 2 + OkHttp3 |
| Dependency Injection | Dagger Hilt |
| Navigation | Jetpack Compose Navigation |
| Local Storage | DataStore Preferences |
| Image Loading | Coil (Compose) |

---

# 2. Struktur Folder Proyek

Folder utama berada pada:

```
android/app/src/main/java/com/kantincermat/dubes/
```

Struktur proyek menggunakan pendekatan **Feature-Based Architecture**.

```text
com.kantincermat.dubes/
├── di/
│   └── Hilt Modules
│
├── data/
│   ├── remote/
│   │   ├── api/
│   │   ├── dto/
│   │   └── interceptor/
│   │
│   ├── local/
│   │   └── datastore/
│   │
│   └── repository/
│
├── domain/
│   ├── model/
│   ├── repository/
│   └── usecase/
│
└── ui/
    ├── theme/
    ├── components/
    └── features/
        ├── auth/
        ├── home/
        ├── detail/
        ├── cart/
        ├── order_history/
        └── profile/
```

---

# 3. Branding & Theme

Seluruh token warna mengikuti spesifikasi dari **WEBSITE_ADMIN.md**.

```kotlin
val PrimaryBlue      = Color(0xFF2563EB)
val SecondarySlate   = Color(0xFF0F172A)
val SuccessGreen     = Color(0xFF22C55E)
val WarningAmber     = Color(0xFFF59E0B)
val DangerRed        = Color(0xFFEF4444)
val BackgroundLight  = Color(0xFFF8FAFC)
val SurfaceWhite     = Color(0xFFFFFFFF)
```

### Fungsi Warna

| Warna | Penggunaan |
|--------|------------|
| PrimaryBlue | CTA, Button, Header |
| SecondarySlate | Judul & Teks Utama |
| SuccessGreen | Status Completed / Paid |
| WarningAmber | Status Pending / Processing |
| DangerRed | Status Cancelled |
| BackgroundLight | Background Halaman |
| SurfaceWhite | Card & Input |

---

# 4. Navigation & UI State

## 4.1 UI State

Seluruh request API menggunakan pola **UiState**.

```kotlin
sealed class UiState<out T> {
    object Idle : UiState<Nothing>()
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}
```

---

## 4.2 Type-Safe Navigation

Menggunakan Navigation Compose terbaru berbasis Kotlin Serialization.

```kotlin
@Serializable object Splash

@Serializable object Login

@Serializable object MainContainer

@Serializable object Home

@Serializable object Cart

@Serializable object OrderHistory

@Serializable object Profile

@Serializable
data class MenuDetail(
    val menuId: Int
)
```

---

# 5. REST API Integration

Semua request otomatis menambahkan JWT melalui OkHttp Interceptor.

```kotlin
Authorization: Bearer <token>
```

---

## 5.1 Authentication

### Login

**Endpoint**

```
POST /api/auth/login
```

### Request

```json
{
  "email": "siswa@school.sch.id",
  "password": "securepassword"
}
```

### Response

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 12,
    "name": "Ibnu Abi",
    "email": "siswa@school.sch.id",
    "role": "STUDENT"
  }
}
```

---

## 5.2 Menu API

### Ambil Semua Menu

```
GET /api/menus
```

Default Query

```
?status=true
```

---

### Search Menu

```
GET /api/menus?search={query}&categoryId={id}
```

### Response

```json
[
  {
    "id": 101,
    "name": "Nasi Goreng Kantin",
    "price": 12000,
    "stock": 15,
    "imageUrl": "https://cloudinary.com/assets/nasgor.png",
    "categoryId": 2
  }
]
```

---

## 5.3 Order API

### Membuat Pre Order

```
POST /api/orders
```

Request

```json
{
  "studentName": "Ibnu Abi",
  "items": [
    {
      "menuId": 101,
      "quantity": 2
    }
  ]
}
```

---

### Riwayat Pesanan

```
GET /api/orders
```

Backend otomatis memfilter berdasarkan identitas siswa yang terdapat pada JWT.

Response

```json
[
  {
    "id": 901,
    "orderNumber": "ORD-20260710-0045",
    "totalAmount": 24000,
    "status": "PROCESSING",
    "createdAt": "2026-07-10T20:00:00Z",
    "items": [
      {
        "id": 1,
        "menuId": 101,
        "quantity": 2,
        "priceAtPurchase": 12000
      }
    ]
  }
]
```

---

# 6. Business Rules

## Validasi Keranjang

- Quantity tidak boleh melebihi stok.
- Tombol **Tambah ke Keranjang** harus disabled apabila:
  - `stock == 0`
  - `status == false`

---

## State Keranjang

Keranjang disimpan menggunakan:

- `MutableStateFlow`
- atau Room Database

State harus tetap tersedia ketika pengguna berpindah halaman.

---

## Pull to Refresh

Halaman **OrderHistory** wajib mendukung Pull-to-Refresh menggunakan:

```
PullRefreshIndicator
```

Refresh akan memanggil ulang endpoint:

```
GET /api/orders
```

Status yang dapat berubah:

- PENDING
- PROCESSING
- READY
- COMPLETED

---

## Auto Logout

Apabila server mengembalikan:

```
401 Unauthorized
```

Maka aplikasi wajib:

1. Menghapus JWT dari DataStore.
2. Menghapus session pengguna.
3. Mengarahkan pengguna kembali ke halaman Login.

---

# 7. Catatan Implementasi

## Perubahan Penting

- Seluruh ID menggunakan tipe `Int` sesuai skema Prisma terbaru.
- `studentName` bersifat opsional pada request order.
- Navigation menggunakan **Type-Safe Navigation** (`@Serializable`) dan bukan String Route.
- JWT ditambahkan secara otomatis melalui OkHttp Interceptor.
- Seluruh screen menggunakan arsitektur **MVVM + Clean Architecture**.
- UI dibangun sepenuhnya menggunakan **Jetpack Compose**.
````
