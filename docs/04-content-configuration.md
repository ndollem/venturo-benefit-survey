# Content Configuration Specification

> Benefit Priority Challenge

Version 1.0 (Final Architecture)

---

# Purpose

Seluruh konten visual, teks, dan pengaturan survey diatur melalui configuration layer di folder `src/config/`. Hal ini membuat aplikasi bersifat *highly-reusable*, sehingga mudah dipelihara atau disesuaikan ulang tanpa perlu memodifikasi komponen React utama.

---

# Configuration Files

Terdapat tiga file konfigurasi utama di dalam folder [src/config/](file:///Users/kly/projects/venturo-benefit-survey/src/config/):

1. [survey.config.ts](file:///Users/kly/projects/venturo-benefit-survey/src/config/survey.config.ts) (Pengaturan Global & Endpoint)
2. [benefits.ts](file:///Users/kly/projects/venturo-benefit-survey/src/config/benefits.ts) (Registrasi & Terjemahan Benefit)
3. [rating-themes.ts](file:///Users/kly/projects/venturo-benefit-survey/src/config/rating-themes.ts) (Tema Penilaian / Rating)

---

# survey.config.ts

Mengatur judul survey, durasi estimasi, mode animasi, warna aksen, dan endpoint Google Sheets.

```typescript
import type { SurveyConfig } from '../types/survey';

const config: SurveyConfig = {
  title: "WHAT MAKES ME HAPPY ON",
  subtitle: "Benefit Challenge",
  estimatedDuration: "3–5 menit",
  randomizeBenefits: true,
  showCategoryIntro: false, // Ditiadakan demi kecepatan gameplay
  categoryIntroDuration: 1200,
  shuffleAnimation: {
    firstOnly: true, // Hanya melakukan shuffle pada kartu pertama
    duration: 2000   // Durasi shuffle 2 detik
  },
  submitEndpoint: "https://script.google.com/macros/s/AKfycbxk7sk1P9PHRg1byAKeVh36Rp71WDAXOZFOHM-3SbrapaFiGCIITsdZcTOrMpVyPAwMyQ/exec",
  ratingTheme: "casual", // Tema aktif: casual, professional, happy, genz
  accent: "#F97316",     // Accent color utama (Orange)
  cardRadius: 24
};

export default config;
```

---

# benefits.ts

File ini berfungsi sebagai adapter dinamis yang mengimpor manifest aset gambar dari [assets.manifest.ts](file:///Users/kly/projects/venturo-benefit-survey/assets.manifest.ts) di root project.

## Terjemahan Bahasa Indonesia
Semua benefit dideklarasikan menggunakan teks Bahasa Indonesia resmi melalui objek `titleOverrides`. Kunci objek merujuk pada format `kategori.id_benefit` yang dideklarasikan di manifest.

Contoh konfigurasi benefit:
```typescript
// Mapping kategori ke Bahasa Indonesia
const categoryMap: Record<string, string> = {
  financial: "💰 Benefit Finansial",
  office: "🏢 Lingkungan Kerja",
  timeoff: "🌴 Cuti & Waktu Istirahat",
  learning: "📚 Pembelajaran & Karier",
  side: "🚀 Penghasilan Tambahan",
  health: "❤️ Kesehatan & Kebugaran",
  culture: "🎉 Budaya Perusahaan",
  misc: "🎁 Benefit Lainnya"
};

// Objek pemetaan Bahasa Indonesia untuk benefit
const titleOverrides: Record<string, string> = {
  "financial.project_bonus": "Bonus / insentif berdasarkan keberhasilan project",
  "financial.performance_bonus": "Bonus berdasarkan performa individu",
  "financial.macbook_installment": "Peningkatan plafon Program Cicilan MacBook Pro tanpa bunga",
  "financial.lunch_voucher": "Voucher makan siang",
  "financial.transport_allowance": "Tunjangan transportasi",
  // ... (total 48 benefits terdaftar)
};
```

Adapter ini menggabungkan data manifest (nama file sprite sheet, indeks ikon, status aktif) dengan nama kategori dan teks judul Bahasa Indonesia secara otomatis sewaktu runtime.

---

# rating-themes.ts

Menyediakan berbagai tema penilaian (1 s.d. 5) yang dapat dipilih via `survey.config.ts`.

## 1. Casual Theme (Default)
Menggunakan emoji ekspresif untuk mini game survey:
- **5**: `🤩` Wajib Ada!
- **4**: `😍` Mau Banget
- **3**: `🙂` Boleh Juga
- **2**: `😐` Kurang Ngaruh
- **1**: `🙅` Nggak Perlu

## 2. Professional Theme
Menggunakan teks formal tanpa emoji:
- **5**: Sangat Diinginkan
- **4**: Diinginkan
- **3**: Netral
- **2**: Kurang Diinginkan
- **1**: Tidak Dibutuhkan

## 3. Happy Theme
- **5**: `🥳` Seneng Banget!
- **4**: `😊` Lumayan Seneng
- **3**: `🙂` Biasa Aja
- **2**: `😌` Ya Gapapa
- **1**: `🙅` Nggak Ngaruh

## 4. Gen Z Theme
- **5**: `🔥` Auto Ambil
- **4**: `👌` Cakep Nih
- **3**: `🙂` Lumayan
- **2**: `🤏` Kurang Sih
- **1**: `🙅` Skip Aja