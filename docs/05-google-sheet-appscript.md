# Google Sheet & Apps Script Specification

> Benefit Priority Challenge

Version 1.0 (Final Architecture)

---

# Purpose

Seluruh hasil survey disimpan secara langsung ke Google Spreadsheet menggunakan Google Apps Script Web App. Arsitektur ini sepenuhnya *serverless* tanpa database mandiri, sehingga meniadakan biaya infrastruktur tambahan.

---

# Architecture Flow

```
React App (Vercel)
      ↓
POST JSON (no-cors mode)
      ↓
Google Apps Script (Web App Redirection)
      ↓
Google Spreadsheet (Responses sheet)
```

---

# Google Spreadsheet

## Sheet Structure
- **Nama Spreadsheet**: `Benefit Survey Responses` (atau spreadsheet pilihan Anda).
- **Nama Worksheet/Tab**: `Responses` (atau sheet pertama di dalam dokumen).

## Columns Map
Setiap baris mewakili satu kiriman dari peserta survey:

| Column | Header | Type | Description |
|---|---|---|---|
| A | `Timestamp` | DateTime | Tanggal dan waktu submit |
| B | `Name` | String | Nama lengkap peserta |
| C | `Answers` | JSON String | Nilai rating benefit (kunci: `id_benefit`, nilai: `1-5`) |
| D | `Stay Reason` | String | Esai jawaban alasan bertahan (opsional) |
| E | `Leave Reason` | String | Esai jawaban alasan resign (opsional) |

### Answers JSON Format
Kolom **Answers** menyimpan objek JSON ter-stringifikasi untuk mengantisipasi perubahan data benefit di masa mendatang tanpa merusak struktur kolom spreadsheet:
```json
{
  "financial.project_bonus": 5,
  "financial.performance_bonus": 4,
  "office.external_monitor": 5,
  "timeoff.annual_leave": 5,
  "_priorities": {
    "1": "financial.project_bonus",
    "2": "timeoff.annual_leave",
    "3": "office.external_monitor"
  }
}
```

---

# Google Apps Script Setup

Kode lengkap Apps Script tersimpan di proyek Anda pada berkas [appsscript/code.js](file:///Users/kly/projects/venturo-benefit-survey/appsscript/code.js).

## doPost(e)
Logika penanganan request POST:
1. Membaca data kiriman mentah melalui `e.postData.contents`.
2. Melakukan *parsing* JSON dan validasi parameter wajib (`name` dan `answers`).
3. Mengambil instansi Spreadsheet aktif dan tab `Responses`.
4. Menambahkan baris baru dengan timestamp.
5. Mengirimkan respon JSON kembali ke klien.

```javascript
function doPost(e) {
  // CORS Headers
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    // Parsing & validation logic
    // ... (refer to code.js for full implementation)
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
    sheet.appendRow([new Date(), name, answersJson, stayReason, leaveReason]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}
```

---

# CORS Integration Fix

Google Apps Script Web App selalu memicu redireksi HTTP 302 ke sub-domain `googleusercontent.com` saat memproses output. Redireksi ini sering diblokir oleh kebijakan CORS browser jika dikirim menggunakan header JSON konvensional.

Untuk menyelesaikan ini:
1. **Frontend Request Mode**: Frontend dikonfigurasi menggunakan mode `no-cors` dalam method fetch:
   ```typescript
   fetch(endpoint, {
     method: 'POST',
     mode: 'no-cors',
     headers: { 'Content-Type': 'text/plain;charset=utf-8' },
     body: JSON.stringify(payload)
   })
   ```
2. **Apps Script Parsing**: Apps Script memproses body string tersebut menggunakan parser JSON standar.
3. **Respon Opaque**: Browser akan menganggap status request aman dan memperlakukan respon sebagai *opaque*. Logika state hook akan langsung memicu transisi ke halaman sukses setelah request dikirim dengan sukses tanpa hambatan CORS.
