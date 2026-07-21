import type { Localized } from "@/lib/members";

export const SOCIALS = {
  linkedin: "https://www.linkedin.com/company/datascienceclub-marmara",
  instagram: "https://www.instagram.com/dsc.marmara",
  /**
   * No Medium account yet, so it is not rendered anywhere. Kept here (and
   * `MediumIcon` is kept in SocialIcons) so switching it back on later is just
   * pasting the URL and re-adding the <SocialLink>. "#" also keeps it out of
   * the JSON-LD `sameAs` list in lib/seo.ts.
   */
  medium: "#",
} as const;

/** Public contact address, shown on /contact. */
export const CONTACT_EMAIL = "iletisim@dscmarmara.com.tr";

/** Department display names (kept identical in both locales, per the prototype). */
export const DEPARTMENTS = [
  "Data Insights",
  "Core AI",
  "Data Pipelines",
  "Summits & Awards",
  "Finance & Corporate",
  "PR",
] as const;

export interface HomeStat {
  num: string;
  label: Localized;
}

export const HOME_STATS: HomeStat[] = [
  { num: "6", label: { en: "DEPARTMENTS", tr: "DEPARTMAN" } },
  { num: "400+", label: { en: "ACTIVE MEMBERS", tr: "AKTİF ÜYE" } },
  // { num: "30+", label: { en: "PROJECTS SHIPPED", tr: "YAYINLANAN PROJE" } },
  { num: "12", label: { en: "EVENTS / YEAR", tr: "YILLIK ETKİNLİK" } },
];

export interface HomeProject {
  title: string;
  tag: string;
  shot: string;
  desc: Localized;
}

// No projects live yet, so the featured-projects section stays hidden while
// HOME_PROJECTS is empty. The previous entries are kept below (commented out) —
// uncomment them (and remove the empty array) to show the project cards again.
export const HOME_PROJECTS: HomeProject[] = [
  // {
  //   title: "Campus Pulse",
  //   tag: "CORE AI",
  //   shot: "dashboard shot",
  //   desc: {
  //     en: "A real-time NLP pipeline that scores student feedback across six faculties and surfaces emerging issues in a live dashboard.",
  //     tr: "Altı fakülte genelinde öğrenci geri bildirimini puanlayan ve ortaya çıkan sorunları canlı bir panoda gösteren gerçek zamanlı bir NLP hattı.",
  //   },
  // },
  // {
  //   title: "TransitFlow",
  //   tag: "DATA PIPELINES",
  //   shot: "map shot",
  //   desc: {
  //     en: "Predicting Istanbul commute times from open transit data with a streaming ETL pipeline on Spark.",
  //     tr: "Spark üzerinde akış tabanlı bir ETL hattıyla açık ulaşım verisinden İstanbul'daki yol sürelerini tahmin ediyor.",
  //   },
  // },
  // {
  //   title: "MarmaraViz",
  //   tag: "DATA INSIGHTS",
  //   shot: "BI shot",
  //   desc: {
  //     en: "Interactive Power BI dashboards that turn the university's open datasets into stories anyone can read.",
  //     tr: "Üniversitenin açık veri setlerini herkesin okuyabileceği hikâyelere çeviren etkileşimli Power BI panoları.",
  //   },
  // },
];

export interface HomeDepartment {
  no: string;
  name: string;
  desc: Localized;
}

export const HOME_DEPARTMENTS: HomeDepartment[] = [
  {
    no: "01",
    name: "Data Insights",
    desc: {
      en: "EDA, BI and storytelling with Tableau, Power BI and Matplotlib.",
      tr: "Tableau, Power BI ve Matplotlib ile keşifsel analiz, iş zekâsı ve hikâye anlatımı.",
    },
  },
  {
    no: "02",
    name: "Core AI",
    desc: {
      en: "Machine learning, deep learning, NLP and computer vision in Python.",
      tr: "Python ile makine öğrenmesi, derin öğrenme, NLP ve bilgisayarlı görü.",
    },
  },
  {
    no: "03",
    name: "Data Pipelines",
    desc: {
      en: "Data engineering, ETL, Hadoop/Spark, SQL/NoSQL and the cloud.",
      tr: "Veri mühendisliği, ETL, Hadoop/Spark, SQL/NoSQL ve bulut.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    desc: {
      en: "Summits, award nights and our flagship Datathon & Hackathon.",
      tr: "Zirveler, ödül geceleri ve amiral gemimiz Datathon & Hackathon.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate",
    desc: {
      en: "Sponsorship, budgeting and relationships with industry partners.",
      tr: "Sponsorluk, bütçeleme ve sektör partnerleriyle ilişkiler.",
    },
  },
  {
    no: "06",
    name: "PR",
    desc: {
      en: "Social media, graphic design, content and media relations.",
      tr: "Sosyal medya, grafik tasarım, içerik ve medya ilişkileri.",
    },
  },
];

export interface AboutDepartment {
  no: string;
  name: string;
  purpose: Localized;
  focus: string[];
  vision: Localized;
}

export const ABOUT_DEPARTMENTS: AboutDepartment[] = [
  {
    no: "01",
    name: "Data Insights",
    purpose: {
      en: "Turn raw university and open datasets into clear decisions through exploratory analysis and business intelligence.",
      tr: "Ham üniversite ve açık veri setlerini keşifsel analiz ve iş zekâsı yoluyla net kararlara dönüştürmek.",
    },
    focus: ["EDA", "BI", "Tableau", "Power BI", "Matplotlib"],
    vision: {
      en: "Make data literacy a default skill for every Marmara student, not a specialism.",
      tr: "Veri okuryazarlığını her Marmara öğrencisi için bir uzmanlık değil, varsayılan bir beceri hâline getirmek.",
    },
  },
  {
    no: "02",
    name: "Core AI",
    purpose: {
      en: "Research and build intelligent systems — from classic ML to deep learning, language and vision.",
      tr: "Zeki sistemler araştırmak ve inşa etmek — klasik makine öğrenmesinden derin öğrenmeye, dile ve görüye kadar.",
    },
    focus: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Python"],
    vision: {
      en: "Ship student-built models that solve real problems on and off campus.",
      tr: "Kampüs içinde ve dışında gerçek problemleri çözen, öğrencilerin yaptığı modeller çıkarmak.",
    },
  },
  {
    no: "03",
    name: "Data Pipelines",
    purpose: {
      en: "Engineer the plumbing that moves, cleans and stores data reliably at scale.",
      tr: "Veriyi güvenilir biçimde ve ölçekli taşıyan, temizleyen ve depolayan altyapıyı mühendislemek.",
    },
    focus: ["Data Engineering", "ETL", "Hadoop / Spark", "SQL / NoSQL", "Cloud"],
    vision: {
      en: "Give every club project a production-grade backbone it can trust.",
      tr: "Her kulüp projesine güvenebileceği üretim düzeyinde bir omurga sağlamak.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    purpose: {
      en: "Run the events that bring the community together — summits, award nights and competitions.",
      tr: "Topluluğu bir araya getiren etkinlikleri düzenlemek — zirveler, ödül geceleri ve yarışmalar.",
    },
    focus: ["Summits", "Award Nights", "Datathon", "Hackathon"],
    vision: {
      en: "Make our Datathon the event students in Istanbul circle on their calendars.",
      tr: "Datathon'umuzu İstanbul'daki öğrencilerin takvimlerinde işaretlediği etkinlik hâline getirmek.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate Relations",
    purpose: {
      en: "Keep the club funded and connected through sponsorship, budgeting and industry partnerships.",
      tr: "Kulübü sponsorluk, bütçeleme ve sektör ortaklıklarıyla finanse ve bağlantılı tutmak.",
    },
    focus: ["Sponsorship", "Budgeting", "Corporate Relations"],
    vision: {
      en: "Build a partner network that turns into internships and first jobs for members.",
      tr: "Üyeler için staja ve ilk işlere dönüşen bir partner ağı kurmak.",
    },
  },
  {
    no: "06",
    name: "PR",
    purpose: {
      en: "Tell the club's story and grow its voice across every channel.",
      tr: "Kulübün hikâyesini anlatmak ve sesini her kanalda büyütmek.",
    },
    focus: ["Social Media", "Graphic Design", "Content", "Media Relations"],
    vision: {
      en: "Become the most recognisable student data brand in Turkey.",
      tr: "Türkiye'nin en tanınan öğrenci veri markası olmak.",
    },
  },
];
