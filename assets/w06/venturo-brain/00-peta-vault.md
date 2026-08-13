---
tipe: indeks
tanggal: 2026-08-11
tags: [peta]
---

# Peta Vault — Otak Kedua `venturo-benefit-survey`

Vault ini menyimpan hal yang **tidak ada di dalam repo**: alasan di balik keputusan yang
sudah diambil, dan rencana yang belum jadi kode. Kode memberi tahu kamu *apa* yang
terjadi. Catatan di sini memberi tahu kamu *kenapa*, dan *apa yang berikutnya*.

## Keputusan yang sudah berlaku

| Catatan | Menjawab |
|---|---|
| [[hdr-001-submit-via-apps-script]] | Kenapa submit lewat Google Apps Script, bukan API sendiri |
| [[hdr-002-localstorage-bukan-indexeddb]] | Kenapa progres disimpan di localStorage |
| [[hdr-003-randomize-benefits]] | Kenapa urutan benefit diacak, dan harga yang dibayar |
| [[hdr-004-gameplay-mode-tiga-mode]] | Kenapa `gameplayMode` punya tiga nilai dan default `priority` |
| [[hdr-005-priority-slots-sepuluh]] | Kenapa sepuluh slot prioritas, dan kenapa bisa ditukar |

## Rencana yang belum jadi kode

| Catatan | Status |
|---|---|
| [[rfc-101-offline-queue]] | Diusulkan — antrian submit saat sinyal putus |
| [[rfc-102-pindah-ke-supabase]] | Ditunda — meninggalkan Apps Script |
| [[rfc-103-mode-tim]] | Diusulkan — satu sesi banyak orang |

## Benang yang menghubungkan semuanya

Tiga keputusan awal saling mengunci. Tidak ada backend
([[hdr-001-submit-via-apps-script]]) memaksa state hidup di perangkat
([[hdr-002-localstorage-bukan-indexeddb]]). Pengacakan urutan
([[hdr-003-randomize-benefits]]) membuat state di perangkat itu jauh lebih rumit dari
kelihatannya. Dan ketiganya bersama-sama membuat kedua rencana besar —
[[rfc-101-offline-queue]] dan [[rfc-103-mode-tim]] — bergantung pada
[[rfc-102-pindah-ke-supabase]] yang justru sedang ditunda.

Itulah keseluruhan cerita arsitektur aplikasi ini, dan tidak satu kalimat pun darinya
bisa dibaca dari kode.
