---
tipe: RFC
status: diusulkan
tanggal: 2026-07-21
pengusul: tim survey
tags: [reliability, submit, belum-diimplementasi]
---

# RFC-101 — Antrian submit offline

> **Status: BELUM ADA DI KODE.** Tidak ada implementasi antrian di repo saat ini.
> Yang ada hanya `retrySubmit` — percobaan ulang manual, satu kali, oleh responden.

## Masalah

Survei diisi di lantai pabrik dan di gudang, tempat sinyal seluler putus-nyambung.
Pola kegagalan yang kami lihat di gelombang pertama selalu sama: responden mengisi
seluruh survei sampai selesai, menekan kirim, lalu gagal. Layar gagal muncul, mereka
menekan coba lagi sekali, gagal lagi, lalu menyerah dan menutup tab.

Kerja tiga menit hilang di detik terakhir. Ini kegagalan yang paling mahal karena
terjadi setelah seluruh usaha dikeluarkan.

Akar penyebabnya struktural: karena tidak ada backend milik kami
([[hdr-001-submit-via-apps-script]]), tidak ada apa pun di sisi server yang bisa
menerima jawaban lalu memprosesnya belakangan. Kalau permintaan HTTP gagal, ia hilang.

## Usulan

Ketika submit gagal, jangan tampilkan layar gagal. Simpan payload jawaban ke
`localStorage` sebagai antrian, tampilkan layar sukses, lalu coba kirim ulang di latar
belakang saat koneksi kembali — termasuk saat responden membuka aplikasi lagi
berikutnya.

Bagian yang tersentuh:

- `submitSurvey` di `src/hooks/useSurveyState.ts` — menulis ke antrian saat gagal
  alih-alih langsung memindahkan state ke gagal
- `retrySubmit` — berubah makna: dari percobaan manual sekali menjadi penguras antrian
- `StatusScreens.tsx` — layar gagal jadi jarang muncul; perlu status baru "tersimpan,
  menunggu terkirim"
- Kunci localStorage baru untuk antrian, di samping kunci draft yang sudah ada
  ([[hdr-002-localstorage-bukan-indexeddb]])

## Yang belum diputuskan

- **Berapa lama antrian disimpan?** Jawaban dari periode survei tahun lalu tidak boleh
  tiba-tiba masuk tahun ini.
- **Bagaimana mencegah kiriman ganda?** Apps Script tidak punya idempotency key. Kalau
  percobaan pertama sebenarnya berhasil tapi responsnya yang hilang, kiriman ulang
  membuat baris ganda di sheet HR.
- **Apakah layar sukses palsu itu jujur?** Menampilkan sukses padahal data belum sampai
  adalah kebohongan kecil. Alternatifnya layar "tersimpan di perangkat" yang jujur tapi
  membingungkan responden non-teknis.

Masalah kiriman ganda mungkin lebih mudah diselesaikan setelah
[[rfc-102-pindah-ke-supabase]] — sebuah backend sungguhan bisa menolak duplikat.
