# Benefit Priority Challenge

> Sebuah aplikasi mini-survey interaktif berbasis game mobile-first untuk mendata prioritas benefit kerja bagi tim Venturo.

Aplikasi ini dirancang ringan, cepat, dan menyenangkan. Menggunakan arsitektur *serverless* dengan frontend React + Vite + Tailwind CSS v4, dan backend penyimpanan Google Spreadsheet via Google Apps Script Web App.

---

## Fitur Utama

- **One Screen Gameplay**: Seluruh interaksi survey diselesaikan dalam satu layar ponsel terpusat.
- **Visual & Gamified**: Benefit disajikan satu per satu dengan ilustrasi sprite dan animasi *reveal* kartu yang halus (kartu memantul lembut, ilustrasi menajam dari blur).
- **Flat Shuffling**: Pertanyaan diacak secara acak datar (flat randomized) dari pool benefit aktif (saat ini 20 benefit) tanpa pembagian kategori agar survey benar-benar acak.
- **Gameplay Mode (env-switchable)**: Metode survey dapat dipilih via `VITE_GAMEPLAY_MODE` — `priority` (default: slot prioritas + 2 tombol verdict cepat), `full` (slot + grid rating 1–5 penuh untuk sentimen terkaya), atau `skip` (slot + satu tombol lewati saja).
- **Priority Slots (Prioritas Khusus)**: Instrumen utama survey — sidebar kanan untuk memilih & mengurutkan Top N benefit paling penting (default 10, diatur via `VITE_PRIORITY_SLOTS_COUNT`). Mengisi slot memicu confetti dan otomatis memberi skor 5. Slot dapat diganti (overwrite) kapan saja; benefit lama yang diganti tetap mempertahankan skor 5.
- **Dynamic Pastel Backgrounds**: Latar belakang berubah warna pastel secara lembut dan dinamis seiring pergantian kartu pertanyaan.
- **Tanpa Database / Server**: Data langsung masuk ke Google Sheet menggunakan Apps Script secara CORS-safe dengan payload terstruktur (termasuk list prioritas urutan).
- **Responsive Adaptive**: Tampilan adaptif yang disimulasikan sebagai frame ponsel modern saat dibuka di layar komputer/desktop.

---

## Folder Struktur

```
venturo-benefit-survey/
├── appsscript/
│   └── code.js                 # Kode backend Google Apps Script & petunjuk setup
├── docs/                       # Dokumen spesifikasi analisis sistem lengkap
│   ├── 01-project-overview.md
│   ├── 02-uiux-specification.md
│   ├── 03-functional-specification.md
│   ├── 04-content-configuration.md
│   └── 05-google-sheet-appscript.md
├── public/
│   ├── images/
│   │   ├── splash.webp         # Gambar cover background landing page
│   │   ├── sprite-01.webp      # Sprite sheet benefit (2x2 grid)
│   │   └── ... s.d. sprite-12.webp
│   └── favicon.svg
├── src/
│   ├── components/             # Komponen UI (SplashScreen, Gameplay, dll.)
│   ├── config/
│   │   ├── benefits.ts         # Adaptor registrasi Bahasa Indonesia benefit
│   │   ├── rating-themes.ts    # Koleksi tema rating (Casual, Professional, dll.)
│   │   └── survey.config.ts    # Konfigurasi global & endpoint submit
│   ├── hooks/
│   │   └── useSurveyState.ts   # Custom hook State Machine & fetch handler
│   ├── types/
│   │   └── survey.ts           # Definisi tipe TypeScript
│   ├── App.tsx                 # Entry component utama & styling wrapper
│   ├── index.css               # Styling global & Tailwind CSS v4 directives
│   └── main.tsx
├── assets.manifest.ts          # Pemetaan index ikon benefit pada berkas sprite sheet
├── package.json
├── tsconfig.json
├── vercel.json                 # Konfigurasi deploy redirect SPA ke vercel.com
└── vite.config.ts
```

---

## Cara Menjalankan Secara Lokal

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (rekomendasi versi >= 18) di perangkat Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut di folder proyek untuk menginstal semua library (`framer-motion`, `lucide-react`, `tailwindcss`, dll.):
```bash
npm install
```

### 3. Masukkan Aset Gambar
1. Pastikan berkas **splash.webp** berada di:
   `public/images/splash.webp`
2. Pastikan semua berkas sprite sheet **sprite-01.webp** sampai **sprite-12.webp** berada di:
   `public/images/`

### 4. Jalankan Dev Server
Jalankan server pengembangan Vite secara lokal:
```bash
npm run dev
```
Buka alamat [http://localhost:5173/](http://localhost:5173/) di browser Anda untuk menguji aplikasi secara interaktif.

### 5. Bangun Aset Produksi
Untuk memastikan kode terkompilasi bersih tanpa error TypeScript, jalankan:
```bash
npm run build
```

---

## Konfigurasi Kustom

Semua parameter survey dapat Anda ubah secara instan tanpa menyentuh file komponen React:

### Mengubah Judul, Durasi, atau Warna Aksen:
Buka berkas [src/config/survey.config.ts](file:///Users/kly/projects/venturo-benefit-survey/src/config/survey.config.ts) dan sesuaikan:
- `title` / `subtitle`: Teks landing page.
- `accent`: Kode warna hex untuk aksen tombol (misal `#F97316` untuk orange).
- `ratingTheme`: Ganti tipe rating ke `"casual"`, `"professional"`, `"happy"`, atau `"genz"` (aktif: `genz`).
- `gameplayMode`: `"priority"` (default) / `"full"` / `"skip"` — juga dapat di-override lewat env `VITE_GAMEPLAY_MODE`.
- `prioritySlotsCount`: Jumlah slot prioritas (default 10) — dapat di-override lewat env `VITE_PRIORITY_SLOTS_COUNT`.
- `submitEndpoint`: URL Google Apps Script Web App (di-override lewat env `VITE_SUBMIT_ENDPOINT`).

### Mengubah Teks Judul Benefit Bahasa Indonesia:
Buka berkas [src/config/benefits.ts](file:///Users/kly/projects/venturo-benefit-survey/src/config/benefits.ts) dan edit teks di dalam objek `titleOverrides`.

---

## Cara Deployment

### 1. Google Sheets Backend
Ikuti petunjuk instalasi Apps Script yang tertera secara lengkap di bagian atas file [appsscript/code.js](file:///Users/kly/projects/venturo-benefit-survey/appsscript/code.js) untuk menghubungkan survey Anda ke Google Sheet target.

### 2. Frontend ke Vercel (Rekomendasi)
Proyek ini siap dideploy ke **Vercel** dengan integrasi GitHub:
1. Hubungkan proyek ini ke repositori GitHub Anda.
2. Buka [Vercel](https://vercel.com) dan impor repositori tersebut.
3. Vercel akan otomatis mendeteksi konfigurasi Vite dan menyetel *build command* `npm run build` serta *output directory* `dist`.
4. Berkas `vercel.json` akan otomatis mengurus routing halaman agar berjalan mulus sebagai Single Page Application.
5. Klik **Deploy**.

---

## Laporan Hasil Survey

Seluruh data respon dari peserta survey yang dikirimkan melalui aplikasi ini dicatat secara langsung ke Google Spreadsheet. Anda dapat melihat database hasil survey live pada link berikut:

👉 **[Google Spreadsheet Hasil Survey](https://docs.google.com/spreadsheets/d/1UdqpNzhLoHtq2ZNgcd8SXB3m-TKKCydJVqfX3_2m_ug/edit?usp=sharing)**
