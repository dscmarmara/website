/**
 * Every skill chip shown on member profiles (members.json → `focus`), in one
 * place so the same skill reads the same on every profile. The key is the
 * English label used in members.json; the value is the Turkish label.
 *
 * Conventions:
 * - Turkish labels are title case ("Makine Öğrenmesi", "Veri Analizi").
 * - Tool and brand names stay the same in both languages (Python, Power BI).
 * - Add a new chip here first: the build fails on a member chip that is
 *   missing from this list (see members.ts).
 */
export const SKILLS_TR: Record<string, string> = {
  // Data & AI
  "Machine Learning": "Makine Öğrenmesi",
  Statistics: "İstatistik",
  "Data Analysis": "Veri Analizi",
  "Sports Analytics": "Spor Analitiği",
  "Computer Vision": "Bilgisayarlı Görü",
  "Data Storytelling": "Veri Hikâyeleştirme",
  Dashboards: "Gösterge Panelleri",
  EDA: "EDA",
  MLOps: "MLOps",

  // Engineering
  "Web Development": "Web Geliştirme",
  "Full-Stack Architecture": "Sistem Mimarisi",

  // Tools
  Python: "Python",
  R: "R",
  SQL: "SQL",
  PyTorch: "PyTorch",
  "Power BI": "Power BI",
  Tableau: "Tableau",
  Excel: "Excel",
  Notion: "Notion",

  // Finance
  "Financial Analysis": "Finansal Analiz",
  Accounting: "Muhasebe",
  Sponsorship: "Sponsorluk",
  Budgeting: "Bütçe Planlaması",
  Negotiation: "Müzakere",
  Partnerships: "İş Birlikleri",

  // Leadership & operations
  "Executive Leadership": "Topluluk Liderliği",
  "Strategic Vision": "Stratejik Vizyon",
  "Field Experience": "Saha Deneyimi",
  "Operational Scaling": "Operasyonel Ölçekleme",
  "Agile Management": "Çevik Yönetim",
  "Community Management": "Topluluk Yönetimi",
  Operations: "Operasyon Yönetimi",
  Planning: "Planlama",
  "People Management": "Ekip Yönetimi",
  Documentation: "Dokümantasyon",
  Coordination: "Koordinasyon",

  // Events
  "Event Management": "Etkinlik Yönetimi",
  Hackathons: "Hackathon",

  // Communication & design
  "Brand Identity": "Marka Kimliği",
  "Graphic Design": "Grafik Tasarım",
  "Content Creation": "İçerik Üretimi",
  "Social Media": "Sosyal Medya",
};

export const isKnownSkill = (skill: string): boolean => Object.hasOwn(SKILLS_TR, skill);

/** A chip's label for a locale: Turkish for the tr family (tr, tr-x-eski), English otherwise. */
export function skillLabel(skill: string, locale: string): string {
  return locale.split("-")[0] === "tr" ? (SKILLS_TR[skill] ?? skill) : skill;
}
