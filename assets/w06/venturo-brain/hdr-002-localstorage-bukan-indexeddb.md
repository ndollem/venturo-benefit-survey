---
tipe: HDR
status: berlaku
tanggal: 2026-03-11
pengambil-keputusan: tim survey
tags: [state, persistence, frontend]
---

# HDR-002 — Simpan progres di localStorage, bukan IndexedDB

## Konteks

Survei ini butuh 3–5 menit diisi. Dari uji coba internal pertama, sekitar satu dari
delapan orang meninggalkan tab di tengah jalan lalu kembali beberapa menit kemudian —
biasanya karena ada meeting atau telepon masuk. Kalau progres mereka hilang, mereka
tidak mengisi ulang; mereka menutup tab.

Kami butuh progres yang bertahan menyeberangi refresh, tanpa akun dan tanpa server.

## Keputusan

Seluruh state yang perlu bertahan disimpan di `localStorage`, dibaca dan ditulis dari
`src/hooks/useSurveyState.ts`. Kunci yang dipakai kecil dan datar: penanda tutorial
sudah selesai, nama responden, dan jawaban yang sudah dipilih.

`completeTutorial` menulis penanda tutorial. `submitName` membaca penanda itu untuk
memutuskan apakah tutorial perlu ditampilkan lagi.

## Alasan

- **Datanya kecil.** Satu responden menghasilkan paling banyak beberapa kilobyte:
  sebuah nama, belasan rating, dan urutan slot prioritas. localStorage menyediakan
  kuota jauh di atas itu di semua browser yang kami dukung.
- **API-nya sinkron.** `useSurveyState` bisa membaca state awal langsung saat render
  pertama, tanpa `useEffect` dan tanpa fase loading. IndexedDB memaksa semuanya jadi
  asinkron, dan itu menular ke seluruh alur komponen.
- **Nol dependensi.** IndexedDB mentah menyakitkan dipakai langsung, jadi praktiknya
  kami akan menarik pustaka pembungkus. Menambah dependensi untuk menyimpan beberapa
  kilobyte tidak masuk akal.

## Opsi yang ditolak

- **IndexedDB.** Ditolak: kompleksitas asinkron dan kebutuhan pustaka tambahan, tanpa
  keuntungan nyata di volume data sebesar ini.
- **`sessionStorage`.** Ditolak justru karena ia mati saat tab ditutup — persis kasus
  yang ingin kami selamatkan.
- **Menyimpan ke server tiap langkah.** Ditolak karena tidak ada server; lihat
  [[hdr-001-submit-via-apps-script]].

## Konsekuensi yang kami terima

- Progres terikat ke satu browser di satu perangkat. Mulai di laptop, lanjut di HP,
  progres tidak ikut. Kami menerima ini; survei tiga menit jarang berpindah perangkat.
- Mode penyamaran (incognito) membuang semuanya saat jendela ditutup.
- Karena urutan benefit diacak per sesi (lihat [[hdr-003-randomize-benefits]]), draft
  yang dipulihkan harus mengunci urutan itu juga — kalau tidak, responden melihat kartu
  meloncat posisi setelah refresh. Ini bagian yang paling sering salah saat kami
  mengubah `useSurveyState`.
