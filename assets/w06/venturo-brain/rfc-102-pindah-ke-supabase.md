---
tipe: RFC
status: ditunda
tanggal: 2026-07-28
pengusul: tim survey
tags: [backend, migrasi, belum-diimplementasi]
menggantikan-jika-disetujui: hdr-001-submit-via-apps-script
---

# RFC-102 — Pindah dari Apps Script ke Supabase

> **Status: DITUNDA, BELUM ADA DI KODE.** Tidak ada klien Supabase, tidak ada skema
> tabel, tidak ada env Supabase di repo. `submitEndpoint` masih menembak Apps Script.

## Kenapa ini muncul lagi

Supabase ditolak di [[hdr-001-submit-via-apps-script]] karena alasan tenggat, bukan
alasan teknis. Sejak itu tiga hal berubah:

1. Tim sudah punya proyek Supabase yang berjalan untuk hal lain, jadi biaya
   pengadaannya sudah nol.
2. Apps Script punya kuota eksekusi harian. Di hari puncak gelombang pertama kami
   menyentuh sekitar tiga perempatnya. Kalau tahun depan respondennya dua kali lipat,
   kami menabrak plafon itu di hari pertama.
3. [[rfc-101-offline-queue]] butuh idempotency untuk mencegah kiriman ganda, dan
   Apps Script tidak menyediakan cara yang bersih untuk itu.

## Usulan

Ganti nilai `submitEndpoint` di `src/config/survey.config.ts` ke endpoint Supabase, dan
pertahankan bentuk payload persis sama supaya perubahan di sisi klien hanya menyentuh
satu nilai konfigurasi. Tulis ke tabel `survey_responses` dengan kolom yang mencerminkan
payload sekarang, dan pasang unique constraint sebagai dasar idempotency.

HR tetap membaca spreadsheet — sinkronisasi terjadwal dari tabel ke sheet, bukan HR yang
disuruh belajar dashboard baru. Kalau syarat ini dilanggar, migrasi ini gagal secara
organisasi meskipun berhasil secara teknis.

## Syarat yang harus dipenuhi lebih dulu

- Sinkronisasi ke Google Sheet berjalan otomatis dan sudah diuji satu periode penuh
- Kunci publik Supabase yang tertanam di bundle frontend hanya boleh punya izin sisipkan
  ke satu tabel, tidak boleh membaca apa pun — jangan mengulangi
  [[hdr-001-submit-via-apps-script]] di mana endpoint terbuka lebar
- Ada jalur mundur: env `VITE_SUBMIT_ENDPOINT` tetap bisa dikembalikan ke Apps Script
  di tengah periode survei tanpa deploy ulang

## Kenapa ditunda

Tidak ada yang mendesak sampai survei berikutnya. Memigrasikan backend di luar musim
survei berarti kami tidak akan tahu apakah ia benar-benar berfungsi sampai sebelas
bulan kemudian, saat tidak ada waktu memperbaikinya.

Tinjau ulang delapan minggu sebelum periode survei berikutnya dibuka.
