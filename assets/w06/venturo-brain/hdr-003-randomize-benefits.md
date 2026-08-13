---
tipe: HDR
status: berlaku
tanggal: 2026-03-18
pengambil-keputusan: tim survey + HR
tags: [metodologi, bias, gameplay]
---

# HDR-003 — Acak urutan benefit (`randomizeBenefits: true`)

## Konteks

Survei tahun sebelumnya memakai urutan benefit yang tetap. Saat hasilnya dibaca, tiga
benefit teratas di daftar juga menempati tiga posisi teratas hasil. Kami tidak bisa
membedakan mana yang benar-benar diinginkan orang dan mana yang sekadar muncul duluan.

Ini bias urutan yang klasik, dan ia membuat data setahun praktis tidak bisa dipakai
untuk mengambil keputusan anggaran.

## Keputusan

`randomizeBenefits: true` di `src/config/survey.config.ts`. Urutan benefit diacak sekali
per sesi responden di `useSurveyState`, lewat `preparedBenefits`, lalu urutan hasil acak
itu dipakai konsisten sepanjang sesi tersebut.

## Alasan

Pengacakan per responden membuat posisi tampil jadi derau yang tersebar merata, bukan
bias yang terakumulasi ke arah yang sama. Dengan 300 responden, efek posisi saling
meniadakan dan yang tersisa adalah preferensi sebenarnya.

Kami sengaja mengacak **sekali per sesi**, bukan tiap render. Kalau kartu berpindah
posisi di tengah pengisian, responden kehilangan orientasi dan mulai salah pilih.

## Opsi yang ditolak

- **Urutan tetap, lalu koreksi statistik saat analisis.** Ditolak: HR yang membaca
  hasilnya di spreadsheet, dan mereka tidak akan menjalankan koreksi apa pun.
  Perbaikan harus terjadi di titik pengumpulan data.
- **Urutan tetap tapi dibalik untuk separuh responden.** Ditolak: hanya memindahkan
  bias, tidak menghapusnya, dan menambah cabang logika di aplikasi.

## Konsekuensi yang kami terima

- **Draft jadi rumit.** Karena urutan acak dan disimpan di localStorage
  ([[hdr-002-localstorage-bukan-indexeddb]]), urutan itu harus ikut disimpan dan
  dipulihkan. Kalau tidak, responden yang refresh melihat kartu berpindah tempat.
  Ini sumber bug paling sering di aplikasi ini.
- **Sulit direproduksi saat debugging.** Dua orang yang membuka aplikasi melihat urutan
  berbeda, jadi laporan bug "kartu ketiga rusak" tidak berarti apa-apa tanpa tahu
  urutan sesi itu.
- Slot prioritas ([[hdr-005-priority-slots-sepuluh]]) harus tetap merujuk benefit
  berdasarkan identitasnya, bukan posisinya. `selectPriority` tidak boleh menyimpan
  indeks tampilan.
