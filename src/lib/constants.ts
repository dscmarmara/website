import type { Localized } from "@/lib/members";

export const SOCIALS = {
  linkedin: "https://www.linkedin.com/company/datascienceclub-marmara",
  instagram: "https://www.instagram.com/dsc.marmara",
  github: "https://github.com/dscmarmara",
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
  { num: "12", label: { en: "EVENTS / YEAR", tr: "YILLIK ETKİNLİK", "tr-x-yeni": "ETKİNLİK / YIL" } },
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
      "tr-x-yeni": "EDA, BI ve Tableau, Power BI ve Matplotlib ile veri hikâyeleştirme.",
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
      "tr-x-yeni": "Veri mühendisliği, ETL, Hadoop/Spark, SQL/NoSQL ve bulut teknolojileri.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    desc: {
      en: "Summits, award nights and our flagship Datathon & Hackathon.",
      tr: "Zirveler, ödül geceleri ve amiral gemimiz Datathon & Hackathon.",
      "tr-x-yeni": "Zirveler, ödül geceleri ve amiral gemisi etkinliğimiz Datathon & Hackathon.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate",
    desc: {
      en: "Sponsorship, budgeting and relationships with industry partners.",
      tr: "Sponsorluk, bütçeleme ve sektör partnerleriyle ilişkiler.",
      "tr-x-yeni": "Sponsorluk, bütçe yönetimi ve sektör paydaşlarıyla ilişkiler.",
    },
  },
  {
    no: "06",
    name: "PR",
    desc: {
      en: "Social media, graphic design, content and media relations.",
      tr: "Sosyal medya, grafik tasarım, içerik ve medya ilişkileri.",
      "tr-x-yeni": "Sosyal medya, grafik tasarım, içerik üretimi ve medya ilişkileri.",
    },
  },
];

export interface AboutDepartment {
  no: string;
  name: string;
  purpose: Localized;
  focus: string[];
  /** Focus chips for a specific locale code; locales without an entry use `focus`. */
  focusByLocale?: Partial<Record<string, string[]>>;
  vision: Localized;
}

export const ABOUT_DEPARTMENTS: AboutDepartment[] = [
  {
    no: "01",
    name: "Data Insights",
    purpose: {
      en: "Turn raw university and open datasets into clear decisions through exploratory analysis and business intelligence.",
      tr: "Ham üniversite ve açık veri setlerini keşifsel analiz ve iş zekâsı yoluyla net kararlara dönüştürmek.",
      "tr-x-yeni": "Ham verinin içindeki saklı hikâyeleri keşfetmek, anlamlandırmak ve karar alıcılara rehberlik edecek stratejik içgörülere dönüştürmek.",
    },
    focus: ["EDA", "BI", "Tableau", "Power BI", "Matplotlib"],
    focusByLocale: {
      "tr-x-yeni": ["Keşifçi Veri Analizi (EDA)", "Veri temizleme", "İstatistiksel çıkarımlar", "İş zekâsı (BI)", "Veri görselleştirme", "Veri hikâyeleştirme", "Tableau", "Power BI", "Matplotlib / Seaborn"],
    },
    vision: {
      en: "Make data literacy a default skill for every Marmara student, not a specialism.",
      tr: "Veri okuryazarlığını her Marmara öğrencisi için bir uzmanlık değil, varsayılan bir beceri hâline getirmek.",
      "tr-x-yeni": "Kulüp içindeki ve dışındaki paydaşlara yalnızca grafikler sunan değil, “Veri ne anlatıyor?” sorusuna en net ve çarpıcı yanıtları veren, veri okuryazarlığı yüksek analistler yetiştirmek.",
    },
  },
  {
    no: "02",
    name: "Core AI",
    purpose: {
      en: "Research and build intelligent systems — from classic ML to deep learning, language and vision.",
      tr: "Zeki sistemler araştırmak ve inşa etmek — klasik makine öğrenmesinden derin öğrenmeye, dile ve görüye kadar.",
      "tr-x-yeni": "İleri düzey algoritmalar ve matematiksel modeller geliştirerek yapay zekâ teknolojilerini teoriden pratiğe taşımak; bunları ekipler hâlinde Kaggle yarışmalarına ve projelere uygulamak.",
    },
    focus: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Python"],
    focusByLocale: {
      "tr-x-yeni": ["Makine Öğrenmesi", "Derin Öğrenme", "Doğal Dil İşleme (NLP)", "Bilgisayarlı Görü", "Python", "Scikit-Learn", "TensorFlow", "PyTorch"],
    },
    vision: {
      en: "Ship student-built models that solve real problems on and off campus.",
      tr: "Kampüs içinde ve dışında gerçek problemleri çözen, öğrencilerin yaptığı modeller çıkarmak.",
      "tr-x-yeni": "Yapay zekâyı yalnızca tüketen değil, özgün modeller tasarlayan, küresel trendleri (LLM'ler, Generative AI) yakından takip eden ve geliştirdiği algoritmalarla katma değer üreten bir yapay zekâ mühendisliği kültürü oluşturmak.",
    },
  },
  {
    no: "03",
    name: "Data Pipelines",
    purpose: {
      en: "Engineer the plumbing that moves, cleans and stores data reliably at scale.",
      tr: "Veriyi güvenilir biçimde ve ölçekli taşıyan, temizleyen ve depolayan altyapıyı mühendislemek.",
      "tr-x-yeni": "Milyonlarca satırlık verinin güvenli, hızlı ve kesintisiz akışını sağlayan veri hatlarını inşa etmek. Core AI ve Data Insights ekiplerinin ihtiyaç duyduğu temiz veri altyapısını hazırlamak.",
    },
    focus: ["Data Engineering", "ETL", "Hadoop / Spark", "SQL / NoSQL", "Cloud"],
    focusByLocale: {
      "tr-x-yeni": ["Veri Mühendisliği", "ETL süreçleri", "Büyük veri (Hadoop, Spark)", "Veri tabanı yönetimi (SQL, NoSQL)", "Web scraping", "Bulut (AWS, Google Cloud)"],
    },
    vision: {
      en: "Give every club project a production-grade backbone it can trust.",
      tr: "Her kulüp projesine güvenebileceği üretim düzeyinde bir omurga sağlamak.",
      "tr-x-yeni": "“Büyük veri” kaosunu düzenli ve işlenebilir sistemlere dönüştüren, ölçeklenebilir altyapılar kuran ve kulübü veri mühendisliği alanında ileri taşıyan sistem mimarları yetiştirmek.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    purpose: {
      en: "Run the events that bring the community together — summits, award nights and competitions.",
      tr: "Topluluğu bir araya getiren etkinlikleri düzenlemek — zirveler, ödül geceleri ve yarışmalar.",
      "tr-x-yeni": "Kulübün imza niteliğindeki büyük etkinliklerini, ulusal çapta ses getirecek veri yarışmalarını (Datathon/Hackathon) ve veri bilimi zirvelerini baştan sona kurgulamak ve yönetmek.",
    },
    focus: ["Summits", "Award Nights", "Datathon", "Hackathon"],
    focusByLocale: {
      "tr-x-yeni": ["Zirve planlaması", "Ödül geceleri", "Datathon", "Hackathon", "Organizasyon ve lojistik"],
    },
    vision: {
      en: "Make our Datathon the event students in Istanbul circle on their calendars.",
      tr: "Datathon'umuzu İstanbul'daki öğrencilerin takvimlerinde işaretlediği etkinlik hâline getirmek.",
      "tr-x-yeni": "Marmara Üniversitesi'ni Türkiye'nin veri bilimi alanındaki en prestijli etkinlik merkezlerinden biri hâline getirmek; sektör ve akademiyi buluşturan kusursuz katılımcı deneyimleri tasarlamak.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate Relations",
    purpose: {
      en: "Keep the club funded and connected through sponsorship, budgeting and industry partnerships.",
      tr: "Kulübü sponsorluk, bütçeleme ve sektör ortaklıklarıyla finanse ve bağlantılı tutmak.",
      "tr-x-yeni": "Kulübün finansal sürdürülebilirliğini sağlamak, bütçeyi yönetmek ve büyük projeler için teknokent firmaları ve global şirketlerle stratejik sponsorluklar ve iş ortaklıkları kurmak.",
    },
    focus: ["Sponsorship", "Budgeting", "Corporate Relations"],
    focusByLocale: {
      "tr-x-yeni": ["Sponsorluk dosyaları", "Kurumsal sunumlar", "Bütçe planlaması", "Nakit akışı yönetimi", "Staj ve istihdam köprüleri", "Mezun ağı"],
    },
    vision: {
      en: "Build a partner network that turns into internships and first jobs for members.",
      tr: "Üyeler için staja ve ilk işlere dönüşen bir partner ağı kurmak.",
      "tr-x-yeni": "Kulübü finansal açıdan bağımsız ve kendi kendine yeten bir yapıya ulaştırmak; kurumsal şirketlerin Marmara Veri Bilimi Kulübü'nü bir “öğrenci topluluğu” olarak değil, profesyonel bir stratejik partner olarak görmesini sağlamak.",
    },
  },
  {
    no: "06",
    name: "PR",
    purpose: {
      en: "Tell the club's story and grow its voice across every channel.",
      tr: "Kulübün hikâyesini anlatmak ve sesini her kanalda büyütmek.",
      "tr-x-yeni": "Kulübün dış dünyaya açılan vitrini, sesi ve yüzü olmak; teknik projeleri, büyük etkinlikleri ve marka kimliğini topluluğa ve sektöre en doğru ve etkili şekilde anlatmak.",
    },
    focus: ["Social Media", "Graphic Design", "Content", "Media Relations"],
    focusByLocale: {
      "tr-x-yeni": ["Sosyal medya yönetimi", "Grafik tasarım", "Marka kimliği ve kurumsal dil", "Video ve içerik üretimi", "Kriz iletişimi", "Medya ilişkileri"],
    },
    vision: {
      en: "Become the most recognisable student data brand in Turkey.",
      tr: "Türkiye'nin en tanınan öğrenci veri markası olmak.",
      "tr-x-yeni": "Kulübün imajını bir teknoloji start-up'ı netliğinde konumlandırmak; teknik ekiplerin ürettiği karmaşık kodları ve analizleri çarpıcı infografikler ve teknik içeriklerle görünür kılarak kulübün marka değerini yükseltmek.",
    },
  },
];

/**
 * WhatsApp number shop orders go to: country code + number, digits only
 * (e.g. 905xxxxxxxxx). PLACEHOLDER — replace with the club's number before launch.
 */
export const SHOP_WHATSAPP = "905555555555";

export interface ShopProduct {
  id: string;
  /** Which placeholder drawing to show until there is a product photo. */
  art: "tshirt" | "hoodie" | "cap";
  name: Localized;
  desc: Localized;
  /** In TRY. */
  price: number;
  /** Empty for one-size items. */
  sizes: string[];
}

// Example prices and copy — replace with the real ones before launch.
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "tshirt",
    art: "tshirt",
    name: { en: "DSC T-Shirt", tr: "DSC Tişört" },
    desc: {
      en: "Heavyweight cotton tee with the DSC logo on the chest.",
      tr: "Göğsünde DSC logosu olan kalın pamuklu tişört.",
    },
    price: 350,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "hoodie",
    art: "hoodie",
    name: { en: "DSC Hoodie", tr: "DSC Hoodie" },
    desc: {
      en: "Black hoodie with the club wordmark across the front.",
      tr: "Önünde kulüp yazısı olan siyah hoodie.",
    },
    price: 750,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zip-hoodie",
    art: "hoodie",
    name: { en: "DSC Zip Hoodie", tr: "DSC Fermuarlı Hoodie" },
    desc: {
      en: "Full-zip hoodie with a small logo on the chest and a large one on the back.",
      tr: "Göğsünde küçük, sırtında büyük logo olan fermuarlı hoodie.",
    },
    price: 850,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "cap",
    art: "cap",
    name: { en: "DSC Cap", tr: "DSC Şapka" },
    desc: {
      en: "Embroidered logo, adjustable strap.",
      tr: "Nakış logolu, ayarlanabilir şapka.",
    },
    price: 300,
    sizes: [],
  },
];
