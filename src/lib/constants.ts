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
  { num: "12", label: { en: "EVENTS / YEAR", tr: "ETKİNLİK / YIL" } },
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
      tr: "EDA, BI ve Tableau, Power BI ve Matplotlib ile veri hikâyeleştirme.",
      "tr-x-v1": "Keşifçi veri analizi (EDA), iş zekâsı (BI) ve Tableau, Power BI, Matplotlib ile veri hikayeciliği.",
      "en-x-v1": "Exploratory data analysis (EDA), business intelligence (BI), and data storytelling with Tableau, Power BI, and Matplotlib.",
    },
  },
  {
    no: "02",
    name: "Core AI",
    desc: {
      en: "Machine learning, deep learning, NLP and computer vision in Python.",
      tr: "Python ile makine öğrenmesi, derin öğrenme, NLP ve bilgisayarlı görü.",
      "tr-x-v1": "Python ile makine öğrenmesi, derin öğrenme, doğal dil işleme (NLP) ve bilgisayarlı görü.",
      "en-x-v1": "Machine learning, deep learning, natural language processing (NLP), and computer vision in Python.",
    },
  },
  {
    no: "03",
    name: "Data Pipelines",
    desc: {
      en: "Data engineering, ETL, Hadoop/Spark, SQL/NoSQL and the cloud.",
      tr: "Veri mühendisliği, ETL, Hadoop/Spark, SQL/NoSQL ve bulut teknolojileri.",
      "tr-x-v1": "Veri mühendisliği, ETL süreçleri, Hadoop/Spark, SQL/NoSQL ve bulut sistemleri.",
      "en-x-v1": "Data engineering, ETL pipelines, Hadoop/Spark, SQL/NoSQL, and cloud systems.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    desc: {
      en: "Summits, award nights and our flagship Datathon & Hackathon.",
      tr: "Zirveler, ödül geceleri ve amiral gemisi etkinliğimiz Datathon & Hackathon.",
      "tr-x-v1": "Veri bilimi zirveleri, ödül geceleri ve büyük yarışmalarımız Datathon ile Hackathon.",
      "en-x-v1": "Data science summits, award nights, and our major competitions, Datathon and Hackathon.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate",
    desc: {
      en: "Sponsorship, budgeting and relationships with industry partners.",
      tr: "Sponsorluk, bütçe yönetimi ve sektör paydaşlarıyla ilişkiler.",
      "tr-x-v1": "Sponsorluklar, bütçe yönetimi, mezun ağı ve sektör paydaşlarıyla iş ortaklıkları.",
      "en-x-v1": "Sponsorships, budgeting, alumni network, and partnerships with industry companies.",
    },
  },
  {
    no: "06",
    name: "PR",
    desc: {
      en: "Social media, graphic design, content and media relations.",
      tr: "Sosyal medya, grafik tasarım, içerik üretimi ve medya ilişkileri.",
      "tr-x-v1": "Sosyal medya, grafik tasarım, teknik içerik üretimi ve medya ilişkileri.",
      "en-x-v1": "Social media, graphic design, technical content production, and media relations.",
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
      en: "Discover and make sense of the stories hidden in raw data, turning them into strategic insights that guide decision-makers. This is the first stop where members stepping into data science build their analytical muscles.",
      tr: "Ham verinin içindeki saklı hikâyeleri keşfetmek, anlamlandırmak ve karar alıcılara rehberlik edecek stratejik öngörülere dönüştürmek. Veri bilimi dünyasına adım atan üyelerin analitik kaslarını geliştireceği ilk duraktır.",
      "tr-x-eski": "Ham verinin içindeki saklı hikâyeleri keşfetmek, anlamlandırmak ve karar alıcılara rehberlik edecek stratejik içgörülere dönüştürmek.",
      "en-x-eski": "Turn raw university and open datasets into clear decisions through exploratory analysis and business intelligence.",
      "tr-x-v1": "Ham verinin içindeki hikayeleri keşfetmek, anlamlandırmak ve karar alıcılara yol gösterecek öngörülere dönüştürmek. Veri bilimi dünyasına adım atan üyelerin analitik kaslarını geliştireceği ilk duraktır.",
      "en-x-v1": "Uncover and interpret the stories hidden in raw data, turning them into clear insights that guide decision-makers. This is the first stop where members entering data science build their analytical foundation.",
    },
    focus: ["Exploratory Data Analysis (EDA)", "Data cleaning", "Statistical inference", "Business Intelligence (BI)", "Data visualization", "Data storytelling", "Tableau", "Power BI", "Matplotlib / Seaborn"],
    focusByLocale: {
      tr: ["Keşifçi Veri Analizi (EDA)", "Veri temizleme", "İstatistiksel çıkarımlar", "İş zekâsı (BI)", "Veri görselleştirme", "Veri hikâyeleştirme", "Tableau", "Power BI", "Matplotlib / Seaborn"],
      "en-x-eski": ["EDA", "BI", "Tableau", "Power BI", "Matplotlib"],
      "tr-x-v1": ["Keşifçi Veri Analizi (EDA)", "Veri temizleme", "İstatistiksel çıkarımlar", "İş zekâsı (BI)", "Veri görselleştirme ve hikayeciliği", "Tableau", "Power BI", "Matplotlib / Seaborn"],
      "en-x-v1": ["Exploratory Data Analysis (EDA)", "Data cleaning", "Statistical inference", "Business Intelligence (BI)", "Data visualization & storytelling", "Tableau", "Power BI", "Matplotlib / Seaborn"],
    },
    vision: {
      en: "Train analysts with strong data literacy who don't just present charts to internal and external stakeholders, but give the clearest and most compelling answers to the question, \"What is the data telling us?\"",
      tr: "Kulüp içindeki ve dışındaki paydaşlara yalnızca grafikler sunan değil, “Veri ne anlatıyor?” sorusuna en net ve çarpıcı yanıtları veren, veri okuryazarlığı yüksek analistler yetiştirmek.",
      "en-x-eski": "Make data literacy a default skill for every Marmara student, not a specialism.",
      "tr-x-v1": "Kulüp içindeki ve dışındaki paydaşlara grafik sunmanın ötesine geçip \"Veri ne anlatıyor?\" sorusuna en net ve çarpıcı yanıtları veren, veri okuryazarlığı yüksek analistler yetiştirmek.",
      "en-x-v1": "Go beyond simply presenting charts to internal and external stakeholders, and train analysts with strong data literacy who give the clearest answers to the question, \"What is the data telling us?\"",
    },
  },
  {
    no: "02",
    name: "Core AI",
    purpose: {
      en: "Bring AI technologies from theory into practice by developing advanced algorithms and mathematical models, and take them into Kaggle competitions and projects as teams. This is the club's deepest, most technical, and modeling-focused AI kitchen.",
      tr: "İleri düzey algoritmalar ve matematiksel modeller geliştirerek yapay zekâ teknolojilerini teoriden pratiğe dökmek; ayrıca takımlar hâlinde Kaggle platformundaki yarışmalara ve projelere taşımak. Bu kulübün en derin, teknik ve modelleme odaklı yapay zekâ mutfağıdır.",
      "tr-x-eski": "İleri düzey algoritmalar ve matematiksel modeller geliştirerek yapay zekâ teknolojilerini teoriden pratiğe taşımak; bunları ekipler hâlinde Kaggle yarışmalarına ve projelere uygulamak.",
      "en-x-eski": "Research and build intelligent systems — from classic ML to deep learning, language and vision.",
      "tr-x-v1": "İleri düzey algoritmalar ve matematiksel modeller geliştirerek yapay zekâ teknolojilerini teoriden pratiğe dökmek; takımlar halinde Kaggle yarışmalarına ve gerçek projelere taşımak. Kulübün en derin, teknik ve modelleme odaklı yapay zekâ mutfağıdır.",
      "en-x-v1": "Put artificial intelligence into practice by developing advanced algorithms and mathematical models, and take them into Kaggle competitions and real projects as teams. This is the club's deepest technical modeling kitchen.",
    },
    focus: ["Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", "Computer Vision", "Python", "Scikit-Learn", "TensorFlow", "PyTorch"],
    focusByLocale: {
      tr: ["Makine Öğrenmesi", "Derin Öğrenme", "Doğal Dil İşleme (NLP)", "Bilgisayarlı Görü", "Python", "Scikit-Learn", "TensorFlow", "PyTorch"],
      "en-x-eski": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Python"],
    },
    vision: {
      en: "Create an AI engineering culture that doesn't just consume AI, but designs original models, closely tracks global trends (LLMs, Generative AI), and adds real value through the algorithms it builds.",
      tr: "Yapay zekâyı yalnızca tüketen değil, özgün modeller tasarlayan, küresel trendleri (LLM'ler, Generative AI) yakından takip eden ve ürettiği algoritmalarla katma değer sağlayan bir yapay zekâ mühendisliği ekolü yaratmak.",
      "tr-x-eski": "Yapay zekâyı yalnızca tüketen değil, özgün modeller tasarlayan, küresel trendleri (LLM'ler, Generative AI) yakından takip eden ve geliştirdiği algoritmalarla katma değer üreten bir yapay zekâ mühendisliği kültürü oluşturmak.",
      "en-x-eski": "Ship student-built models that solve real problems on and off campus.",
      "tr-x-v1": "Hazır yapay zekâ araçlarını kullanmakla yetinmeyip özgün modeller tasarlayan, güncel yaklaşımları (LLM'ler, üretken yapay zekâ) yakından takip eden ve geliştirdiği algoritmalarla somut fayda üreten bir yapay zekâ mühendisliği ekolü kurmak.",
      "en-x-v1": "Build an AI engineering culture that goes beyond using off-the-shelf tools to design original models, closely track global developments (LLMs, generative AI), and create real value through the algorithms it builds.",
    },
  },
  {
    no: "03",
    name: "Data Pipelines",
    purpose: {
      en: "Build the digital highways (data pipelines) that keep millions of rows of big data flowing safely, quickly, and without interruption. It prepares the clean data infrastructure that the Core AI and Data Insights teams need to work.",
      tr: "Milyonlarca satırlık büyük verilerin güvenli, hızlı ve kesintisiz akışını sağlayacak dijital otoyolları (veri hatlarını) inşa etmek. Core AI ve Data Insights ekiplerinin çalışabilmesi için gerekli olan temiz veri altyapısını hazırlar.",
      "tr-x-eski": "Milyonlarca satırlık verinin güvenli, hızlı ve kesintisiz akışını sağlayan veri hatlarını inşa etmek. Core AI ve Data Insights ekiplerinin ihtiyaç duyduğu temiz veri altyapısını hazırlamak.",
      "en-x-eski": "Engineer the plumbing that moves, cleans and stores data reliably at scale.",
      "tr-x-v1": "Milyonlarca satırlık büyük verinin güvenli, hızlı ve kesintisiz akışını sağlayan veri hatlarını kurmak. Core AI ve Data Insights ekiplerinin çalışabilmesi için gereken temiz veri altyapısını hazırlar.",
      "en-x-v1": "Build the data pipelines that keep millions of rows of big data flowing safely, quickly, and without interruption. This team prepares the clean data infrastructure that Core AI and Data Insights rely on.",
    },
    focus: ["Data Engineering", "ETL processes", "Big data (Hadoop, Spark)", "Database management (SQL, NoSQL)", "Web scraping", "Cloud (AWS, Google Cloud)"],
    focusByLocale: {
      tr: ["Veri Mühendisliği", "ETL süreçleri", "Büyük veri (Hadoop, Spark)", "Veri tabanı yönetimi (SQL, NoSQL)", "Web scraping", "Bulut (AWS, Google Cloud)"],
      "en-x-eski": ["Data Engineering", "ETL", "Hadoop / Spark", "SQL / NoSQL", "Cloud"],
      "tr-x-v1": ["Veri Mühendisliği", "ETL süreçleri", "Büyük veri mimarileri (Hadoop, Spark)", "Veri tabanı yönetimi (SQL, NoSQL)", "Web scraping", "Bulut sistemleri (AWS, Google Cloud)"],
      "en-x-v1": ["Data Engineering", "ETL pipelines", "Big data architectures (Hadoop, Spark)", "Database management (SQL, NoSQL)", "Web scraping", "Cloud systems (AWS, Google Cloud)"],
    },
    vision: {
      en: "Train system architects who turn \"big data\" chaos into organized, workable systems and build scalable infrastructure architectures that put the club in a leading position in data engineering.",
      tr: "“Büyük veri” kaosunu düzenli ve işlenebilir bir sisteme dönüştüren, ölçeklenebilir altyapı mimarileri kurarak kulübü veri mühendisliği alanında lider konuma taşıyan sistem mimarları yetiştirmek.",
      "tr-x-eski": "“Büyük veri” kaosunu düzenli ve işlenebilir sistemlere dönüştüren, ölçeklenebilir altyapılar kuran ve kulübü veri mühendisliği alanında ileri taşıyan sistem mimarları yetiştirmek.",
      "en-x-eski": "Give every club project a production-grade backbone it can trust.",
      "tr-x-v1": "Büyük veri karmaşasını düzenli ve işlenebilir bir sisteme dönüştüren, ölçeklenebilir altyapı mimarileri kurarak kulübü veri mühendisliği alanında öne taşıyan sistem mimarları yetiştirmek.",
      "en-x-v1": "Train system architects who turn big data chaos into organized, workable systems and build scalable architectures that put the club at the forefront of data engineering.",
    },
  },
  {
    no: "04",
    name: "Summits & Awards",
    purpose: {
      en: "Design and run the club's signature large-scale events, national prize-winning data competitions (Datathon/Hackathon), and the year's most prestigious data science summits from start to finish.",
      tr: "Kulübün imza niteliğindeki makro etkinliklerini, ulusal çapta ses getirecek büyük ödüllü veri yarışmalarını (Datathon/Hackathon) ve yılın en prestijli veri bilimi zirvelerini baştan sona kurgulamak ve yönetmek.",
      "tr-x-eski": "Kulübün imza niteliğindeki büyük etkinliklerini, ulusal çapta ses getirecek veri yarışmalarını (Datathon/Hackathon) ve veri bilimi zirvelerini baştan sona kurgulamak ve yönetmek.",
      "en-x-eski": "Run the events that bring the community together — summits, award nights and competitions.",
      "tr-x-v1": "Kulübün büyük ölçekli etkinliklerini, ulusal çapta ses getirecek ödüllü veri yarışmalarını (Datathon/Hackathon) ve yılın öne çıkan veri bilimi zirvelerini baştan sona kurgulamak ve yönetmek.",
      "en-x-v1": "Design and run the club's major events from start to finish, including national prize-winning data competitions (Datathon/Hackathon) and flagship data science summits.",
    },
    focus: ["Summit planning", "Award nights", "Datathon", "Hackathon", "Operations and logistics"],
    focusByLocale: {
      tr: ["Zirve planlaması", "Ödül geceleri", "Datathon", "Hackathon", "Organizasyon ve lojistik"],
      "en-x-eski": ["Summits", "Award Nights", "Datathon", "Hackathon"],
      "tr-x-v1": ["Yıllık zirve planlaması (Summit)", "Ödül geceleri (Awards)", "Datathon", "Hackathon", "Saha organizasyonu ve lojistik"],
      "en-x-v1": ["Annual summit planning", "Award nights", "Datathon", "Hackathon", "On-site operations & logistics"],
    },
    vision: {
      en: "Turn Marmara University into Turkey's most prestigious event hub for data science, and design seamless participant experiences that bring industry and academia together.",
      tr: "Marmara Üniversitesi'ni Türkiye'nin veri bilimi alanındaki en prestijli etkinlik merkezi hâline getirmek; sektörü ve akademiyi buluşturan kusursuz katılımcı deneyimleri tasarlamak.",
      "tr-x-eski": "Marmara Üniversitesi'ni Türkiye'nin veri bilimi alanındaki en prestijli etkinlik merkezlerinden biri hâline getirmek; sektör ve akademiyi buluşturan kusursuz katılımcı deneyimleri tasarlamak.",
      "en-x-eski": "Make our Datathon the event students in Istanbul circle on their calendars.",
      "tr-x-v1": "Marmara Üniversitesi'ni Türkiye'nin veri bilimi alanındaki en saygın etkinlik merkezlerinden biri haline getirmek; sektörü ve akademiyi buluşturan iyi kurgulanmış katılımcı deneyimleri tasarlamak.",
      "en-x-v1": "Turn Marmara University into one of Turkey's leading event hubs for data science and design well-crafted participant experiences that bring industry and academia together.",
    },
  },
  {
    no: "05",
    name: "Finance & Corporate Relations",
    purpose: {
      en: "Ensure the club's financial sustainability, manage the budget, and build strategic sponsorships and partnerships with technopark companies and global enterprises for our major projects (summit, award night, Datathon).",
      tr: "Kulübün tüm finansal sürdürülebilirliğini sağlamak, bütçe yönetimini yapmak ve büyük projelerimiz (zirve, ödül gecesi, Datathon) için teknokent firmaları ve global şirketlerle stratejik sponsorluklar ve iş ortaklıkları kurmak.",
      "tr-x-eski": "Kulübün finansal sürdürülebilirliğini sağlamak, bütçeyi yönetmek ve büyük projeler için teknokent firmaları ve global şirketlerle stratejik sponsorluklar ve iş ortaklıkları kurmak.",
      "en-x-eski": "Keep the club funded and connected through sponsorship, budgeting and industry partnerships.",
      "tr-x-v1": "Kulübün finansal sürdürülebilirliğini sağlamak, bütçe yönetimini yapmak ve büyük projelerimiz (zirve, ödül gecesi, Datathon) için teknokent firmaları ve küresel şirketlerle sponsorluk ve iş ortaklıkları kurmak.",
      "en-x-v1": "Maintain the club's financial sustainability, manage the budget, and build sponsorships and partnerships with technopark companies and global enterprises for our major projects (summits, award nights, Datathon).",
    },
    focus: ["Sponsorship decks", "Corporate presentations", "Budget planning", "Cash flow management", "Internship and career bridges", "Alumni network"],
    focusByLocale: {
      tr: ["Sponsorluk dosyaları", "Kurumsal sunumlar", "Bütçe planlaması", "Nakit akışı yönetimi", "Staj ve istihdam köprüleri", "Mezun ağı"],
      "en-x-eski": ["Sponsorship", "Budgeting", "Corporate Relations"],
      "tr-x-v1": ["Sponsorluk dosyaları", "Kurumsal şirket sunumları", "Bütçe planlaması", "Nakit akışı yönetimi", "Staj ve istihdam köprüleri", "Mezun ağı yönetimi"],
      "en-x-v1": ["Sponsorship decks", "Corporate presentations", "Budget planning", "Cash flow management", "Internship & career bridges", "Alumni network management"],
    },
    vision: {
      en: "Make the club financially independent and self-sustaining, so corporate companies view the Marmara Data Science Club not as a \"student group,\" but as a professional \"strategic partner.\"",
      tr: "Kulübü finansal açıdan tamamen bağımsız ve kendi kendine yeten bir yapıya ulaştırmak; kurumsal şirketlerin Marmara Veri Bilimi Kulübü'nü bir “öğrenci topluluğu” olarak değil, profesyonel bir “stratejik partner” olarak görmesini sağlamak.",
      "tr-x-eski": "Kulübü finansal açıdan bağımsız ve kendi kendine yeten bir yapıya ulaştırmak; kurumsal şirketlerin Marmara Veri Bilimi Kulübü'nü bir “öğrenci topluluğu” olarak değil, profesyonel bir stratejik partner olarak görmesini sağlamak.",
      "en-x-eski": "Build a partner network that turns into internships and first jobs for members.",
      "tr-x-v1": "Kulübü finansal açıdan bağımsız ve kendi kendine yeten bir yapıya ulaştırmak; kurumsal şirketlerin Marmara Veri Bilimi Kulübü'nü klasik bir öğrenci topluluğu yerine profesyonel bir iş ortağı olarak görmesini sağlamak.",
      "en-x-v1": "Make the club financially independent and self-sustaining, so corporate companies see the Marmara Data Science Club as a professional partner rather than a typical student group.",
    },
  },
  {
    no: "06",
    name: "PR",
    purpose: {
      en: "Be the club's outward-facing showcase, voice, and face; communicate the technical projects we build, the major events we run, and our brand identity to the community and industry in the sharpest, most effective way.",
      tr: "Kulübün dış dünyaya açılan vitrini, sesi ve yüzü olmak; kulübün ürettiği teknik projeleri, düzenlediği büyük etkinlikleri ve marka kimliğini topluluğa ve sektöre en estetik ve en doğru dille anlatmak.",
      "tr-x-eski": "Kulübün dış dünyaya açılan vitrini, sesi ve yüzü olmak; teknik projeleri, büyük etkinlikleri ve marka kimliğini topluluğa ve sektöre en doğru ve etkili şekilde anlatmak.",
      "en-x-eski": "Tell the club's story and grow its voice across every channel.",
      "tr-x-v1": "Kulübün dış dünyaya açılan vitrini, sesi ve yüzü olmak. Kulübün ürettiği teknik projeleri, düzenlediği büyük etkinlikleri ve marka kimliğini topluluğa ve sektöre en estetik ve doğru dille anlatmak.",
      "en-x-v1": "Serve as the club's outward-facing showcase, voice, and face. Communicate the club's technical projects, major events, and brand identity to the community and industry with a clear and well-crafted voice.",
    },
    focus: ["Social media management", "Graphic design", "Brand identity and corporate voice", "Video and content production", "Crisis communications", "Media relations"],
    focusByLocale: {
      tr: ["Sosyal medya yönetimi", "Grafik tasarım", "Marka kimliği ve kurumsal dil", "Video ve içerik üretimi", "Kriz iletişimi", "Medya ilişkileri"],
      "en-x-eski": ["Social Media", "Graphic Design", "Content", "Media Relations"],
      "tr-x-v1": ["Sosyal medya yönetimi (LinkedIn, Instagram, Medium)", "Grafik tasarım", "Marka kimliği ve kurumsal dil", "Video ve içerik üretimi", "Kriz iletişimi", "Medya ilişkileri"],
      "en-x-v1": ["Social media management (LinkedIn, Instagram, Medium)", "Graphic design", "Brand identity & tone of voice", "Video & content production", "Crisis communications", "Media relations"],
    },
    vision: {
      en: "Position our club's image with the clarity of a tech startup, and take the club's brand value to the top by turning the complex code and analyses produced by our technical teams into striking infographics and technical blog posts.",
      tr: "Kulübün imajını bir teknoloji startup'ı netliğinde konumlandırmak; teknik ekiplerin ürettiği karmaşık kodları ve analizleri çarpıcı infografiklerle ve teknik blog yazılarıyla görünür kılarak kulübün marka değerini zirveye çıkarmak.",
      "tr-x-eski": "Kulübün imajını bir teknoloji start-up'ı netliğinde konumlandırmak; teknik ekiplerin ürettiği karmaşık kodları ve analizleri çarpıcı infografikler ve teknik içeriklerle görünür kılarak kulübün marka değerini yükseltmek.",
      "en-x-eski": "Become the most recognisable student data brand in Turkey.",
      "tr-x-v1": "Kulübümüzün imajını bir teknoloji startup'ı netliğinde konumlandırmak; teknik ekiplerin çıkardığı karmaşık kodları ve analizleri çarpıcı infografiklerle ve teknik blog yazılarıyla görünür kılarak kulübün marka değerini büyütmek.",
      "en-x-v1": "Position our club's image with the clarity of a tech startup, and grow our brand value by turning the complex code and analyses built by our technical teams into clear infographics and technical blog posts.",
    },
  },
];

/** About page: how work moves between the departments, step by step (from the club's infrastructure deck). */
export interface AboutFlowStep {
  name: string;
  text: Localized;
}

export const ABOUT_FLOW: AboutFlowStep[] = [
  {
    name: "Data Pipelines",
    text: {
      en: "Data Pipelines collects and cleans the raw data.",
      tr: "Data Pipelines ham veriyi toplar ve temizler.",
    },
  },
  {
    name: "Core AI",
    text: {
      en: "Core AI trains models on that data.",
      tr: "Core AI bu veriyle modelleri eğitir.",
    },
  },
  {
    name: "Data Insights",
    text: {
      en: "Data Insights analyzes and visualizes the model outputs.",
      tr: "Data Insights model sonuçlarını analiz edip görselleştirir.",
    },
  },
  {
    name: "Summits & Awards",
    text: {
      en: "Summits & Awards designs major datathons, award nights, and summits.",
      tr: "Summits & Awards büyük ölçekli datathon, ödül gecesi ve zirve kurgularını geliştirir.",
    },
  },
  {
    name: "Finance & Corporate Relations",
    text: {
      en: "Finance & Corporate Relations secures corporate sponsorships and prize pool budgets for these events.",
      tr: "Finance & Corporate Relations bu etkinlikler için şirketlerden sponsorluk ve ödül havuzu bütçesi sağlar.",
    },
  },
  {
    name: "PR",
    text: {
      en: "The PR department announces the event across Turkey and brings in hundreds of applications.",
      tr: "PR departmanı etkinliği tüm Türkiye'ye duyurarak yüzlerce başvuru toplar.",
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
