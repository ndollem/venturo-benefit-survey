# Benefit Priority Challenge

> A simple, fun, mobile-first survey game to discover which employee benefits are the most valuable for the Venturo team.

---

# Project Overview

Benefit Priority Challenge adalah mini web application yang digunakan sebagai media survey internal Venturo untuk mengetahui benefit apa yang paling bernilai bagi seluruh anggota tim.

Berbeda dengan survey konvensional yang menggunakan Google Form atau checklist panjang, aplikasi ini mengubah proses survey menjadi sebuah mini game sederhana.

Setiap benefit akan muncul secara acak satu per satu disertai ilustrasi yang menarik. Peserta hanya perlu memberikan reaksi atau penilaian terhadap benefit tersebut menggunakan pilihan rating yang tersedia.

Seluruh proses dirancang agar ringan, cepat, menyenangkan, dan dapat diselesaikan dalam waktu sekitar 3–5 menit.

---

# Background

Venturo sedang mengevaluasi berbagai kemungkinan benefit yang dapat diberikan kepada seluruh anggota tim.

Namun, perusahaan tidak dapat menyediakan seluruh benefit secara bersamaan.

Karena itu dibutuhkan data mengenai benefit mana yang benar-benar dianggap paling bernilai oleh seluruh tim sehingga keputusan yang diambil nantinya berdasarkan kebutuhan nyata, bukan asumsi.

Survey ini bukan bertujuan mencari jawaban benar atau salah.

Yang ingin diketahui adalah persepsi dan preferensi setiap orang terhadap berbagai pilihan benefit.

---

# Objectives

Project ini memiliki beberapa tujuan utama.

- Mengetahui benefit yang paling dihargai oleh tim Venturo.
- Mengetahui benefit yang dianggap kurang memberikan nilai.
- Mengurangi kejenuhan dibandingkan survey tradisional.
- Membuat proses survey terasa seperti bermain game.
- Menghasilkan data yang mudah dianalisis oleh manajemen.

---

# Target Users

Internal Venturo Team

Estimasi peserta

- ±80 orang

Survey dilakukan

- satu kali

Durasi pengisian

- sekitar 3–5 menit

---

# Design Principles

Seluruh aplikasi mengikuti prinsip berikut.

## Simple

Tidak ada fitur yang tidak diperlukan.

## Mobile First

Pengalaman utama dirancang untuk perangkat mobile.

Desktop hanya menjadi responsive adaptation (simulasi ponsel terpusat).

## One Screen Gameplay

Seluruh permainan berlangsung dalam satu layar.

Tidak ada perpindahan halaman selama gameplay.

## Fast Interaction

Setiap benefit cukup membutuhkan satu kali tap.

Tidak ada tombol Next.

Tidak ada popup konfirmasi.

Tidak ada proses yang mengganggu ritme permainan.

## Visual First

Ilustrasi menjadi fokus utama.

Pengguna lebih banyak melihat gambar dibanding membaca teks panjang.

---

# Project Scope

Yang termasuk dalam project

- Landing page (Splash) dengan cover background `/images/splash.webp`
- Input nama
- Tutorial singkat
- Mini game survey (Gameplay dengan dynamic pastel backgrounds)
- Shuffle animation (Decelerating slot machine)
- Rating benefit (2-column tile grid layout)
- Progress indicator
- Auto submit ke Google Sheet (CORS-friendly dengan `no-cors` mode)
- Thank you page
- Penyimpanan ke Google Sheet via Google Apps Script
- Vercel configuration (`vercel.json`) untuk hosting SPA

Yang tidak termasuk

- Login & authentication
- Dashboard admin internal
- Database mandiri
- Edit jawaban setelah submit
- Multiple survey di satu instance
- Export PDF dari web
- CMS & user management

---

# Gameplay Concept

Setiap benefit akan muncul secara acak dari database konfigurasi global.

Peserta memberikan penilaian menggunakan salah satu pilihan rating dalam format grid.

Contoh rating (Casual Theme):
```
🤩 Wajib Ada! (5)
😍 Mau Banget (4)
🙂 Boleh Juga (3)
😐 Kurang Ngaruh (2)
🙅 Nggak Perlu (1)
```

Label dan emoji tersebut tidak di-hardcode.

Seluruh pilihan rating berasal dari file konfigurasi sehingga dapat diubah kapan saja tanpa mengubah kode aplikasi.

---

# Config Driven

Seluruh isi survey berasal dari configuration file.

Developer tidak perlu mengubah source code ketika ingin:

- mengganti daftar benefit
- mengganti ilustrasi / sprite mappings
- mengganti caption rating / emoji
- menambah benefit
- mengurangi benefit
- mengganti endpoint submit
- mengubah accent color UI

Semua perubahan cukup dilakukan melalui file konfigurasi di `src/config/`.

---

# Tech Stack

Frontend:
- React (SPA)
- Vite
- Tailwind CSS v4
- Framer Motion

Hosting:
- Vercel.com (atau GitHub Pages)

Storage:
- Google Spreadsheet

Backend Endpoint:
- Google Apps Script Web App

Image Assets:
- WebP format (2x2 grid sprite sheets: `sprite-01.webp` s.d. `sprite-12.webp`)
- Splash Cover: `splash.webp`

---

# Performance Goals

First Load:
< 2 detik

Gameplay:
60 FPS animation

Image:
WebP format (compressed sprites & splash)

Responsive:
Mobile First (centered adaptive layout)

---

# Success Criteria

Project dianggap berhasil apabila:

- Seluruh peserta dapat membuka survey tanpa login.
- Gameplay dapat diselesaikan kurang dari 5 menit.
- Seluruh benefit berhasil diberi rating.
- Data berhasil masuk ke Google Spreadsheet tanpa error CORS.
- Manajemen dapat langsung melakukan analisis dari spreadsheet.
- Seluruh aplikasi dapat di-deploy menggunakan Vercel atau GitHub Pages secara instan.