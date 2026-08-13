---
tipe: HDR
status: berlaku
tanggal: 2026-06-02
pengambil-keputusan: tim survey
tags: [konfigurasi, env, gameplay]
---

# HDR-004 — `gameplayMode` tiga mode, default `priority`

## Konteks

Setelah gelombang pertama survei, muncul tiga kebutuhan yang saling bertabrakan:

1. HR ingin data prioritas — mana benefit yang paling diinginkan kalau harus memilih.
2. Tim produk ingin data rating penuh untuk semua benefit, bukan hanya sepuluh teratas.
3. Saat demo ke manajemen, kami butuh melewati gameplay dan langsung ke layar akhir,
   karena tidak ada yang mau menonton orang mengisi survei tiga menit di rapat.

Menuliskan ketiganya sebagai cabang di dalam komponen akan membuat `Gameplay.tsx`
menjadi labirin kondisional.

## Keputusan

Satu nilai konfigurasi `gameplayMode` bertipe `GameplayMode` dengan tiga nilai:

- `priority` — responden merating benefit lalu menyusun sepuluh slot prioritas
- `full` — semua benefit dirating, tahap prioritas dilewati
- `skip` — gameplay dilompati seluruhnya, langsung ke pertanyaan akhir

Nilainya dibaca dari env `VITE_GAMEPLAY_MODE` di `src/config/survey.config.ts`, di-
lowercase, lalu divalidasi. Nilai yang tidak dikenal jatuh kembali ke `priority`.

Default-nya `priority` karena itulah mode yang dipakai survei sungguhan.

## Alasan

- **Mode adalah keputusan deploy, bukan keputusan runtime.** Tidak ada responden yang
  boleh memilih mode. Env var memaksa keputusan itu terjadi sekali, di luar aplikasi.
- **Fallback yang aman.** Env var yang salah ketik di pipeline deploy tidak boleh
  membuat survei sungguhan rusak. Nilai tak dikenal jatuh ke mode produksi, bukan error.
- **Satu sumber kebenaran.** Komponen membaca satu nilai, bukan tiga flag boolean yang
  bisa saling bertentangan.

## Opsi yang ditolak

- **Tiga flag boolean terpisah** (`enableRating`, `enablePriority`, `skipGameplay`).
  Ditolak: delapan kombinasi mungkin, lima di antaranya tidak masuk akal.
- **Query string `?mode=skip`.** Ditolak: siapa pun bisa mengubah mode survei sungguhan
  hanya dengan mengetik di address bar, dan datanya jadi campur aduk.
- **Build terpisah per mode.** Ditolak: tiga artefak build untuk perbedaan satu nilai.

## Konsekuensi yang kami terima

- Mode `skip` melewati gameplay sepenuhnya, jadi ia juga melewati jalur kode yang paling
  sering rusak. Demo yang mulus bukan bukti bahwa survei berfungsi.
- Menambah mode keempat berarti menyentuh validasi di `survey.config.ts` **dan** setiap
  komponen yang bercabang atas mode. Ini yang membuat [[rfc-103-mode-tim]] lebih mahal
  daripada kelihatannya.
