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
  // Lingkungan Kerja
  "office.hybrid_working": "Hybrid & WFH fleksibel (atur sendiri hari ke kantor)",
  "office.external_monitor": "Monitor eksternal untuk menunjang kerja harian",
  "office.modern_office": "Kantor dengan interior modern dan nyaman",
  "office.company_macbook": "Subsidi pembelian laptop kerja",
  "office.private_workspace": "Ruang kerja pribadi (private workspace)",
  "office.free_snack": "Snack & minuman gratis di pantry kantor",

  // Benefit Finansial
  "financial.project_bonus": "Bonus / Insentif berdasarkan keberhasilan project & individu",
  "financial.macbook_installment": "Peningkatan plafon Program Cicilan Laptop tanpa bunga",
  "financial.lunch_voucher": "Penyediaan makan siang",
  "financial.transport_allowance": "Tunjangan transportasi",

  // Pembelajaran & Karier
  "learning.mentoring": "Coaching dan mentoring rutin",
  "learning.ai_subscription": "Langganan Claude Max (US$100/bulan) untuk penggunaan pribadi",
  "learning.weekly_training": "Training pengembangan diri rutin setiap minggu",
  "learning.course_budget": "Budget untuk membeli course, buku, atau sertifikasi",

  // Budaya Perusahaan
  "culture.employee_award": "Employee of the Quarter / Year",
  "culture.innovation_reward": "Reward untuk ide inovasi yang diimplementasikan",
  "culture.founder_session": "Sharing session bersama founder",
  "culture.peer_appreciation": "Peer Appreciation Program (apresiasi antar karyawan)",

  // Kesehatan & Kebugaran
  "health.sports": "Voucher olahraga (Gym, Futsal, Badminton, dll.)",

  // Penghasilan Tambahan
  "side.freelance_project": "Kesempatan mengerjakan project freelance tambahan dari perusahaan"
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
