---
tipe: RFC
status: diusulkan
tanggal: 2026-08-04
pengusul: HR
tags: [gameplay, fitur-baru, belum-diimplementasi]
---

# RFC-103 — Mode tim: satu sesi, beberapa orang

> **Status: BELUM ADA DI KODE.** `GameplayMode` masih tiga nilai —
> `priority`, `full`, `skip`. Tidak ada mode tim di mana pun di repo.

## Permintaan

HR ingin memakai aplikasi ini di sesi tatap muka: satu tim delapan sampai dua belas
orang di satu ruangan, layar diproyeksikan, dan setiap orang menyusun prioritasnya di
HP masing-masing. Hasil agregat tim muncul langsung di layar di depan.

Tujuannya bukan mengumpulkan data — data sudah didapat dari survei biasa. Tujuannya
memicu percakapan: memperlihatkan ke sebuah tim bahwa mereka ternyata tidak sepakat
tentang benefit mana yang paling penting.

## Usulan kasar

Tambahkan nilai keempat `team` ke `GameplayMode` di `src/types/survey.ts`, dan validasi
padanannya di `src/config/survey.config.ts`. Beri sesi sebuah kode ruangan; hasil
disatukan per kode itu, bukan per responden.

## Kenapa ini lebih mahal daripada kelihatannya

[[hdr-004-gameplay-mode-tiga-mode]] mencatat bahwa menambah mode berarti menyentuh
validasi konfigurasi **dan** setiap komponen yang bercabang atas mode. Tapi mode tim
melanggar lebih dari itu — ia melanggar tiga asumsi dasar aplikasi ini:

1. **Asumsi satu responden per sesi.** `useSurveyState` memegang state satu orang.
   Hasil agregat butuh state milik banyak orang sekaligus.
2. **Asumsi tanpa realtime.** Layar di depan harus diperbarui saat orang menyelesaikan
   susunannya. Apps Script ([[hdr-001-submit-via-apps-script]]) hanya bisa ditulisi,
   tidak bisa didengarkan. Mode ini praktis mensyaratkan
   [[rfc-102-pindah-ke-supabase]] lebih dulu.
3. **Asumsi urutan acak per orang.** [[hdr-003-randomize-benefits]] mengacak urutan tiap
   sesi supaya bias posisi tersebar. Di ruangan dengan sepuluh orang, pengacakan itu
   justru membuat hasil agregat sulit dibaca bersama-sama di layar — orang melihat
   posisi yang berbeda dari yang ditunjuk fasilitator.

## Pertanyaan terbuka

- Apakah mode tim sebaiknya jadi aplikasi terpisah saja? Ia berbagi tampilan benefit,
  tapi hampir tidak berbagi apa pun yang lain.
- Kalau urutan diacak per orang, apa yang ditampilkan di layar depan?
- Siapa yang memiliki kode ruangan, dan berapa lama ia hidup?
