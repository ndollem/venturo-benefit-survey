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
User tap rating tile ATAU tap slot prioritas
      ↓
Benefit berikutnya muncul (reveal animation halus)
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
Gameplay (Looping Card dengan Reveal Animation & Dynamic Gradients)
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
- Format teks: `10 / 20`.
- Bar animasi bergerak sesuai progress jawaban.

## Benefit Card
- Menampilkan ilustrasi (slicing 2x2 sprite sheet) dan judul benefit.
- Sudut rounded (`rounded-[24px]` / cardRadius).
- Memiliki efek shadow premium.
- Kata kunci tertentu pada judul (mis. bonus, laptop, workspace, training) dirender sebagai pill/badge kecil berwarna agar lebih mudah dipindai (scannable).

## Tombol Verdict (mengikuti `gameplayMode`)
Instrumen utama gameplay adalah slot prioritas. Tombol di bawah card beradaptasi mengikuti field `gameplayMode` (di-resolve dari env `VITE_GAMEPLAY_MODE`, default `priority`):

- **priority (DEFAULT)**: Slot prioritas menjadi instrumen utama. Di bawah card ditampilkan 2 tombol verdict cepat — tombol positif "Cakep Nih" (skor 4) dan "Skip Aja" (skor 1). Top picks disimpan lewat slot.
- **full**: Slot prioritas + grid rating penuh 1–5 (5 tombol, sentimen per-benefit terkaya). Tombol disusun sebagai grid 2 kolom, tombol ke-5 melebar memenuhi 2 kolom (`col-span-2`).
- **skip**: Slot prioritas + satu tombol "Skip Aja" (skor 1) saja (minimal).

Emoji diletakkan di atas teks label secara vertikal dengan touch target minimal 48px.

## Priority Slots Sidebar
Di bagian kanan screen terdapat panel vertical **PRIORITASMU** (lebar ~72px s.d. 84px):
- Terdiri dari 10 slot kotak (default, dapat dikonfigurasi via `VITE_PRIORITY_SLOTS_COUNT`) yang dinomori secara berurutan.
- Jika slot masih kosong, kotak memiliki bingkai putus-putus (*dashed border*).
- Jika slot sudah terisi, kotak menampilkan miniatur gambar sprite dari benefit bersangkutan dengan tag nomor prioritas di kanan bawah.
- Di bagian atas area gameplay (di bawah progress bar), terdapat catatan instruksi kecil (*helper note*) agar peserta mengetahui fungsi prioritas terbatas ini.
- Menekan salah satu slot akan memasukkan kartu benefit yang aktif saat itu ke dalam slot prioritas tersebut.
- Jika slot sudah terisi, menekan slot tersebut akan mereplace/mengganti benefit lama dengan benefit aktif saat itu. Benefit lama tetap mempertahankan rating bintang 5 di background.
- Setiap kali benefit berhasil dimasukkan ke dalam slot prioritas, efek spektakuler confetti (pecahan kertas pesta berwarna-warni) diluncurkan langsung dari titik koordinat slot yang diketuk pada Canvas.

---

# Reveal Animation

Setiap kali kartu benefit baru muncul:

- Kartu masuk dengan spring/ease-in halus (skala + slide tipis, tanpa bounce berlebihan).
- Ilustrasi menajam dari soft blur menjadi tajam (sharpen).
- Reveal diorkestrasi dengan stagger ringan: category tag → ilustrasi → judul → footer.
- Menghormati `prefers-reduced-motion`: fallback berupa crossfade sederhana tanpa gerak.

---

# Transition

Setelah user memberikan verdict (tap tombol atau tap slot prioritas):
1. Card lama mengecil dan fade-out.
2. Card benefit baru muncul dengan reveal animation di atas.

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