# UI/UX Specification

> Benefit Priority Challenge

Version 1.0 (Final Architecture)

---

# Design Goal

UI dirancang agar pengguna merasa sedang bermain mini game, bukan mengisi survey.

Seluruh interaksi harus:

- sederhana
- cepat
- menyenangkan
- tidak membingungkan
- mobile-first (centered frame on desktop)

Target waktu penyelesaian:

**3–5 menit**

---

# Design Principles

## One Screen Gameplay

Seluruh gameplay berlangsung dalam satu layar terpusat.

Tidak ada perpindahan halaman (kecuali overlay step transitions).

Tidak ada scroll halaman.

---

## Tap Only

Semua interaksi dilakukan menggunakan tap.

Tidak ada drag, swipe, hover, atau double-click.

---

## One Decision

Setiap benefit hanya membutuhkan satu keputusan (tap rating).

```
Benefit muncul
      ↓
User tap salah satu rating tile
      ↓
Benefit berikutnya muncul (shuffle jika card pertama)
```

Tidak ada tombol Next atau Confirm.

---

## Visual First

Ilustrasi (BenefitSprite) menjadi fokus utama.

Teks di dalam card hanya judul pendek sebagai pendukung.

---

# Screen Flow

```
Splash Screen
      ↓
Input Nama
      ↓
Tutorial Singkat
      ↓
Gameplay (Looping Card dengan Shuffle & Dynamic Gradients)
      ↓
Pertanyaan Akhir (Stay & Leave Reason)
      ↓
Loading Submit
      ↓
Success (Thank You) ATAU Error (Retry)
```

---

# Splash Screen

Menggunakan gambar `/images/splash.webp` sebagai background full cover.

Karena bagian atas (30% area) merupakan negative area (area kosong), teks judul ditempatkan di atas secara terpusat untuk legibilitas maksimal.

Tombol "Mulai Survey" ditempatkan di area bawah.

---

# Input Nama

Formulir minimalis berisi input teks nama lengkap.

- Wajib diisi.
- Maksimum 50 karakter.
- Pesan validasi real-time ("Nama tidak boleh kosong") muncul di bawah input jika tombol Mulai ditekan dengan input kosong.

---

# Tutorial

Layar instruksi singkat berisi 3 poin utama:
1. Benefit akan muncul satu per satu disertai ilustrasi.
2. Pilih seberapa menarik benefit tersebut menurutmu.
3. Tidak ada jawaban benar/salah. Jawab dengan jujur.

Tutorial hanya muncul sekali pada pendaftaran pertama.

---

# Gameplay Screen Layout

Layout gameplay beradaptasi secara dinamis.

Di desktop (lebar layar >= 640px), aplikasi tampil di dalam card ponsel terpusat (`.app-container` lebar 440px, tinggi 840px, rounded corners, dark border). Di mobile, aplikasi tampil penuh layar.

## Dynamic Pastel Background
Background gameplay bukan warna putih polos, melainkan **dynamic pastel gradient** (8 pilihan warna pastel lembut, misalnya pink, blue, teal, purple, orange, dll.) yang berubah setiap kali pertanyaan berganti secara halus menggunakan CSS transition.

## Progress Bar
- Tampil di area atas.
- Format teks: `18 / 48`.
- Bar animasi bergerak sesuai progress jawaban.

## Benefit Card
- Menampilkan ilustrasi (slicing 2x2 sprite sheet) dan judul benefit.
- Sudut rounded (`rounded-[24px]` / cardRadius).
- Memiliki efek shadow premium.

## Rating Buttons (Tile Grid)
Guna mengoptimalkan layar mobile yang kecil, pilihan rating disusun sebagai **grid 2 kolom**:
- Tombol 1 & 2 di baris pertama.
- Tombol 3 & 4 di baris kedua.
- Tombol 5 (Nggak Perlu / rating terendah) di baris ketiga, melebar memenuhi 2 kolom (`col-span-2`).
- Emoji diletakkan di atas teks label secara vertikal dengan touch target minimal 48px.

---

# Shuffle Animation

Sebelum benefit pertama muncul (atau setiap benefit jika `firstOnly` dinonaktifkan):

- Ditampilkan animasi shuffle seperti mesin slot.
- Ilustrasi dan judul benefit berputar acak dengan kecepatan tinggi (misalnya 60ms sekali pergantian).
- Animasi secara bertahap melambat (deceleration curve) selama 2 detik sebelum mendarat dan berhenti di benefit sesungguhnya.
- Selama shuffle berlangsung, input rating dinonaktifkan untuk mencegah double-tap.

---

# Transition

Setelah user memilih rating:
1. Card lama mengecil dan fade-out (250ms).
2. Tampilkan card benefit baru dengan efek fade-in.
3. Jika card pertama, lakukan slot shuffle terlebih dahulu.

---

# Submit & Success Screens

## Submit Screen
- Menampilkan animasi spinner berputar.
- Teks: "Mengirim jawaban... Mohon tunggu sebentar."
- Input dinonaktifkan sepenuhnya.

## Success Screen
- Menampilkan centang hijau besar dan ucapan terima kasih.
- Pesan: "Jawaban kamu berhasil disimpan. Semoga benefit impianmu masuk daftar prioritas 😄"

## Error Screen
- Menampilkan tanda peringatan merah.
- Pesan kesalahan (misal: "Koneksi terputus. Pastikan internet Anda aktif").
- Tombol "Coba Lagi" (mengirim ulang payload yang sama tanpa mereset survey).

---

# Accessibility

- Ukuran font minimum 16px (18px default).
- Touch target rating tile minimal 48px.
- Kontras warna pastel background dijaga sangat lembut agar tidak mengalihkan perhatian dari teks judul utama.