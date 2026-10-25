# DSC Marmara: sitedeki Türkçe ve İngilizce metinler

> Bu dosya otomatik üretilir (2026-10-25); elle düzenleme. Bir metni değiştirmek için
> `TRANSLATIONS.md`'de gösterilen dosyayı düzenle, sonra `npm run site-texts` ile bu dosyayı yenile.
>
> Dahil değil: üyelerin kendi yazdığı biyografi ve alıntılar, blog yazıları, mağaza, gizli KPI etiketleri,
> DEV OPTIONS şeridi ve ESKİ metinler. Anahtar sütunu metnin dosyadaki yeridir (`messages/tr.json` / `en.json`).

## 1. Sekme başlıkları ve arama motoru açıklamaları

| Anahtar | Türkçe | English |
|---|---|---|
| `metadata.defaultTitle` | DSC Marmara · Marmara Üniversitesi Veri Bilimi Kulübü | DSC Marmara · Marmara University Data Science Club |
| `metadata.titleTemplate` | %s · DSC Marmara | %s · DSC Marmara |
| `metadata.defaultDescription` | Marmara Üniversitesi Veri Bilimi Kulübü, geleneksel öğrenci kulübü kalıplarını yıkıyor; küresel teknoloji toplulukları ve çevik startup'larla aynı dili konuşuyor. | The Data Science Club of Marmara University breaks traditional student-club molds and speaks the same language as global tech communities and agile startups. |
| `metadata.home.title` | Anasayfa | Home |
| `metadata.home.description` | Startup gibi düşünen veri kulübü. Marmara Üniversitesi'nde altı departman, gerçek projeler ve seni üreten biri olarak gören bir öğrenci topluluğu. | The data club that thinks like a startup. Six departments, real projects, and a student community at Marmara University that treats you like a builder. |
| `metadata.about.title` | Hakkımızda: Hikâyemiz ve Departmanlarımız | About Us: Our Story and Departments |
| `metadata.about.description` | Biz bir kulüp değiliz, bir üretim ekibiyiz. Altı departmanımız: Data Insights, Core AI, Data Pipelines, Summits & Awards, Finance & Corporate Relations ve PR. | We're not a club, we're a build crew. Our six departments: Data Insights, Core AI, Data Pipelines, Summits & Awards, Finance & Corporate Relations and PR. |
| `metadata.team.title` | Ekibimiz: Yönetim ve Departman Direktörleri | Our Team: Leadership and Department Directors |
| `metadata.team.description` | DSC Marmara'nın yönetim ekibi: başkan, başkan yardımcısı, sekreter ve altı departmanın her birini yöneten iki direktörle tanışın. | Meet the team behind DSC Marmara: the president, vice president, secretary, and the two directors leading each of the six departments. |
| `metadata.blog.title` | Blog & Köşe Yazıları | Blog & Columns |
| `metadata.blog.description` | DSC Marmara blogu: veriyle çalışan öğrencilerden gerçek görüşler, saha notları ve deneyimler. Üretim ekibinden köşe yazıları. | The DSC Marmara blog: real opinions, field notes, and lessons from students working with data. Columns from the build crew. |
| `metadata.contact.title` | İletişim: Üyelik, Projeler ve Sponsorluk | Contact: Membership, Projects and Sponsorship |
| `metadata.contact.description` | DSC Marmara'ya katılmak, projelerimize ortak olmak ya da sponsor olmak mı istiyorsun? Bize bir mesaj bırak; her mesajı gerçek bir öğrenci okuyor. | Want to join DSC Marmara, collaborate on a project, or sponsor us? Leave us a message. A real student reads every message. |
| `metadata.notFound.title` | Sayfa bulunamadı | Page not found |
| `metadata.notFound.description` | Aradığın sayfa bulunamadı. | The page you were looking for doesn't exist. |
| `metadata.member.description` | {name}: {tagline} DSC Marmara, Marmara Üniversitesi Veri Bilimi Kulübü. | {name}: {tagline} DSC Marmara, the Marmara University Data Science Club. |
| `metadata.jobTitle.president` | Kulüp Başkanı | President |
| `metadata.jobTitle.vicePresident` | Başkan Yardımcısı | Vice President |
| `metadata.jobTitle.secretary` | Sekreter | Secretary |
| `metadata.jobTitle.director` | {dept} Eş Direktörü | Co-director, {dept} |

## 2. Menü ve logo

| Anahtar | Türkçe | English |
|---|---|---|
| `nav.home` | Anasayfa | Home |
| `nav.about` | Hakkımızda | About |
| `nav.team` | Ekip | Team |
| `nav.blog` | Blog | Blog |
| `nav.contact` | İletişim | Contact |
| `nav.openMenu` | Menüyü aç | Open menu |
| `nav.closeMenu` | Menüyü kapat | Close menu |
| `nav.english` | English | English |
| `nav.turkish` | Türkçe | Türkçe |
| `brand.title` | Data Science Club | Data Science Club |
| `brand.university` | Marmara Üniversitesi | Marmara University |

## 3. Anasayfa

| Anahtar | Türkçe | English |
|---|---|---|
| `home.heroTitle` | Startup gibi düşünen veri kulübü. | The data club that thinks like a startup. |
| `home.heroSub` | Geleneksel öğrenci kulübü kalıplarını yıkıyor; küresel teknoloji toplulukları ve çevik teknoloji startup'larıyla aynı dili konuşan modern bir yapı inşa ediyoruz. | Breaking traditional student-club molds and building a modern structure that speaks the same language as global tech communities and agile tech startups. |
| `home.joinUs` | Aramıza Katıl | Join Us |
| `home.exploreBlog` | Blogu Keşfet → | Explore the Blog → |
| `home.whoEyebrow` | BİZ KİMİZ? | WHO WE ARE |
| `home.whoTitleLine1` | Biz kimiz & | Who we are & |
| `home.whoTitleLine2` | nasıl çalışıyoruz | how we work |
| `home.whoP1` | Marmara Üniversitesi'nde öğrenciler tarafından yürütülen, veri merakını hayata geçen işlere dönüştüren bir topluluğuz. Hiyerarşi ve bürokrasiyle değil; sprintler, code review'lar ve demolarla çalışıyoruz. Üyelerimiz keşifsel analizden canlı ortamdaki veri mühendisliğine uzanan altı farklı departmanda yer alıyor. | We're a student-run collective at Marmara University turning curiosity about data into things that ship. We don't run on hierarchy and bureaucracy; we run on sprints, code reviews, and demos. Members move between six departments, from exploratory analysis to production data engineering. |
| `home.whoP2` | İster Excel'den gel, ister PyTorch'la başla; sana uygun bir yol ve seni sadece katılımcı olarak değil, üreten biri olarak gören bir topluluk var. | Whether you arrive knowing spreadsheets or PyTorch, there's a track for you, and a community that treats you like a builder, not an attendee. |
| `home.readStory` | Tüm hikâyemizi oku → | Read our full story → |
| `home.featuredEyebrow` | ÖNE ÇIKAN PROJELER | FEATURED PROJECTS |
| `home.featuredTitle` | Neler inşa ediyoruz | What we're building |
| `home.allProjects` | Tüm projeler → | All projects → |
| `home.viewDetails` | Detayları gör → | View details → |
| `home.comingSoon` | Çok yakında | Coming soon |
| `home.comingSoonSub` | İlk projelerimiz üzerinde çalışıyoruz. Ekibin neler inşa ettiğini görmek için yakında tekrar uğra. | Our first projects are in the works. Check back soon to see what the crew is building. |
| `home.deptEyebrow` | ALTI DEPARTMAN | SIX DEPARTMENTS |
| `home.deptTitle` | Tek kulüp, üretmenin altı yolu | One club, six ways to build |
| `home.deptSub` | Derinleş ya da ekipler arası dolaş. Biz her alanda somut işler üretiyoruz. | Dive deep or move across teams. We ship real work everywhere. |
| `home.ctaTitle` | Veriyle bir şeyler üretmeye hazır mısın? | Ready to build something with data? |
| `home.ctaSub` | Başvurular her dönem açık. Herhangi bir ön koşul yok; yeter ki öğrenmeye hevesin ve merakın olsun. | Applications are open every semester. There are no prerequisites; just bring your curiosity. |
| `home.joinClub` | Kulübe katıl → | Join the club → |

### Sayılar (`src/lib/constants.ts` → `HOME_STATS`)

| Sayı | Türkçe | English |
|---|---|---|
| 6 | DEPARTMAN | DEPARTMENTS |
| 400+ | AKTİF ÜYE | ACTIVE MEMBERS |
| 12 | ETKİNLİK / YIL | EVENTS / YEAR |

### Departman kartları (`src/lib/constants.ts` → `HOME_DEPARTMENTS`)

| Departman | Türkçe | English |
|---|---|---|
| 01 Data Insights | EDA, BI ve Tableau, Power BI ve Matplotlib ile veri hikâyeleştirme. | EDA, BI and storytelling with Tableau, Power BI and Matplotlib. |
| 02 Core AI | Python ile makine öğrenmesi, derin öğrenme, NLP ve bilgisayarlı görü. | Machine learning, deep learning, NLP and computer vision in Python. |
| 03 Data Pipelines | Veri mühendisliği, ETL, Hadoop/Spark, SQL/NoSQL ve bulut teknolojileri. | Data engineering, ETL, Hadoop/Spark, SQL/NoSQL and the cloud. |
| 04 Summits & Awards | Zirveler, ödül geceleri ve amiral gemisi etkinliğimiz Datathon & Hackathon. | Summits, award nights and our flagship Datathon & Hackathon. |
| 05 Finance & Corporate | Sponsorluk, bütçe yönetimi ve sektör paydaşlarıyla ilişkiler. | Sponsorship, budgeting and relationships with industry partners. |
| 06 PR | Sosyal medya, grafik tasarım, içerik üretimi ve medya ilişkileri. | Social media, graphic design, content and media relations. |

## 4. Hakkımızda

| Anahtar | Türkçe | English |
|---|---|---|
| `about.eyebrow` | KULÜP HAKKINDA | ABOUT THE CLUB |
| `about.heroTitle` | Biz bir kulüp değiliz. Bir üretim ekibiyiz. | We're not a club. We're a build crew. |
| `about.storyTitle` | Hikâyemiz | Our story |
| `about.storyP1` | Çoğu üniversite kulübü toplantılar, tutanaklar ve hiyerarşi etrafında şekillenir. Biz Veri Bilimi Kulübü’nü bunun tam tersini istediğimiz için kurduk. Geleneksel öğrenci kulübü kalıplarının dışına çıkan, küresel teknoloji toplulukları ve çevik startup’larla aynı dili konuşan modern bir yapı kurmak istedik. | Most university clubs run on meetings, minutes and hierarchy. We started the Data Science Club because we wanted the opposite: a place that felt like the data teams at the companies we admired. |
| `about.storyP2` | Biz de böyle bir yapı kurduk. Altı departman, farklı alanları bir araya getiren ekipler olarak birlikte çalışıyor. Projeler sprintlerle ilerliyor. Bilgi birkaç kişinin elinde tutulmuyor; kod incelemeleri, açık demolar ve birlikte üretim üzerinden paylaşılıyor. Yeni üyeler daha ilk aylarında bir grafik, bir model ya da çalışan bir veri hattı gibi somut bir şey ortaya koyuyor. | So we built one. Six departments operate like cross-functional squads. Work happens in sprints. Knowledge is shared in code reviews and open demos, not gatekept. New members ship something real in their first month, whether that's a chart, a model, or a data pipeline. |
| `about.pullQuote` | Veri yeni petrol değil, yeni toprak. Biz de bir kuşağa bu toprakta nasıl bir şeyler yetiştirileceğini öğretiyoruz. | Data isn't the new oil. It's the new soil, and we teach a generation how to grow things in it. |
| `about.storyP3` | Ortaya, küresel teknoloji toplulukları ve çevik startup’larla aynı dili konuşan, üreten ve birlikte öğrenen bir topluluk çıkıyor. Amacımız, üyelerimizin mezun olduklarında bu dili sadece biliyor olmaları değil, gerçek projelerde kullanabiliyor olmaları. | The result is a community fluent in the same language as global tech communities and agile startups, and ready to speak it the day they graduate. |
| `about.orgEyebrow` | ALTI DEPARTMAN | SIX DEPARTMENTS |
| `about.orgTitle` | Kulüp nasıl örgütlendi? | How the club is organised |
| `about.orgSub` | Kulübümüzün omurgasını oluşturan altı departman, teknik üretimden etkinlik yönetimine, finansal sürdürülebilirlikten iletişime kadar farklı alanlarda birlikte çalışır. | The six departments at the core of our club work side by side, from technical production to event management and from financial sustainability to communications. |
| `about.flowEyebrow` | NASIL ÇALIŞIYORUZ | HOW WE WORK |
| `about.flowTitle` | Departmanlar arası paslaşma | How work flows between departments |
| `about.flowSub` | Marmara Üniversitesi Veri Bilimi Kulübü olarak, geleneksel öğrenci kulübü kalıplarını yıkan, küresel teknoloji toplulukları ve çevik teknoloji startup'larıyla aynı dili konuşan modern bir yapı inşa ediyoruz. Kulübümüzün omurgasını oluşturan altı ana departman, hem birbirleriyle olan paslaşma hatlarını netleştirmek hem de ortak vizyonumuza hizmet ederken profesyonel sınırlarını korumak üzere bir arada çalışır. | As the Marmara University Data Science Club, we are building a modern structure that breaks traditional student club molds and speaks the same language as global tech communities and agile tech startups. The six core departments that form our backbone work together with clear handoffs and well-defined responsibilities toward a shared vision. |
| `about.purposeLabel` | AMAÇ | PURPOSE |
| `about.focusLabel` | ODAK ALANLARI | FOCUS AREAS |
| `about.visionLabel` | VİZYON | VISION |
| `about.teamEyebrow` | EKİBİMİZ | OUR TEAM |
| `about.teamTitle` | Bu yapının arkasındaki ekip | The people behind it |
| `about.meetEveryone` | Ekibi keşfet → | Meet everyone → |
| `about.peopleLabel` | KİŞİ | PEOPLE |
| `about.departmentsLabel` | DEPARTMAN | DEPARTMENTS |
| `about.viewProfile` | Profili gör → | View profile → |

### Departmanlar (`src/lib/constants.ts` → `ABOUT_DEPARTMENTS`)


#### 01 Data Insights

|  | Türkçe | English |
|---|---|---|
| Amaç | Ham verinin içindeki saklı hikâyeleri keşfetmek, anlamlandırmak ve karar alıcılara rehberlik edecek stratejik öngörülere dönüştürmek. Veri bilimi dünyasına adım atan üyelerin analitik kaslarını geliştireceği ilk duraktır. | Discover and make sense of the stories hidden in raw data, turning them into strategic insights that guide decision-makers. This is the first stop where members stepping into data science build their analytical muscles. |
| Vizyon | Kulüp içindeki ve dışındaki paydaşlara yalnızca grafikler sunan değil, “Veri ne anlatıyor?” sorusuna en net ve çarpıcı yanıtları veren, veri okuryazarlığı yüksek analistler yetiştirmek. | Train analysts with strong data literacy who don't just present charts to internal and external stakeholders, but give the clearest and most compelling answers to the question, "What is the data telling us?" |
| Odak etiketleri | Keşifçi Veri Analizi (EDA) · Veri temizleme · İstatistiksel çıkarımlar · İş zekâsı (BI) · Veri görselleştirme · Veri hikâyeleştirme · Tableau · Power BI · Matplotlib / Seaborn | Exploratory Data Analysis (EDA) · Data cleaning · Statistical inference · Business Intelligence (BI) · Data visualization · Data storytelling · Tableau · Power BI · Matplotlib / Seaborn |

#### 02 Core AI

|  | Türkçe | English |
|---|---|---|
| Amaç | İleri düzey algoritmalar ve matematiksel modeller geliştirerek yapay zekâ teknolojilerini teoriden pratiğe dökmek; ayrıca takımlar hâlinde Kaggle platformundaki yarışmalara ve projelere taşımak. Bu kulübün en derin, teknik ve modelleme odaklı yapay zekâ mutfağıdır. | Bring AI technologies from theory into practice by developing advanced algorithms and mathematical models, and take them into Kaggle competitions and projects as teams. This is the club's deepest, most technical, and modeling-focused AI kitchen. |
| Vizyon | Yapay zekâyı yalnızca tüketen değil, özgün modeller tasarlayan, küresel trendleri (LLM'ler, Generative AI) yakından takip eden ve ürettiği algoritmalarla katma değer sağlayan bir yapay zekâ mühendisliği ekolü yaratmak. | Create an AI engineering culture that doesn't just consume AI, but designs original models, closely tracks global trends (LLMs, Generative AI), and adds real value through the algorithms it builds. |
| Odak etiketleri | Makine Öğrenmesi · Derin Öğrenme · Doğal Dil İşleme (NLP) · Bilgisayarlı Görü · Python · Scikit-Learn · TensorFlow · PyTorch | Machine Learning · Deep Learning · Natural Language Processing (NLP) · Computer Vision · Python · Scikit-Learn · TensorFlow · PyTorch |

#### 03 Data Pipelines

|  | Türkçe | English |
|---|---|---|
| Amaç | Milyonlarca satırlık büyük verilerin güvenli, hızlı ve kesintisiz akışını sağlayacak dijital otoyolları (veri hatlarını) inşa etmek. Core AI ve Data Insights ekiplerinin çalışabilmesi için gerekli olan temiz veri altyapısını hazırlar. | Build the digital highways (data pipelines) that keep millions of rows of big data flowing safely, quickly, and without interruption. It prepares the clean data infrastructure that the Core AI and Data Insights teams need to work. |
| Vizyon | “Büyük veri” kaosunu düzenli ve işlenebilir bir sisteme dönüştüren, ölçeklenebilir altyapı mimarileri kurarak kulübü veri mühendisliği alanında lider konuma taşıyan sistem mimarları yetiştirmek. | Train system architects who turn "big data" chaos into organized, workable systems and build scalable infrastructure architectures that put the club in a leading position in data engineering. |
| Odak etiketleri | Veri Mühendisliği · ETL süreçleri · Büyük veri (Hadoop, Spark) · Veri tabanı yönetimi (SQL, NoSQL) · Web scraping · Bulut (AWS, Google Cloud) | Data Engineering · ETL processes · Big data (Hadoop, Spark) · Database management (SQL, NoSQL) · Web scraping · Cloud (AWS, Google Cloud) |

#### 04 Summits & Awards

|  | Türkçe | English |
|---|---|---|
| Amaç | Kulübün imza niteliğindeki makro etkinliklerini, ulusal çapta ses getirecek büyük ödüllü veri yarışmalarını (Datathon/Hackathon) ve yılın en prestijli veri bilimi zirvelerini baştan sona kurgulamak ve yönetmek. | Design and run the club's signature large-scale events, national prize-winning data competitions (Datathon/Hackathon), and the year's most prestigious data science summits from start to finish. |
| Vizyon | Marmara Üniversitesi'ni Türkiye'nin veri bilimi alanındaki en prestijli etkinlik merkezi hâline getirmek; sektörü ve akademiyi buluşturan kusursuz katılımcı deneyimleri tasarlamak. | Turn Marmara University into Turkey's most prestigious event hub for data science, and design seamless participant experiences that bring industry and academia together. |
| Odak etiketleri | Zirve planlaması · Ödül geceleri · Datathon · Hackathon · Organizasyon ve lojistik | Summit planning · Award nights · Datathon · Hackathon · Operations and logistics |

#### 05 Finance & Corporate Relations

|  | Türkçe | English |
|---|---|---|
| Amaç | Kulübün tüm finansal sürdürülebilirliğini sağlamak, bütçe yönetimini yapmak ve büyük projelerimiz (zirve, ödül gecesi, Datathon) için teknokent firmaları ve global şirketlerle stratejik sponsorluklar ve iş ortaklıkları kurmak. | Ensure the club's financial sustainability, manage the budget, and build strategic sponsorships and partnerships with technopark companies and global enterprises for our major projects (summit, award night, Datathon). |
| Vizyon | Kulübü finansal açıdan tamamen bağımsız ve kendi kendine yeten bir yapıya ulaştırmak; kurumsal şirketlerin Marmara Veri Bilimi Kulübü'nü bir “öğrenci topluluğu” olarak değil, profesyonel bir “stratejik partner” olarak görmesini sağlamak. | Make the club financially independent and self-sustaining, so corporate companies view the Marmara Data Science Club not as a "student group," but as a professional "strategic partner." |
| Odak etiketleri | Sponsorluk dosyaları · Kurumsal sunumlar · Bütçe planlaması · Nakit akışı yönetimi · Staj ve istihdam köprüleri · Mezun ağı | Sponsorship decks · Corporate presentations · Budget planning · Cash flow management · Internship and career bridges · Alumni network |

#### 06 PR

|  | Türkçe | English |
|---|---|---|
| Amaç | Kulübün dış dünyaya açılan vitrini, sesi ve yüzü olmak; kulübün ürettiği teknik projeleri, düzenlediği büyük etkinlikleri ve marka kimliğini topluluğa ve sektöre en estetik ve en doğru dille anlatmak. | Be the club's outward-facing showcase, voice, and face; communicate the technical projects we build, the major events we run, and our brand identity to the community and industry in the sharpest, most effective way. |
| Vizyon | Kulübün imajını bir teknoloji startup'ı netliğinde konumlandırmak; teknik ekiplerin ürettiği karmaşık kodları ve analizleri çarpıcı infografiklerle ve teknik blog yazılarıyla görünür kılarak kulübün marka değerini zirveye çıkarmak. | Position our club's image with the clarity of a tech startup, and take the club's brand value to the top by turning the complex code and analyses produced by our technical teams into striking infographics and technical blog posts. |
| Odak etiketleri | Sosyal medya yönetimi · Grafik tasarım · Marka kimliği ve kurumsal dil · Video ve içerik üretimi · Kriz iletişimi · Medya ilişkileri | Social media management · Graphic design · Brand identity and corporate voice · Video and content production · Crisis communications · Media relations |

### Departmanlar arası paslaşma (`src/lib/constants.ts` → `ABOUT_FLOW`; önizleme: DEV OPTIONS → Paslaşma)

| Adım | Türkçe | English |
|---|---|---|
| 1. Data Pipelines | Data Pipelines ham veriyi toplar ve temizler. | Data Pipelines collects and cleans the raw data. |
| 2. Core AI | Core AI bu veriyle modelleri eğitir. | Core AI trains models on that data. |
| 3. Data Insights | Data Insights model sonuçlarını analiz edip görselleştirir. | Data Insights analyzes and visualizes the model outputs. |
| 4. Summits & Awards | Summits & Awards büyük ölçekli datathon, ödül gecesi ve zirve kurgularını geliştirir. | Summits & Awards designs major datathons, award nights, and summits. |
| 5. Finance & Corporate Relations | Finance & Corporate Relations bu etkinlikler için şirketlerden sponsorluk ve ödül havuzu bütçesi sağlar. | Finance & Corporate Relations secures corporate sponsorships and prize pool budgets for these events. |
| 6. PR | PR departmanı etkinliği tüm Türkiye'ye duyurarak yüzlerce başvuru toplar. | The PR department announces the event across Turkey and brings in hundreds of applications. |

## 5. Ekip

| Anahtar | Türkçe | English |
|---|---|---|
| `team.eyebrow` | EKİP | THE TEAM |
| `team.heroTitle` | Kulüp yönetimimiz | Meet our leadership team |
| `team.heroSub` | Başkanımız ve departman liderlerimizle tanışın. | Meet our president and department leads. |
| `team.vpHeading` | VP | VP |
| `team.viewProfile` | Profili gör → | View profile → |
| `team.joinTitle` | Gelecek dönem burada sen de yer alabilirsin | Your name could be here next semester |
| `team.joinSub` | Ekibini seç, sorumluluk al ve bizimle birlikte üret. | Find your team, take ownership, and build with us. |
| `team.joinClub` | Kulübe katıl → | Join the club → |
| `roles.president` | BAŞKAN | PRESIDENT |
| `roles.presidentFull` | KULÜP BAŞKANI | CLUB PRESIDENT |
| `roles.vicePresident` | BAŞKAN YARDIMCISI | VICE PRESIDENT |
| `roles.secretary` | SEKRETER | SECRETARY |
| `roles.director` | DİREKTÖR | DIRECTOR |

## 6. Üye profili

| Anahtar | Türkçe | English |
|---|---|---|
| `member.backToTeam` | ← EKİP | ← THE TEAM |
| `member.about` | {name} hakkında | About {name} |
| `member.focusLabel` | ODAK ALANLARI | FOCUS AREAS |
| `member.writingTitle` | Son yazılar | Latest writing |
| `member.allPosts` | Tüm yazılar → | All posts → |
| `member.previous` | ÖNCEKİ | PREVIOUS |
| `member.next` | SONRAKİ | NEXT |
| `member.linkedin` | LinkedIn | LinkedIn |
| `member.github` | GitHub | GitHub |
| `member.email` | E-posta | Email |
| `member.website` | Web Sitesi | Website |

### Kısa tanıtımlar (`src/data/members.json` → `tagline`)

| Üye | Türkçe | English |
|---|---|---|
| Ahmet Kipici | Sahadan gelen pratik tecrübeyi vizyoner liderlikle harmanlayarak DSC Marmara’yı geleceğe taşıyan kulüp başkanı. | Leading DSC Marmara with hands-on field experience and a clear vision for high-impact, real-world tech communities. |
| Irmak Evci | Kulübün başkan yardımcısıdır. | Vice president of the club. |
| Esim Ebrar Gökyaka | Kulübün sekreteridir. | Secretary of the club. |
| Emirhan Kunt | Data Insights departmanını eş direktör olarak yönetmektedir. | Co-director of the Data Insights department. |
| İhsan Sami Ceran | Data Insights departmanını eş direktör olarak yönetmektedir. | Co-director of the Data Insights department. |
| Sadık Çoban | İstatistiksel temelleri modern yapay zekâ sistemleri ve web mimarileriyle buluşturan geliştirici. | Bridging statistical theory, modern machine learning, and the digital infrastructure powering DSC Marmara. |
| Ahmet Hamza Mülayim | Core AI departmanını eş direktör olarak yönetmektedir. | Co-director of the Core AI department. |
| Alihan Telli | Data Pipelines departmanını eş direktör olarak yönetmektedir. | Co-director of the Data Pipelines department. |
| Samet Demirkaya | Data Pipelines departmanını eş direktör olarak yönetmektedir. | Co-director of the Data Pipelines department. |
| Elif Esma Tuna | Summits & Awards departmanını eş direktör olarak yönetmektedir. | Co-director of the Summits & Awards department. |
| Tarık Emre Ermiş | Summits & Awards departmanını eş direktör olarak yönetmektedir. | Co-director of the Summits & Awards department. |
| Cansu Okcu | Finance & Corporate departmanını eş direktör olarak yönetmektedir. | Co-director of the Finance & Corporate department. |
| Cem Evrim Kılıçdoğan | Finance & Corporate departmanını eş direktör olarak yönetmektedir. | Co-director of the Finance & Corporate department. |
| Elif Ayşe Şen | PR departmanını eş direktör olarak yönetmektedir. | Co-director of the PR department. |
| Esma Özcan | PR departmanını eş direktör olarak yönetmektedir. | Co-director of the PR department. |

### Standart rol metinleri (`src/data/members.json` → `bio1`)

Kendi biyografisini vermemiş üyelerde profilde görünen kalıp cümle.

| Üye | Türkçe | English |
|---|---|---|
| Irmak Evci | Irmak, kulübün başkan yardımcısıdır. | Irmak is the club's vice president. |
| Esim Ebrar Gökyaka | Esim Ebrar, kulübün sekreteridir. | Esim Ebrar is the club's secretary. |
| Emirhan Kunt | Emirhan, Data Insights departmanını eş direktör olarak yönetmektedir. | Emirhan is a co-director of the Data Insights department. |
| Ahmet Hamza Mülayim | Ahmet Hamza, Core AI departmanını eş direktör olarak yönetmektedir. | Ahmet Hamza is a co-director of the Core AI department. |
| Elif Esma Tuna | Elif Esma, Summits & Awards departmanını eş direktör olarak yönetmektedir. | Elif Esma is a co-director of the Summits & Awards department. |
| Tarık Emre Ermiş | Tarık Emre, Summits & Awards departmanını eş direktör olarak yönetmektedir. | Tarık Emre is a co-director of the Summits & Awards department. |
| Cansu Okcu | Cansu, Finance & Corporate departmanını eş direktör olarak yönetmektedir. | Cansu is a co-director of the Finance & Corporate department. |
| Cem Evrim Kılıçdoğan | Cem Evrim, Finance & Corporate departmanını eş direktör olarak yönetmektedir. | Cem Evrim is a co-director of the Finance & Corporate department. |

## 7. Odak alanı etiketleri (`src/lib/skills.ts`)

| English | Türkçe |
|---|---|
| Machine Learning | Makine Öğrenmesi |
| Statistics | İstatistik |
| Data Analysis | Veri Analizi |
| Sports Analytics | Spor Analitiği |
| Computer Vision | Bilgisayarlı Görü |
| Data Storytelling | Veri Hikâyeleştirme |
| Dashboards | Gösterge Panelleri |
| EDA | EDA |
| MLOps | MLOps |
| Web Development | Web Geliştirme |
| Full-Stack Architecture | Sistem Mimarisi |
| Python | Python |
| R | R |
| SQL | SQL |
| PyTorch | PyTorch |
| Power BI | Power BI |
| Tableau | Tableau |
| Excel | Excel |
| Notion | Notion |
| Financial Analysis | Finansal Analiz |
| Accounting | Muhasebe |
| Sponsorship | Sponsorluk |
| Budgeting | Bütçe Planlaması |
| Negotiation | Müzakere |
| Partnerships | İş Birlikleri |
| Executive Leadership | Topluluk Liderliği |
| Strategic Vision | Stratejik Vizyon |
| Field Experience | Saha Deneyimi |
| Operational Scaling | Operasyonel Ölçekleme |
| Agile Management | Çevik Yönetim |
| Community Management | Topluluk Yönetimi |
| Operations | Operasyon Yönetimi |
| Planning | Planlama |
| People Management | Ekip Yönetimi |
| Documentation | Dokümantasyon |
| Coordination | Koordinasyon |
| Event Management | Etkinlik Yönetimi |
| Hackathons | Hackathon |
| Brand Identity | Marka Kimliği |
| Graphic Design | Grafik Tasarım |
| Content Creation | İçerik Üretimi |
| Social Media | Sosyal Medya |

## 8. Blog

| Anahtar | Türkçe | English |
|---|---|---|
| `blog.eyebrow` | BLOG | THE BLOG |
| `blog.heroTitle` | Üretim ekibinden köşe yazıları | Columns from the build crew |
| `blog.heroSub` | Veriyle çalışan öğrencilerden gerçek görüşler, saha notları ve deneyimler. | Real opinions, field notes, and lessons from students working with data. |
| `blog.featuredBadge` | ÖNE ÇIKAN · GÖRÜŞ | FEATURED · OPINION |
| `blog.all` | Tümü | All |
| `blog.backToBlog` | ← BLOG'A DÖN | ← BACK TO BLOG |
| `blog.writtenBy` | YAZAN | WRITTEN BY |
| `blog.readSuffix` | OKUMA | READ |
| `blog.comingSoon` | Yazılar çok yakında | Posts coming soon |
| `blog.comingSoonSub` | İlk köşe yazılarımız üzerinde çalışıyoruz. Ekibin veriyle ilgili neler yazdığını okumak için yakında tekrar uğrayın. | Our first columns are in the works. Check back shortly to read what the crew is writing about data. |
| `blog.related` | Diğer yazılar | More from the blog |
| `article.toc` | İçindekiler | Contents |
| `article.calloutNote` | Not | Note |
| `article.calloutFinding` | Bulgu | Finding |
| `article.calloutWarning` | Dikkat | Caveat |

## 9. İletişim

| Anahtar | Türkçe | English |
|---|---|---|
| `contact.eyebrow` | BİZE MERHABA DE | SAY HELLO |
| `contact.heroTitle` | Birlikte bir şeyler inşa edelim | Let's build something together |
| `contact.heroSub` | Projelerimize ortak olmak, kulübe katılmak veya merak ettiklerini sormak için bize bir mesaj bırakman yeterli. | Have an idea, want to collaborate, or thinking of joining? Leave us a message. |
| `contact.fullName` | AD SOYAD | FULL NAME |
| `contact.email` | E-POSTA | EMAIL |
| `contact.subject` | KONU | SUBJECT |
| `contact.message` | MESAJ | MESSAGE |
| `contact.send` | Mesajı gönder → | Send message → |
| `contact.sending` | Gönderiliyor… | Sending… |
| `contact.sendError` | Mesajın gönderilemedi. Lütfen tekrar dene ya da doğrudan e-posta gönder. | Your message couldn't be sent. Please try again, or email us directly. |
| `contact.rateError` | Çok fazla mesaj gönderildi. Lütfen birkaç dakika bekleyip tekrar dene. | Too many messages sent. Please wait a few minutes and try again. |
| `contact.namePlaceholder` | Ada Lovelace | Ada Lovelace |
| `contact.emailPlaceholder` | sen@example.com | you@example.com |
| `contact.subjectPlaceholder` | Kulübe katılmak istiyorum | I'd like to join the club |
| `contact.messagePlaceholder` | Ne inşa etmek istediğini anlat… | Tell us what you want to build… |
| `contact.nameError` | Lütfen adını gir. | Please enter your name. |
| `contact.emailError` | Lütfen geçerli bir e-posta gir. | Please enter a valid email. |
| `contact.subjectError` | Lütfen bir konu ekle. | Please add a subject. |
| `contact.messageError` | Lütfen bir mesaj yaz. | Please write a message. |
| `contact.successTitle` | Mesaj gönderildi! | Message sent! |
| `contact.successBody` | Bize ulaştığın için teşekkürler. Birkaç gün içinde döneceğiz. | Thanks for reaching out. We'll get back to you within a couple of days. |
| `contact.sendAnother` | Yeni mesaj gönder | Send another |
| `contact.emailUs` | BİZE YAZ | EMAIL US |
| `contact.follow` | TAKİP ET | FOLLOW |
| `contact.applyTitle` | Başvurmaya hazır mısın? | Ready to apply? |
| `contact.applyBody` | Üyelik başvuruları her dönem açık. | Membership applications are open every semester. |

## 10. Alt bilgi (footer)

| Anahtar | Türkçe | English |
|---|---|---|
| `footer.description` | Marmara Üniversitesi Veri Bilimi Kulübü, geleneksel öğrenci kulübü anlayışının dışına çıkıyor; küresel teknoloji toplulukları ve çevik teknoloji startup'larıyla aynı dili konuşan modern bir yapı kuruyor. | The Data Science Club of Marmara University breaks traditional student-club molds and speaks the same language as global tech communities and agile startups. |
| `footer.exploreTitle` | Keşfet | Explore |
| `footer.departmentsTitle` | Departmanlar | Departments |
| `footer.linkHome` | Anasayfa | Home |
| `footer.linkAbout` | Kulüp Hakkında | About the Club |
| `footer.linkBlog` | Blog & Köşe Yazıları | Blog & Columns |
| `footer.linkContact` | İletişim | Contact |
| `footer.copyright` | © 2026 Data Science Club · Marmara Üniversitesi. Tüm hakları saklıdır. | © 2026 Data Science Club · Marmara University. All rights reserved. |

## 11. 404 sayfası

| Anahtar | Türkçe | English |
|---|---|---|
| `notFound.title` | Sayfa bulunamadı | Page not found |
| `notFound.body` | Aradığın sayfa mevcut değil ya da taşınmış. | The page you were looking for doesn't exist or has moved. |
| `notFound.home` | Anasayfaya dön → | Back to home → |

## Tek dilde kalanlar

Bilerek çevrilmeyenler (ayrıntı: `TRANSLATIONS.md` → "Türkçede de İngilizce kalanlar"):

- Departman adları (Data Insights, Core AI, Data Pipelines, Summits & Awards, Finance & Corporate, PR) ve footer'daki departman linkleri
- İletişim formundan kulübe gelen e-postanın konusundaki `[İletişim]` etiketi
- Araç ve marka adı olan etiketler (Python, SQL, Power BI, Notion…)
