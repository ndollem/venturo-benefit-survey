---
paths: ["src/hooks/*.ts", "src/types/*.ts"]
---

# Aturan khusus hooks & types

Aturan ini hanya dimuat saat Claude menyentuh file di `src/hooks/` atau `src/types/`.
Di file lain, teks ini tidak pernah masuk context — dan tidak pernah dibayar tokennya.

## Saat menyentuh `src/hooks/*.ts`

- Setiap state yang bertahan lintas refresh ditulis lewat helper localStorage yang sudah
  ada di `useSurveyState`, bukan `localStorage.setItem` yang ditaburkan langsung.
- Urutan benefit hasil pengacakan ikut disimpan bersama draft. Draft yang dipulihkan
  tanpa urutannya membuat kartu berpindah posisi setelah refresh.
- Slot prioritas merujuk benefit lewat identitasnya, tidak pernah lewat indeks tampilan.

## Saat menyentuh `src/types/*.ts`

- Union tipe yang berasal dari env (`GameplayMode`) selalu punya nilai fallback yang
  divalidasi di `survey.config.ts`. Nilai tak dikenal jatuh ke mode produksi, bukan error.
- Tipe payload submit tidak diubah tanpa memeriksa kolom di sisi penerima.
