---
tipe: HDR
status: berlaku
tanggal: 2026-03-04
pengambil-keputusan: tim survey
tags: [backend, submit, biaya]
---

# HDR-001 — Kirim jawaban survei lewat Google Apps Script, bukan API sendiri

## Konteks

Survei benefit ini dipakai sekali setahun, dua minggu, sekitar 300 responden internal.
Semua responden karyawan Venturo, semuanya login lewat jaringan kantor atau HP pribadi,
dan tidak ada data yang perlu diautentikasi per-user. Yang dibutuhkan cuma satu hal:
jawaban masuk ke spreadsheet yang bisa dibaca tim HR tanpa mereka harus belajar tool baru.

Waktu itu kami punya dua minggu sebelum periode survei dibuka.

## Keputusan

`submitEndpoint` di `src/config/survey.config.ts` menembak sebuah Web App Google Apps
Script yang menulis langsung ke Google Sheet milik HR. Tidak ada backend milik kami
sendiri, tidak ada database, tidak ada deployment kedua.

Nilainya bisa ditimpa lewat env `VITE_SUBMIT_ENDPOINT` supaya staging bisa menembak
sheet berbeda tanpa mengubah kode.

## Alasan

Tiga hal yang menentukan:

1. **HR sudah hidup di spreadsheet.** Kalau kami bikin API sendiri, kami tetap harus
   bikin exporter ke spreadsheet. Apps Script menghapus satu langkah itu sepenuhnya.
2. **Nol biaya operasional.** Tidak ada server yang harus dibayar dan dijaga di luar
   dua minggu masa pakai. Aplikasi ini menganggur 50 minggu setahun.
3. **Tidak ada data sensitif.** Jawabannya preferensi benefit, bukan data gaji atau
   identitas. Risiko kebocorannya rendah, jadi kontrol akses ketat tidak sepadan.

## Opsi yang ditolak

- **API sendiri di atas Express + Postgres.** Ditolak: menambah satu layanan yang harus
  dideploy, dimonitor, dan dibayar untuk beban 300 baris per tahun. Biaya perawatannya
  jauh melebihi nilainya.
- **Supabase.** Ditolak *pada saat itu* karena tim belum punya proyek Supabase yang
  berjalan, dan mengurus akun baru di tengah tenggat dua minggu bukan prioritas.
  Keputusan ini ditinjau ulang di [[rfc-102-pindah-ke-supabase]].
- **Formulir Google Form biasa.** Ditolak karena seluruh nilai jual aplikasi ini ada di
  gameplay-nya — [[hdr-003-randomize-benefits]] dan mekanik slot prioritas. Google Form
  tidak bisa memberi pengalaman itu.

## Konsekuensi yang kami terima

- Tidak ada validasi sisi server. Apa pun yang dikirim klien masuk ke sheet apa adanya.
- Tidak ada retry otomatis di sisi server. Kalau Apps Script sedang lambat atau kuota
  harian terlampaui, submit gagal dan klien harus mencoba lagi — inilah alasan
  `retrySubmit` ada di `src/hooks/useSurveyState.ts`.
- Endpoint-nya adalah URL panjang yang tertanam di bundle frontend. Siapa pun yang
  membuka devtools bisa melihatnya dan mengirim baris palsu. Kami menerima ini karena
  konsekuensi terburuknya adalah data survei internal yang kotor, bukan kebocoran.

Batas kapasitas inilah yang akhirnya memicu [[rfc-101-offline-queue]].
