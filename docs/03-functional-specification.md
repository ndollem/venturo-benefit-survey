# Functional Specification

> Benefit Priority Challenge

Version 1.0 (Final Architecture)

---

# Overview

Dokumen ini menjelaskan perilaku fungsional dari aplikasi **Benefit Priority Challenge**. Fokus utama dokumen ini adalah logika bisnis, state machine, format data, validasi, dan penanganan submit ke Google Spreadsheet.

---

# Survey Flow

Aplikasi ini menggunakan state flow linear tanpa percabangan:

```
Splash Step
    ↓ (User klik Mulai)
Name Input Step
    ↓ (User memasukkan nama valid & klik Mulai)
Tutorial Step (Hanya muncul jika belum pernah melihat)
    ↓ (User klik Siap)
Gameplay Step (Looping 48 benefits secara acak datar)
    ↓ (User memberikan rating pada benefit terakhir)
Final Questions Step (2 pertanyaan textarea opsional)
    ↓ (User klik Kirim)
Submitting Step (Loading overlay)
    ↓ (Mengirim POST payload ke Google Apps Script)
Completed Step (Terima Kasih) ATAU Error Step (Retry)
```

---

# Shuffling Logic (Datar)

Berbeda dengan skema pengelompokan kategori awal, seluruh data benefit **diacak secara datar** (flat randomized) di seluruh kategori untuk memastikan pertanyaan benar-benar muncul secara acak bebas (fully shuffled).

Logika pengacakan:
1. Membaca daftar seluruh benefit aktif dari configuration layer (`src/config/benefits.ts`).
2. Melakukan pengacakan pool menggunakan algoritma **Fisher-Yates Shuffle** pada saat survey diinisialisasi pertama kali.
3. Urutan acak ini disimpan dalam state survey dan digunakan secara konsisten hingga akhir permainan (tidak diacak ulang di setiap render).
4. Layar Category Intro ditiadakan agar transisi antar kartu berjalan dengan sangat cepat dan mulus.

---

# State Machine

Survey memiliki state yang dideklarasikan di tipe [SurveyState](file:///Users/kly/projects/venturo-benefit-survey/src/types/survey.ts):

- `splash`: Layar awal / landing page.
- `name`: Meminta input nama.
- `tutorial`: Petunjuk permainan (opsional per sesi browser).
- `gameplay`: Menampilkan benefit satu per satu untuk diberi rating.
- `final_questions`: Pertanyaan esai opsional di akhir survey.
- `submitting`: Mengirimkan payload JSON ke server.
- `completed`: Menampilkan pesan sukses "Terima Kasih".
- `error`: Menampilkan kesalahan pengiriman dengan tombol coba lagi.

---

# Validasi Data

## 1. Input Nama
- Wajib diisi.
- Maksimal 50 karakter.
- Spasi di awal/akhir nama dibersihkan (`trim()`).
- Jika kosong, sistem memblokir navigasi dan memicu banner error visual.

## 2. Benefit Rating
- Setiap benefit wajib mendapat satu rating (score 1-5).
- Input dinonaktifkan saat animasi shuffle berlangsung.
- Pengguna tidak dapat melompat/melewati benefit tanpa memberi rating.

## 3. Pertanyaan Akhir
- Bersifat opsional (boleh kosong).
- Spasi dibersihkan sebelum dikirim.

---

# Submission & CORS Fix

Proses pengiriman hasil survey dilakukan menggunakan HTTP POST request ke Google Apps Script Web App.

## Request Payload Format
```json
{
  "name": "Budi",
  "answers": {
    "financial.project_bonus": 5,
    "office.external_monitor": 4,
    "timeoff.annual_leave": 5,
    "health.medical": 3
  },
  "stayReason": "Bonus project yang adil...",
  "leaveReason": "Jika tidak ada medical check-up..."
}
```

## CORS Resolution
Karena browser memblokir request ke endpoint Google Apps Script akibat ketiadaan header CORS pada pengalihan server redirect (`302 redirect` ke googleusercontent), pengiriman data dikonfigurasi menggunakan:

- **Mode**: `no-cors`
- **Content-Type**: `text/plain;charset=utf-8`

Dengan mode `no-cors`, request POST dikirim secara aman, Google Apps Script berhasil mengeksekusi `doPost(e)` dan mencatat data ke Google Sheet, sementara frontend secara otomatis mengalihkan pengguna ke halaman `completed` setelah koneksi berhasil diselesaikan.

---

# Error Handling & Retry

Jika terjadi kegagalan jaringan (misal internet terputus saat submit):
- Aplikasi bertransisi ke state `error`.
- Menyimpan jawaban dan input nama peserta saat itu.
- Menampilkan pesan kegagalan dan tombol **Coba Lagi**.
- Aksi coba lagi akan mengirim ulang payload yang sama tanpa mereset data survey yang sudah diisi.