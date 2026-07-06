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

Mengatur judul survey, durasi estimasi, mode gameplay, tema rating, warna aksen, jumlah slot prioritas, dan endpoint Google Sheets.

```typescript
import type { SurveyConfig, GameplayMode } from '../types/survey';

// Resolve gameplay mode dari env, fallback ke default 'priority'.
const rawMode = (import.meta.env.VITE_GAMEPLAY_MODE || 'priority').toLowerCase();
const gameplayMode: GameplayMode =
  rawMode === 'full' || rawMode === 'skip' ? rawMode : 'priority';

const config: SurveyConfig = {
  title: "WHAT MAKES ME HAPPY ON",
  subtitle: "Benefit Challenge",
  estimatedDuration: "3–5 menit",
  randomizeBenefits: true,
  submitEndpoint: import.meta.env.VITE_SUBMIT_ENDPOINT || "https://script.google.com/macros/s/AKfycbxk7sk1P9PHRg1byAKeVh36Rp71WDAXOZFOHM-3SbrapaFiGCIITsdZcTOrMpVyPAwMyQ/exec",
  ratingTheme: "genz",   // Tema aktif: casual, professional, happy, genz
  accent: "#F97316",     // Accent color utama (Orange)
  cardRadius: 24,
  // Kapasitas slot prioritas (default 10, dari VITE_PRIORITY_SLOTS_COUNT)
  prioritySlotsCount: import.meta.env.VITE_PRIORITY_SLOTS_COUNT ? parseInt(import.meta.env.VITE_PRIORITY_SLOTS_COUNT, 10) : 10,
  gameplayMode           // priority (default) | full | skip, dari VITE_GAMEPLAY_MODE
};

export default config;
```

## Gameplay Mode
Field `gameplayMode` menentukan instrumen verdict di bawah card (di-resolve dari env `VITE_GAMEPLAY_MODE`):
- **priority** (default): Slot prioritas sebagai instrumen utama + 2 tombol verdict cepat ("Cakep Nih" skor 4, "Skip Aja" skor 1).
- **full**: Slot prioritas + grid rating penuh 1–5 (5 tombol).
- **skip**: Slot prioritas + satu tombol "Skip Aja" (skor 1) saja.

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
  "financial.project_bonus": "Bonus / Insentif berdasarkan keberhasilan project & individu",
  "financial.macbook_installment": "Peningkatan plafon Program Cicilan Laptop tanpa bunga",
  "financial.lunch_voucher": "Penyediaan makan siang",
  "financial.transport_allowance": "Tunjangan transportasi",
  "office.hybrid_working": "Flexible Hybrid / Work From Home",
  // ... (total 20 benefit aktif terdaftar)
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