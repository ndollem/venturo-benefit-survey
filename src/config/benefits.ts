import type { Benefit } from '../types/survey';
import manifest from '../../assets.manifest';

// Mapping prefix to Category Name & Icon in Bahasa Indonesia
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

// Bahasa Indonesia Title overrides mapping directly to asset manifest keys
const titleOverrides: Record<string, string> = {
  // 💰 Financial Benefits
  "financial.project_bonus": "Bonus / insentif berdasarkan keberhasilan project",
  "financial.performance_bonus": "Bonus berdasarkan performa individu",
  "financial.macbook_installment": "Peningkatan plafon Program Cicilan MacBook Pro tanpa bunga",
  "financial.lunch_voucher": "Voucher makan siang",
  "financial.transport_allowance": "Tunjangan transportasi",

  // 🏢 Office Environment
  "office.external_monitor": "Monitor eksternal untuk bekerja",
  "office.company_macbook": "MacBook yang disediakan perusahaan",
  "office.hybrid_working": "Hybrid Working",
  "office.flexible_hours": "Flexible Working Hours",
  "office.modern_office": "Desain interior kantor yang lebih modern dan nyaman",
  "office.pantry": "Pantry yang lebih lengkap",
  "office.coffee_corner": "Coffee corner",
  "office.free_rice": "Penyediaan nasi putih gratis untuk makan siang",
  "office.free_snack": "Snack / minuman gratis",
  "office.lounge": "Sofa / lounge area",
  "office.nap_room": "Ruang tidur singkat (Nap Room)",
  "office.music": "Musik di area kerja",
  "office.private_workspace": "Ruang kerja pribadi / private workspace",
  "office.company_dorm": "Mess perusahaan bagi karyawan yang membutuhkan",
  "office.prayer_room": "Ruang ibadah yang lebih nyaman",

  // 🌴 Time Off
  "timeoff.annual_leave": "Penambahan jatah cuti tahunan",
  "timeoff.family_leave": "Family Leave",
  "timeoff.mental_leave": "Mental Health Leave",

  // 📚 Learning & Career
  "learning.weekly_training": "Training internal setiap minggu",
  "learning.course_budget": "Budget membeli course / buku",
  "learning.ai_subscription": "Langganan Claude Max (US$100/bulan) untuk penggunaan pribadi",
  "learning.tech_conference": "Mengikuti seminar atau konferensi teknologi",
  "learning.tech_speaker": "Kesempatan menjadi pembicara di event teknologi",
  "learning.career_path": "Jalur karier yang jelas",
  "learning.project_rotation": "Rotasi project agar skill berkembang",
  "learning.mentoring": "Coaching dan mentoring rutin",

  // 🚀 Side Income
  "side.freelance_project": "Kesempatan mengerjakan project freelance tambahan dari perusahaan",
  "side.internal_product": "Bonus jika membuat produk / research internal yang berhasil",

  // ❤️ Health & Wellness
  "health.medical": "Annual Medical Check-up",
  "health.sports": "Voucher olahraga (Gym, Futsal, Badminton, dll.)",
  "health.massage": "Sesi pijat relaksasi",
  "health.psychologist": "Konsultasi psikolog",
  "health.vitamins": "Vitamin bulanan",
  "health.healthy_snack": "Healthy snack di kantor",

  // 🎉 Company Culture
  "culture.employee_award": "Employee of the Quarter / Year",
  "culture.innovation_reward": "Reward untuk ide inovasi yang diimplementasikan",
  "culture.team_building": "Team building rutin",
  "culture.merchandise": "Merchandise eksklusif perusahaan",
  "culture.hackathon": "Hackathon internal",
  "culture.founder_session": "Sharing session bersama founder",
  "culture.peer_appreciation": "Peer Appreciation Program (apresiasi antar karyawan)",

  // 🎁 Miscellaneous / Others
  "misc.company_gift": "Company Gift (Hampers, Birthday Gift)",
  "misc.generic": "Benefit umum lainnya"
};

// Formatting fallback if key is not found in overrides
function formatTitle(id: string, suffix: string): string {
  if (titleOverrides[id]) return titleOverrides[id];
  return suffix
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Map the manifest to the Benefit items list
const benefits: Benefit[] = Object.entries(manifest).map(([key, data]) => {
  const parts = key.split('.');
  const categoryKey = parts[0];
  const itemKey = parts[1] || parts[0];
  
  return {
    id: key,
    category: categoryMap[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    title: formatTitle(key, itemKey),
    sheet: data.sheet,
    index: data.index,
    active: true
  };
});

export default benefits;
export { categoryMap };
