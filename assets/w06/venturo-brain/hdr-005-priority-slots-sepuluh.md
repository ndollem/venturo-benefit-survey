---
tipe: HDR
status: berlaku
tanggal: 2026-06-09
pengambil-keputusan: tim survey + HR
tags: [gameplay, ux, konfigurasi]
---

# HDR-005 — Sepuluh slot prioritas, bisa ditimpa lewat env

## Konteks

Tahap prioritas meminta responden menyusun benefit yang paling mereka inginkan ke dalam
sejumlah slot berurutan. Pertanyaannya: berapa slot?

HR awalnya minta lima. Uji coba internal menunjukkan lima terlalu sedikit — responden
merasa dipaksa membuang benefit yang sebenarnya mereka pedulikan, dan beberapa berhenti
di tahap itu. Dua puluh terlalu banyak; setelah slot kedelapan orang mulai mengisi asal.

## Keputusan

`prioritySlotsCount` default **10**, dibaca dari `VITE_PRIORITY_SLOTS_COUNT` kalau ada
dan diurai dengan `parseInt`. Slot bisa ditugaskan ulang — responden boleh menjatuhkan
benefit ke slot yang sudah terisi dan menukarnya, bukan hanya mengisi dari atas.

Perilaku ini hidup di `selectPriority` dalam `src/hooks/useSurveyState.ts`.

## Alasan

- **Sepuluh adalah titik tengah yang teruji**, bukan angka yang dikarang. Di sepuluh,
  responden masih membaca pilihan sebelum menaruhnya.
- **Bisa ditugaskan ulang karena orang berubah pikiran.** Versi pertama hanya mengisi
  dari atas ke bawah, dan responden yang salah taruh di slot 2 harus mengulang semuanya.
  Perubahan ini yang memicu ledakan konfetti sebagai umpan balik saat slot penuh.
- **Bisa ditimpa lewat env** supaya HR bisa mencoba angka lain tahun depan tanpa
  menunggu rilis — pola yang sama dengan [[hdr-004-gameplay-mode-tiga-mode]].

## Opsi yang ditolak

- **Lima slot** (permintaan awal HR). Ditolak setelah uji coba menunjukkan responden
  berhenti di tahap ini.
- **Semua benefit diurutkan penuh.** Ditolak: dengan belasan benefit, mengurutkan
  semuanya memakan lebih lama daripada seluruh sisa survei.
- **Slot hanya bisa diisi berurutan.** Ditolak setelah keluhan uji coba.

## Konsekuensi yang kami terima

- Nilai env yang tidak masuk akal tidak divalidasi. `VITE_PRIORITY_SLOTS_COUNT=0` atau
  `=999` akan diterima apa adanya dan merusak tampilan. Kami menerima ini karena yang
  menyetel env hanyalah kami sendiri — tapi ini utang yang sadar kami ambil.
- Karena slot merujuk benefit lewat identitas dan urutan tampil diacak
  ([[hdr-003-randomize-benefits]]), memulihkan draft berarti memulihkan dua hal
  sekaligus: isi slot **dan** urutan tampil.
